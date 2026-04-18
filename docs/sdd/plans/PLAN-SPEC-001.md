# Plan Técnico SPEC-001: Traductor de Textos Seleccionados

> **Ref. Spec:** [SPEC-001](../specs/SPEC-001-traductor-textos-seleccionados.md)
> **Versión:** 1.0 | **Fecha:** 2026-04-15 | **Autor:** Claude (SDD Agent)

---

## 1. Decisión Arquitectónica (Resumen)

- **Patrón elegido:** Content Script global + Background Handler (patrón existente del proyecto)
- **Justificación:** El proyecto ya enruta toda traducción a través del service worker (`background/controller.ts`). El nuevo feature sigue el mismo patrón: el content script maneja DOM/UI, el background ejecuta la Translator API. Esto mantiene consistencia y centraliza el acceso a la API de Chrome AI en una sola capa.
- **Impacto en módulos existentes:**
  - `background/controller.ts` — nuevo método `handleSelectionMessage`
  - `background/index.ts` — nuevo case `SELECTION_MESSAGE`
  - `globalStrings.ts` — nueva storage key + nuevo message type
  - `useFeaturesStatus` — nuevo feature `selectionTranslator`
  - `PopupContent.tsx` — nuevo `ExtensionToggle` en pestaña Funcionalidades

---

## 2. Estructura de Módulos / Capas

```
src/
  config/utils/
    globalStrings.ts                         → [MODIFICAR] nueva STORAGE_KEY + BG_MESSAGE_TYPE

  infrastructure/datasource/
    (sin cambios — localTranslator y localLanguageDetector ya existen)

  presentation/
    entrypoints/
      selectionLocalTranslator.content/
        index.tsx                            → [NUEVO] content script, matches: <all_urls>

    components/
      SelectionLocalTranslator/
        SelectionLocalTranslator.tsx         → [NUEVO] componente raíz (orchestrador)
        SelectionBubble/
          SelectionBubble.tsx                → [NUEVO] burbuja flotante sobre selección
          __test__/
            SelectionBubble.test.tsx
        SelectionTooltip/
          SelectionTooltip.tsx               → [NUEVO] panel con traducción y controles
          __test__/
            SelectionTooltip.test.tsx
        hooks/
          useTextSelection.ts                → [NUEVO] detecta selección y calcula posición
          useSelectionTranslation.ts         → [NUEVO] gestiona estado de traducción
          __test__/
            useTextSelection.test.ts
            useSelectionTranslation.test.ts

    hooks/
      useSelectionTranslatorStatus/
        useSelectionTranslatorStatus.ts      → [NUEVO] storage hook para toggle on/off
        useSelectionTranslatorStatus.test.ts

      useFeaturesStatus/
        useFeaturesStatus.ts                 → [MODIFICAR] agregar selectionTranslator

    components/
      Popup/
        PopupContent/
          PopupContent.tsx                   → [MODIFICAR] nuevo ExtensionToggle

    entrypoints/
      background/
        controller.ts                        → [MODIFICAR] nuevo handleSelectionMessage
        index.ts                             → [MODIFICAR] nuevo case SELECTION_MESSAGE
```

---

## 3. Modelos de Datos

```typescript
// Estado de una selección de texto activa
interface TextSelection {
  text: string
  rect: DOMRect   // posición en pantalla para ubicar la burbuja
}

// Estado de la traducción
type TranslationStatus = 'idle' | 'translating' | 'downloading' | 'done' | 'error'

interface TranslationState {
  status: TranslationStatus
  translatedText: string | null
  sourceLanguage: string | null
  downloadProgress?: number   // [0, 1] — AC: Edge case #2 (modelo descargando)
  errorMessage?: string       // AC: Edge case #3 y #4
}

// Mensaje enviado al background (nuevo tipo)
interface SelectionMessagePayload {
  type: 'SELECTION_MESSAGE'
  data: string          // texto seleccionado
  target: string        // idioma destino (ej: "es")
  onProgress?: never    // el progreso se maneja por callback separado
}

// Respuesta del background
interface SelectionMessageResponse {
  translatedText: string
  sourceLanguage: string
}
```

---

## 4. Contratos: Casos de Uso e Interfaces

### Hook: `useTextSelection`

```typescript
interface UseTextSelectionReturn {
  selection: TextSelection | null   // null cuando no hay selección válida (< 3 chars)
  clearSelection: () => void
}

// Lógica interna:
// - Escucha evento 'selectionchange' en document
// - Filtra: text.trim().length < 3 → selection = null (AC-02)
// - clearSelection: window.getSelection()?.removeAllRanges()
```

### Hook: `useSelectionTranslation`

```typescript
interface UseSelectionTranslationReturn {
  state: TranslationState
  translate: (text: string, targetLanguage: string) => Promise<void>
}

// Lógica interna:
// - translate() envía SELECTION_MESSAGE al background
// - Maneja estados: translating → done | error (AC-03, AC-04)
// - Descarga del modelo: el background llama onProgress via callback
//   NOTE: La Translator API no permite progreso async cross-message.
//   Alternativa: el background retorna un objeto con translatedText o
//   un indicador de "downloading". Ver ADR-001.
```

### Background: `handleSelectionMessage`

```typescript
// En backgroundController:
handleSelectionMessage: async (
  text: string,
  targetLanguage: string,
  onProgress?: (loaded: number) => void
) => Promise<{ translatedText: string; sourceLanguage: string } | undefined>

// Lógica:
// 1. localLanguageDetector.detectLanguage(text) → sourceLanguage (AC-04)
// 2. localTranslator.create({ sourceLanguage, targetLanguage, onProgress })
// 3. translator.translate(text) → translatedText
// 4. Return { translatedText, sourceLanguage }
// No bloquea si source === target (AC-05): Chrome Translator lo maneja nativamente
```

### Hook: `useSelectionTranslatorStatus`

```typescript
// Usa createStorageHook<boolean> — patrón idéntico a useTranslatorStatus
export const useSelectionTranslatorStatus = createStorageHook<boolean>(
  GLOBAL_STRINGS.STORAGE_KEYS.SELECTION_TRANSLATOR_IS_ACTIVE,
  true   // por defecto activado
)
```

---

## 5. Contratos de API HTTP / IPC

No aplica HTTP. Contrato IPC (browser runtime messages):

```
Emisor:    content script selectionLocalTranslator.content
Receptor:  background/index.ts

Request:
  { type: 'SELECTION_MESSAGE', data: string, target: string }

Response (éxito):
  { translatedText: string, sourceLanguage: string }

Response (error / API no disponible):
  undefined  → el content script muestra el estado de error adecuado
```

---

## 6. Estrategia de Error Handling

| Capa          | Condición                                     | Representación                        | UI mostrada                                      |
| ------------- | --------------------------------------------- | ------------------------------------- | ------------------------------------------------ |
| Content/Hook  | `text.trim().length < 3`                      | `selection = null`                    | Burbuja no aparece (AC-02)                       |
| Background    | `!localTranslator.isAvailable()`              | Retorna `undefined`                   | "Funcionalidad no disponible en este navegador" (Edge #4) |
| Background    | Modelo descargando                            | `onProgress` callback (ver ADR-001)   | Indicador de progreso con porcentaje (Edge #2)   |
| Background    | Error de red durante descarga                 | `catch → return undefined`            | Mensaje de error + botón reintentar (Edge #3)    |
| Content/Hook  | `response === undefined`                      | `TranslationState.status = 'error'`   | Mensaje de error en tooltip                      |
| UI            | Nueva selección con tooltip abierto           | clearSelection() + reset state        | Tooltip anterior cierra, nueva burbuja (Edge #5) |
| UI            | Scroll mientras tooltip visible               | `scroll` event listener → clear       | Tooltip se cierra (Edge #6)                      |

---

## 7. Estrategia de Testing

| Módulo                          | Tipo         | Herramienta              | Qué cubrir                                                      |
| ------------------------------- | ------------ | ------------------------ | --------------------------------------------------------------- |
| `useTextSelection`              | Unit         | Vitest + happy-dom       | selección válida, filtro < 3 chars, whitespace, clearSelection  |
| `useSelectionTranslatorStatus`  | Unit         | Vitest                   | getItem/setItem/watchItem — patrón existente en otros hooks     |
| `backgroundController.handleSelectionMessage` | Unit | Vitest + mocks | traducción exitosa, API no disponible, source === target        |
| `SelectionBubble`               | Component    | Testing Library          | render con posición, no render sin selección                    |
| `SelectionTooltip`              | Component    | Testing Library          | estados: translating, done, error, downloading; botón copiar   |
| `useSelectionTranslation`       | Unit         | Vitest                   | estados de la máquina: idle→translating→done, idle→error       |

**Cobertura mínima:** happy path + todos los edge cases definidos en la spec.

---

## 8. Log de Decisiones (ADR)

| Fecha      | Decisión                                                              | Alternativas descartadas                                    | Razón                                                                                                            |
| ---------- | --------------------------------------------------------------------- | ----------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| 2026-04-15 | Traducción vía background (mensaje IPC)                              | Llamar Translator API directamente desde content script     | Consistencia con el patrón existente (AC-04 requiere detect + translate, que ya está en `handleChatMessage`)     |
| 2026-04-15 | Burbuja aparece al selección, tooltip al hacer hover                 | Tooltip directo al soltar el mouse                          | AC-01 define burbuja pequeña → hover → tooltip. Reduce ruido visual al seleccionar accidentalmente               |
| 2026-04-15 | Traducir en el momento del hover (lazy), no al seleccionar           | Pre-traducir al detectar selección                          | AC-03 dice "cuando el usuario hace hover... se expande un tooltip que muestra la traducción". Evita traducciones no usadas |
| 2026-04-15 | ADR-001: Progreso de descarga — retornar status 'downloading' desde background, content script polling | Callback onProgress cross-message | `browser.runtime.sendMessage` es request/response: no soporta callbacks intermedios. La alternativa es que el background retorne `{ status: 'downloading' }` y el content script reintenta hasta obtener `{ status: 'done', translatedText }` con un pequeño delay. O bien, mostrar spinner sin porcentaje exacto. **Decisión: spinner sin porcentaje** (simplifica el IPC; el porcentaje exacto no es requerimiento AC, solo edge case #2 menciona "indicador de progreso con porcentaje" — ver si el usuario quiere reconsiderar este detalle) |
| 2026-04-15 | Content script en `<all_urls>` con `matches: ["*://*/*"]`             | Listar dominios específicos                                 | AC-01 requiere "cualquier sitio web". Shadow DOM garantiza aislamiento de estilos (AC NFR)                       |
| 2026-04-15 | Reusar `useLocalTranslatorTargetLanguage` para idioma destino        | Hook nuevo exclusivo para selection translator              | AC-08 requiere persistencia. El storage key existente `localTranslatorTargetLanguage` ya cumple — mismo idioma destino para toda la extensión es UX coherente |

---

## 9. Riesgos y Dependencias Externas

| Riesgo / Dependencia                             | Probabilidad | Impacto | Mitigación                                                                                     |
| ------------------------------------------------ | ------------ | ------- | ---------------------------------------------------------------------------------------------- |
| Translator API no disponible (Chrome < 138)      | Media        | Alto    | Verificar `localTranslator.isAvailable()` antes de activar el feature; mostrar mensaje claro   |
| Content script bloqueado por CSP de la página   | Baja         | Medio   | Shadow DOM es inyectado por el extension runtime, no por el CSP de la página (Edge #8 de spec) |
| Interferencia con otros event listeners de la página | Baja     | Bajo    | Usar `selectionchange` en `document` con `{ capture: false }` y limpiar en cleanup del hook   |
| Progreso de descarga no reportable via IPC       | Alta         | Bajo    | ADR-001: spinner sin porcentaje exacto. Si el usuario requiere porcentaje, se extiende con `browser.runtime.connect` (Long-lived connection) en una iteración futura |
| Permiso `<all_urls>` en manifest                 | Media        | Medio   | WXT genera el manifest automáticamente desde el `matches` del content script. Verificar que no requiera host_permissions adicional |
