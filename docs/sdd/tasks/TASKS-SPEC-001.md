# Tareas SPEC-001: Traductor de Textos Seleccionados

> **Spec:** [SPEC-001](../specs/SPEC-001-traductor-textos-seleccionados.md) | **Plan:** [PLAN-SPEC-001](../plans/PLAN-SPEC-001.md)
> **Fecha inicio:** 2026-04-16 | **Target release:** v1.5.0

---

## Convención de Tareas

- **Granularidad:** cada tarea = 1 PR mínimo, idealmente 1 commit semántico.
- **Naming:** `[CAPA] verbo + objeto` → ej: `[CONFIG] agregar storage key X`
- **Definition of Done (global):** tests pasan en CI + `pnpm compile` limpio + revisado contra spec.
- **Capas disponibles:** `[CONFIG]` `[APP]` `[UI]` `[TEST]`

---

## Tareas

### [CONFIG] — Constantes y configuración global

- [ ] **[CONFIG-001]** Agregar `SELECTION_TRANSLATOR_IS_ACTIVE` a `GLOBAL_STRINGS.STORAGE_KEYS` y `SELECTION_MESSAGE` a `GLOBAL_STRINGS.BG_MESSAGE_TYPE`
  - **Archivo:** `src/config/utils/globalStrings.ts`
  - **AC ref:** AC-10, AC-11, AC-12 (storage key para el toggle), AC-03 (message type para IPC)
  - **Done cuando:** `pnpm compile` pasa sin errores; los nuevos campos son accesibles desde cualquier módulo importador
  - **Bloqueado por:** —

---

### [APP] — Lógica de negocio / Background

- [ ] **[APP-001]** Agregar `handleSelectionMessage` al `backgroundController` con detección de idioma y traducción dinámica (fuente auto-detectada, destino configurable)
  - **Archivo:** `src/presentation/entrypoints/background/controller.ts`
  - **AC ref:** AC-03 (traducción al hacer hover), AC-04 (detección automática idioma), AC-05 (source === target no bloquea)
  - **Contrato:**
    ```typescript
    handleSelectionMessage: async (text: string, target: string) =>
      Promise<{ translatedText: string; sourceLanguage: string } | undefined>
    ```
  - **Comportamiento edge:**
    - Si `!localTranslator.isAvailable() || !localLanguageDetector.isAvailable()` → retorna `undefined` (Edge #4)
    - Si `source === target` → deja que Chrome Translator maneje (no bloquear, per AC-05)
  - **Done cuando:** tests en `__test__/controller.test.ts` cubren: happy path, API no disponible, source === target
  - **Bloqueado por:** CONFIG-001

- [ ] **[APP-002]** Registrar `SELECTION_MESSAGE` en el message router del background
  - **Archivo:** `src/presentation/entrypoints/background/index.ts`
  - **AC ref:** AC-03 (IPC funcional entre content script y background)
  - **Done cuando:** nuevo `case GLOBAL_STRINGS.BG_MESSAGE_TYPE.SELECTION_MESSAGE:` añadido con el mismo patrón async que los casos existentes; `pnpm compile` limpio
  - **Bloqueado por:** APP-001

---

### [UI] — Hooks

- [ ] **[UI-001]** Crear hook `useSelectionTranslatorStatus` via `createStorageHook`
  - **Archivo:** `src/presentation/hooks/useSelectionTranslatorStatus/useSelectionTranslatorStatus.ts`
  - **AC ref:** AC-10, AC-11, AC-12 (toggle on/off persiste en storage)
  - **Patrón:** idéntico a `useTranslatorStatus` — una línea con `createStorageHook<boolean>(STORAGE_KEY, true)`
  - **Done cuando:** test `useSelectionTranslatorStatus.test.ts` cubre `getItem`, `setItem`, `watchItem`; default value es `true`
  - **Bloqueado por:** CONFIG-001

- [ ] **[UI-002]** Crear hook `useTextSelection` para detectar selección válida y calcular posición
  - **Archivo:** `src/presentation/components/SelectionLocalTranslator/hooks/useTextSelection.ts`
  - **AC ref:** AC-01 (burbuja aparece ≥3 chars), AC-02 (no aparece <3 chars / solo whitespace), Edge #5 (nueva selección reemplaza anterior), Edge #6 (scroll cierra)
  - **Contrato:**
    ```typescript
    interface UseTextSelectionReturn {
      selection: { text: string; rect: DOMRect } | null
      clearSelection: () => void
    }
    ```
  - **Lógica:** escucha `selectionchange` en `document`; filtra `text.trim().length < 3`; limpia en scroll (`scroll` event); cleanup en unmount
  - **Done cuando:** tests en `__test__/useTextSelection.test.ts` cubren: selección válida, texto < 3 chars, solo whitespace, clearSelection, limpieza al scroll
  - **Bloqueado por:** —

- [ ] **[UI-003]** Crear hook `useSelectionTranslation` para gestionar el ciclo de vida de la traducción
  - **Archivo:** `src/presentation/components/SelectionLocalTranslator/hooks/useSelectionTranslation.ts`
  - **AC ref:** AC-03 (estado translating → done), AC-05 (sin bloqueo si mismo idioma), Edge #3 (error con retry), Edge #4 (API no disponible)
  - **Contrato:**
    ```typescript
    type TranslationStatus = 'idle' | 'translating' | 'done' | 'error'
    interface UseSelectionTranslationReturn {
      status: TranslationStatus
      translatedText: string | null
      sourceLanguage: string | null
      errorMessage?: string
      translate: (text: string, targetLanguage: string) => Promise<void>
      reset: () => void
    }
    ```
  - **Lógica:** `translate()` envía `SELECTION_MESSAGE` al background; mapea `undefined` response a status `'error'`
  - **Done cuando:** tests cubren máquina de estados: idle→translating→done, idle→translating→error, reset
  - **Bloqueado por:** APP-002

---

### [UI] — Componentes

- [ ] **[UI-004]** Crear componente `SelectionBubble` (burbuja flotante con logo EW sobre la selección)
  - **Archivo:** `src/presentation/components/SelectionLocalTranslator/SelectionBubble/SelectionBubble.tsx`
  - **AC ref:** AC-01 (burbuja aparece posicionada sobre selección), AC-02 (no render si selection es null), AC-03 (dispara traducción en hover)
  - **Props:**
    ```typescript
    interface SelectionBubbleProps {
      rect: DOMRect
      onHover: () => void   // dispara translate en el padre
    }
    ```
  - **Posicionamiento:** `position: fixed`, coordenadas calculadas desde `rect.top` y `rect.left + rect.width / 2`; usar `pointer-events: auto` en la burbuja, burbuja no bloquea clicks fuera (NFR)
  - **Done cuando:** tests cubren: render con rect válido, no render si omitido; `onHover` se llama al `mouseenter`
  - **Bloqueado por:** —

- [ ] **[UI-005]** Crear componente `SelectionTooltip` (panel con traducción, selector de idioma y botón copiar)
  - **Archivo:** `src/presentation/components/SelectionLocalTranslator/SelectionTooltip/SelectionTooltip.tsx`
  - **AC ref:** AC-03 (muestra traducción), AC-06 (dropdown idioma destino), AC-07 (re-traduce al cambiar idioma), AC-08 (idioma persiste — via `useLocalTranslatorTargetLanguage`), AC-09 (botón copiar con feedback visual), Edge #3 (botón reintentar en error), Edge #4 (mensaje API no disponible)
  - **Props:**
    ```typescript
    interface SelectionTooltipProps {
      status: TranslationStatus
      translatedText: string | null
      sourceLanguage: string | null
      errorMessage?: string
      onRetry: () => void
      onLanguageChange: (lang: string) => void
      targetLanguage: string
    }
    ```
  - **Nota AC-08:** usar hook existente `useLocalTranslatorTargetLanguage` para persistencia del idioma destino — no crear storage key nuevo
  - **Done cuando:** tests cubren estados: translating (spinner), done (texto + idioma fuente), error (mensaje + retry), botón copiar (mock clipboard API, checkmark 2s)
  - **Bloqueado por:** UI-003

- [ ] **[UI-006]** Crear componente orquestador `SelectionLocalTranslator` y entrypoint de content script
  - **Archivos:**
    - `src/presentation/components/SelectionLocalTranslator/SelectionLocalTranslator.tsx` — componente raíz
    - `src/presentation/entrypoints/selectionLocalTranslator.content/index.tsx` — entrypoint WXT con `createShadowRootUi`, `matches: ["*://*/*"]`
  - **AC ref:** AC-01, AC-02 (orquesta useTextSelection → SelectionBubble), AC-03 (burbuja onHover → translate), AC-11 (si `!isEnabled` render null), AC-12 (si `isEnabled` render normal), Edge #5 (nueva selección cierra tooltip anterior — estado unificado en este componente), Edge #6 (clearSelection en scroll ya manejado por useTextSelection)
  - **Lógica interna:**
    - Lee `useSelectionTranslatorStatus()` → si false, retorna null
    - Usa `useTextSelection()` para `selection`
    - Usa `useSelectionTranslation()` para estado de traducción
    - Muestra `SelectionBubble` cuando `selection !== null`
    - Muestra `SelectionTooltip` cuando `isTooltipOpen` (estado local toggle por hover en burbuja)
    - En nueva selección (selection cambia): reset translation state
  - **Done cuando:** `pnpm dev` carga el content script en cualquier página; tests de integración del componente cubren: disabled no muestra nada, enabled + selección muestra burbuja, hover muestra tooltip
  - **Bloqueado por:** UI-001, UI-002, UI-004, UI-005

---

### [UI] — Popup / Toggle

- [ ] **[UI-007]** Agregar `selectionTranslator` a `useFeaturesStatus`
  - **Archivo:** `src/presentation/hooks/useFeaturesStatus/useFeaturesStatus.ts`
  - **AC ref:** AC-10 (toggle accesible desde popup), AC-11, AC-12
  - **Cambios:** importar `useSelectionTranslatorStatus`; añadir a `Promise.all` en init; añadir `watchItem`; exponer `selectionTranslator: { isEnabled, toggle }` en el return
  - **Done cuando:** test de `useFeaturesStatus` actualizado incluye `selectionTranslator` en el objeto retornado; `pnpm compile` limpio
  - **Bloqueado por:** UI-001

- [ ] **[UI-008]** Agregar `ExtensionToggle` para "Traductor de Selección" en `PopupContent`
  - **Archivo:** `src/presentation/components/Popup/PopupContent/PopupContent.tsx`
  - **AC ref:** AC-10 (toggle visible en pestaña Funcionalidades), AC-11, AC-12
  - **Cambios:** desestructurar `selectionTranslator` de `useFeaturesStatus`; añadir `<ExtensionToggle>` con `featureName="Traductor de Selección"` y `tooltipText` descriptivo
  - **Done cuando:** test de `PopupContent` verifica que el toggle "Traductor de Selección" está presente en el DOM
  - **Bloqueado por:** UI-007

---

## Cobertura de Criterios de Aceptación

| AC     | Descripción (resumen)                         | Tareas que lo implementan        |
| ------ | --------------------------------------------- | -------------------------------- |
| AC-01  | Burbuja aparece con selección ≥3 chars        | UI-002, UI-004, UI-006           |
| AC-02  | Burbuja NO aparece con <3 chars / whitespace  | UI-002, UI-004                   |
| AC-03  | Hover → tooltip con traducción                | APP-001, APP-002, UI-003, UI-005 |
| AC-04  | Detección automática idioma fuente            | APP-001                          |
| AC-05  | Sin bloqueo si source === target              | APP-001                          |
| AC-06  | Dropdown idioma destino en tooltip            | UI-005                           |
| AC-07  | Cambio idioma re-traduce                      | UI-003, UI-005                   |
| AC-08  | Idioma destino persiste (reusa storage existente) | UI-005                       |
| AC-09  | Botón copiar con feedback visual              | UI-005                           |
| AC-10  | Toggle visible en popup / pestaña Funcionalidades | UI-007, UI-008               |
| AC-11  | Desactivar oculta burbuja                     | UI-001, UI-006, UI-007, UI-008   |
| AC-12  | Activar muestra burbuja                       | UI-001, UI-006, UI-007, UI-008   |

**Edge cases cubiertos:**
- Edge #1 (whitespace) → UI-002
- Edge #2 (modelo descargando — spinner sin porcentaje per ADR-001) → UI-005
- Edge #3 (descarga falla, retry) → UI-003, UI-005
- Edge #4 (API no disponible) → APP-001, UI-005
- Edge #5 (nueva selección con tooltip abierto) → UI-006
- Edge #6 (scroll cierra tooltip) → UI-002
- Edge #7 (selección en input/textarea) → cubierto por comportamiento estándar del DOM
- Edge #8 (CSP) → cubierto por Shadow DOM en entrypoint (UI-006)

---

## Orden de implementación (DAG)

```
CONFIG-001
  ├── APP-001
  │     └── APP-002
  │           └── UI-003
  │                 └── UI-005
  │                       └── UI-006 ←─────────────┐
  ├── UI-001                                        │
  │     ├── UI-006 ◄──────────────────────────────┤
  │     ├── UI-007                                  │
  │           └── UI-008                            │
  └── (UI-002 y UI-004 sin bloqueo externo)         │
        ├── UI-002 ─────────────────────────► UI-006
        └── UI-004 ─────────────────────────► UI-006
```

**Recomendación de inicio:**
1. CONFIG-001 (desbloquea todo)
2. En paralelo: APP-001 + UI-001 + UI-002 + UI-004
3. APP-002 → UI-003 → UI-005 → UI-006
4. UI-007 → UI-008

---

## Seguimiento

| Tarea     | Descripción                                        | Estado       | PR / Commit | Notas |
| --------- | -------------------------------------------------- | ------------ | ----------- | ----- |
| CONFIG-001 | Agregar storage key + message type a globalStrings | ✅ done | src/config/utils/globalStrings.ts | —     |
| APP-001   | `handleSelectionMessage` en backgroundController   | ✅ done | src/presentation/entrypoints/background/controller.ts | —     |
| APP-002   | Case `SELECTION_MESSAGE` en background/index.ts    | ✅ done | src/presentation/entrypoints/background/index.ts | —     |
| UI-001    | Hook `useSelectionTranslatorStatus`                | ✅ done | src/presentation/hooks/useSelectionTranslatorStatus/ | —     |
| UI-002    | Hook `useTextSelection`                            | ✅ done | src/presentation/components/SelectionLocalTranslator/hooks/useTextSelection.ts | —     |
| UI-003    | Hook `useSelectionTranslation`                     | ✅ done | src/presentation/components/SelectionLocalTranslator/hooks/useSelectionTranslation.ts | —     |
| UI-004    | Componente `SelectionBubble`                       | ✅ done | src/presentation/components/SelectionLocalTranslator/SelectionBubble/SelectionBubble.tsx | —     |
| UI-005    | Componente `SelectionTooltip`                      | ✅ done | src/presentation/components/SelectionLocalTranslator/SelectionTooltip/SelectionTooltip.tsx | —     |
| UI-006    | Componente `SelectionLocalTranslator` + entrypoint | ⬜ pendiente | —           | —     |
| UI-007    | `selectionTranslator` en `useFeaturesStatus`       | ⬜ pendiente | —           | —     |
| UI-008    | `ExtensionToggle` en `PopupContent`                | ⬜ pendiente | —           | —     |

**Leyenda:** ⬜ pendiente | 🔄 en progreso | ✅ done | 🚫 bloqueado | ⏭️ descartado
