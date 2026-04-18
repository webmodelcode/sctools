# Spec SPEC-001: Traductor de Textos Seleccionados

> **Versión:** 1.0 | **Fecha:** 2026-04-15 | **Estado:** aprobado
> **Autor:** Claude (SDD Agent) | **Revisado por:** Juan Pablo Leon (2026-04-15)

---

## 1. Contexto y Problema

- **Problema concreto:** La funcionalidad de traducción está limitada a 4 camsites específicos (StripChat, Chaturbate, SM, CamSoda). Los usuarios necesitan traducir textos en otros sitios web y recurren a extensiones externas como QTranslate, que causa interferencia con el funcionamiento principal de redna-models.
- **Motivación:** Ampliar la cobertura del servicio de traducción para eliminar la dependencia de extensiones de terceros que generan conflictos. Reducir fricción del usuario al consolidar toda la traducción en una sola herramienta.
- **Fuera de alcance:**
  - No incluye: traducción de página completa (full-page translation)
  - No incluye: traducción de texto en imágenes (OCR)
  - No incluye: edición o reemplazo del texto original en la página

---

## 2. Historias de Usuario

| ID    | Como                  | Quiero                                                                                   | Para                                                              |
| ----- | --------------------- | ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| US-01 | Modelo webcam (usuario) | seleccionar texto en cualquier sitio web y ver su traducción en un tooltip              | entender contenido en otros idiomas sin salir de la página        |
| US-02 | Modelo webcam (usuario) | elegir el idioma destino de la traducción desde el tooltip                               | traducir al idioma que necesite en cada momento                   |
| US-03 | Modelo webcam (usuario) | copiar la traducción al portapapeles con un click                                        | usar el texto traducido en otra parte rápidamente                 |
| US-04 | Modelo webcam (usuario) | activar o desactivar esta funcionalidad desde el popup de la extensión                   | controlar cuándo la burbuja de traducción aparece al seleccionar  |

---

## 3. Criterios de Aceptación

### US-01 — Traducción de texto seleccionado

**AC-01: Burbuja aparece al seleccionar texto (≥3 caracteres)**
- **Dado que** la funcionalidad está activada y el usuario está en cualquier sitio web
- **Cuando** selecciona texto de 3 o más caracteres
- **Entonces** aparece una burbuja pequeña con el logo EW posicionada justo encima de la selección

**AC-02: Burbuja NO aparece con selección menor a 3 caracteres**
- **Dado que** la funcionalidad está activada
- **Cuando** el usuario selecciona texto de menos de 3 caracteres (o solo espacios en blanco)
- **Entonces** no aparece ninguna burbuja

**AC-03: Hover en burbuja despliega tooltip con traducción**
- **Dado que** la burbuja EW es visible sobre una selección de texto
- **Cuando** el usuario hace hover sobre la burbuja
- **Entonces** se expande un tooltip que muestra la traducción del texto seleccionado, con el idioma fuente auto-detectado y el idioma destino configurado (español por defecto)

**AC-04: Detección automática del idioma fuente**
- **Dado que** el usuario seleccionó texto y el tooltip se está desplegando
- **Cuando** el sistema procesa la traducción
- **Entonces** detecta automáticamente el idioma del texto seleccionado usando la Language Detector API y lo usa como idioma fuente para la traducción

**AC-05: Traducción cuando idioma fuente coincide con destino**
- **Dado que** el texto seleccionado está en el mismo idioma que el idioma destino configurado
- **Cuando** el tooltip se despliega
- **Entonces** se muestra el texto traducido normalmente (sin bloqueo ni mensaje especial)

### US-02 — Selector de idioma destino

**AC-06: Dropdown de idioma destino en el tooltip**
- **Dado que** el tooltip de traducción está visible
- **Cuando** el usuario observa el tooltip
- **Entonces** ve un menú desplegable con el idioma destino actual (español por defecto) que permite cambiar a otros idiomas disponibles

**AC-07: Cambio de idioma destino re-traduce el texto**
- **Dado que** el tooltip muestra una traducción y el usuario cambia el idioma destino en el dropdown
- **Cuando** selecciona un nuevo idioma
- **Entonces** el texto se re-traduce al nuevo idioma seleccionado y el tooltip actualiza su contenido

**AC-08: Idioma destino persiste entre sesiones**
- **Dado que** el usuario cambió el idioma destino en el tooltip
- **Cuando** realiza una nueva selección de texto (en la misma o diferente página)
- **Entonces** el idioma destino seleccionado previamente se mantiene como valor por defecto

### US-03 — Copiar traducción

**AC-09: Botón copiar en el tooltip**
- **Dado que** el tooltip muestra una traducción completada
- **Cuando** el usuario hace click en el botón/ícono de copiar
- **Entonces** el texto traducido se copia al portapapeles del sistema y se muestra feedback visual de confirmación (ej: ícono cambia a checkmark por 2 segundos)

### US-04 — Toggle de activación

**AC-10: Switch visible en el popup de la extensión**
- **Dado que** el usuario abre el popup de redna-models
- **Cuando** navega a la pestaña "Funcionalidades"
- **Entonces** ve un toggle "Traductor de Selección" con estado encendido/apagado

**AC-11: Desactivar la funcionalidad**
- **Dado que** el toggle está encendido y el usuario lo desactiva
- **Cuando** selecciona texto en cualquier página
- **Entonces** no aparece ninguna burbuja ni tooltip de traducción

**AC-12: Activar la funcionalidad**
- **Dado que** el toggle estaba apagado y el usuario lo enciende
- **Cuando** selecciona texto (≥3 caracteres) en cualquier página
- **Entonces** la burbuja de traducción aparece normalmente

---

## 4. Requisitos No Funcionales

| Categoría      | Requisito                                          | Métrica / Umbral                        |
| -------------- | -------------------------------------------------- | --------------------------------------- |
| Rendimiento    | Tiempo de aparición de la burbuja tras selección   | < 100ms                                 |
| Rendimiento    | Tiempo de traducción (modelo ya descargado)        | < 2s para textos de hasta 500 chars     |
| Compatibilidad | Navegador soportado                                | Chrome 138+ (requerido por Translator API) |
| UX             | Burbuja no debe interferir con la interacción de la página | La burbuja no bloquea clicks en la página subyacente |
| UX             | Tooltip no debe cubrir el texto seleccionado       | Posicionado encima o debajo sin solapar la selección |
| Aislamiento    | Estilos del tooltip no afectan la página host      | Shadow DOM con CSS encapsulado          |

---

## 5. Casos de Borde y Errores

| #  | Caso                              | Entrada / Condición                              | Comportamiento Esperado                                                    |
| -- | --------------------------------- | ------------------------------------------------ | -------------------------------------------------------------------------- |
| 1  | Selección solo espacios           | Texto seleccionado es solo whitespace             | No aparece burbuja                                                         |
| 2  | Modelo no descargado              | Translator API requiere descarga del modelo       | Tooltip muestra indicador de progreso de descarga con porcentaje           |
| 3  | Descarga falla                    | Error de red durante descarga del modelo          | Tooltip muestra mensaje de error con opción de reintentar                  |
| 4  | API no disponible                 | Translator API o LanguageDetector no disponibles  | Tooltip muestra mensaje "Funcionalidad no disponible en este navegador"    |
| 5  | Nueva selección con tooltip abierto | Usuario selecciona otro texto mientras tooltip visible | Tooltip anterior se cierra, nueva burbuja aparece en nueva selección    |
| 6  | Scroll con tooltip abierto        | Usuario hace scroll mientras tooltip está visible | Tooltip se cierra automáticamente                                          |
| 7  | Selección en input/textarea       | Texto seleccionado dentro de un campo editable    | Burbuja aparece normalmente (el texto es seleccionable)                    |
| 8  | Página con Content Security Policy | CSP restrictiva bloquea inyección                | Content script con Shadow DOM funciona independientemente del CSP de la página |

---

## 6. Dependencias con Otras Specs

- **Depende de:** Ninguna — usa infraestructura existente (localTranslator, localLanguageDetector)
- **Requerida por:** Ninguna
- **Relacionada:** Funcionalidad de traducción de chat en camsites (comparte infraestructura de traducción)

---

## 7. Glosario del Dominio

| Término               | Definición en este contexto                                                                                  |
| --------------------- | ------------------------------------------------------------------------------------------------------------ |
| Burbuja               | Elemento UI pequeño (logo EW) que aparece sobre el texto seleccionado como disparador de la traducción       |
| Tooltip               | Panel expandido que se muestra al hacer hover en la burbuja, contiene la traducción y controles              |
| Camsite               | Sitio web de modelaje webcam (StripChat, Chaturbate, SM, CamSoda)                                           |
| Modelo de traducción  | Modelo de ML descargado localmente por la Translator API de Chrome para traducir entre un par de idiomas     |
| EW                    | Estrellas Webcam — marca del producto redna-models                                                                |

---

## 8. Preguntas Abiertas

| #  | Pregunta                                                              | Responsable | Fecha límite | Resolución |
| -- | --------------------------------------------------------------------- | ----------- | ------------ | ---------- |
| —  | No hay preguntas abiertas                                             | —           | —            | —          |

---

## 9. Historial de Cambios

| Versión | Fecha      | Cambio                                            | Autor              |
| ------- | ---------- | ------------------------------------------------- | ------------------- |
| 1.0     | 2026-04-15 | Versión inicial                                   | Claude (SDD Agent)  |