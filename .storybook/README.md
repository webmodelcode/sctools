# Storybook - Documentación de Componentes

Este proyecto utiliza Storybook para documentar y desarrollar componentes de UI de forma aislada.

## 🚀 Inicio Rápido

### Ejecutar Storybook

```bash
pnpm run storybook
```

Esto iniciará Storybook en `http://localhost:6006`

### Construir Storybook para producción

```bash
pnpm run build-storybook
```

## 📁 Estructura

```
.storybook/
├── main.ts          # Configuración principal
├── preview.ts       # Configuración global de preview
└── README.md        # Esta documentación

src/
├── presentation/
│   ├── components/
│   │   ├── ui/               # Componentes shadcn (excluidos)
│   │   └── [otros componentes personalizados]
│   └── assets/
│       └── globals.css    # Estilos globales (Tailwind)
```

## 🎨 Componentes Documentados

### Componentes Personalizados
Actualmente, los componentes de shadcn/ui están excluidos de la documentación de Storybook.
Solo se documentan componentes personalizados del proyecto que no dependan de:
- Imports de WXT (`#imports`)
- Contexto de extensión del navegador

### Componentes Excluidos
- **LanguageSelector**: Selector de idiomas para traducciones

## 📝 Crear Nuevas Stories

### 1. Estructura básica de una story

```typescript
import type { Meta, StoryObj } from '@storybook/react';
import { MiComponente } from './MiComponente';

const meta: Meta<typeof MiComponente> = {
  title: 'Categoria/MiComponente',
  component: MiComponente,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Descripción del componente',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // Definir controles para las props
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    // Props por defecto
  },
};
```

### 2. Convenciones de nomenclatura

- **Archivos**: `ComponentName.stories.tsx`
- **Títulos**: Usar categorías como `UI/`, `Components/`, `Forms/`
- **Stories**: Nombres descriptivos como `Default`, `WithIcon`, `Loading`

### 3. Documentación automática

- Usar `tags: ['autodocs']` para generar documentación automática
- Agregar descripciones en `parameters.docs.description`
- Documentar props con `argTypes`

## 🎯 Mejores Prácticas

### Stories
1. **Una story por variante**: Crea stories separadas para diferentes estados
2. **Nombres descriptivos**: Usa nombres que expliquen claramente qué muestra la story
3. **Documentación**: Incluye descripciones para componentes y stories
4. **Controles interactivos**: Configura `argTypes` para props importantes

### Componentes con Dependencias Externas
Para componentes que dependen de hooks o contextos externos:

```typescript
// Crear un wrapper que maneje las dependencias
const ComponentWrapper = () => {
  try {
    return <ComponenteOriginal />;
  } catch (error) {
    return (
      <div className="p-4 border border-gray-300 rounded-md bg-gray-50">
        <p className="text-sm text-gray-600">
          Componente requiere contexto de extensión
        </p>
      </div>
    );
  }
};
```

### Estilos
- Los estilos globales de Tailwind se cargan automáticamente
- Usar `className` para personalizar estilos en stories
- Aprovechar las variables CSS definidas en `globals.css`

## 🔧 Configuración

### Alias de Rutas
El alias `~@` está configurado para apuntar a `src/`, permitiendo importaciones como:
```typescript
import { utils } from '~@/presentation/lib/utils';
```

### Addons Incluidos
- **@storybook/addon-docs**: Documentación automática
- **@storybook/addon-a11y**: Pruebas de accesibilidad
- **@storybook/addon-onboarding**: Guía de inicio
- **@chromatic-com/storybook**: Integración con Chromatic

### Temas
Storybook está configurado con soporte para temas claro y oscuro:
- Usar el selector de tema en la barra de herramientas
- Los componentes heredan automáticamente las variables CSS del tema

## 🐛 Solución de Problemas

### Error de importaciones
Si hay errores con las importaciones `~@/`, verificar:
1. La configuración del alias en `.storybook/main.ts`
2. Que las rutas sean correctas

### Componentes que no se renderizan
Para componentes que dependen de contextos externos:
1. Crear wrappers que manejen las dependencias
2. Usar try/catch para mostrar placeholders
3. Documentar las limitaciones en la descripción

### Estilos no aplicados
Verificar que:
1. `globals.css` esté importado en `preview.ts`
2. Las clases de Tailwind estén disponibles
3. Las variables CSS estén definidas correctamente

## 📚 Recursos

- [Documentación oficial de Storybook](https://storybook.js.org/docs)
- [Storybook para React](https://storybook.js.org/docs/react/get-started/introduction)
- [Addon Docs](https://storybook.js.org/docs/react/writing-docs/introduction)
- [Controles interactivos](https://storybook.js.org/docs/react/essentials/controls)