import type { Meta, StoryObj } from '@storybook/react';
import { LanguageSelector } from './LanguageSelector';
import { useState } from 'react';

// Componente wrapper que simula el comportamiento del hook
const LanguageSelectorWrapper = () => {
  try {
    return <LanguageSelector />;
  } catch (error) {
    // Si hay error con el hook, mostramos un placeholder
    return (
      <div className="p-4 border border-gray-300 rounded-md bg-gray-50">
        <p className="text-sm text-gray-600">
          Componente LanguageSelector (requiere contexto de extensión)
        </p>
        <div className="mt-2 px-3 py-2 border border-gray-300 rounded-md bg-white">
          Selecciona un lenguaje...
        </div>
      </div>
    );
  }
};

const meta: Meta<typeof LanguageSelectorWrapper> = {
  title: 'Components/LanguageSelector',
  component: LanguageSelectorWrapper,
  parameters: {
    layout: 'centered',
    docs: {
      description: {
        component: 'Componente selector de idiomas que permite al usuario elegir el idioma de destino para las traducciones. Utiliza un popover con búsqueda para facilitar la selección entre los idiomas soportados.',
      },
    },
  },
  tags: ['autodocs'],
  argTypes: {
    // El componente no tiene props, pero podemos documentar su comportamiento
  },
};

export default meta;
type Story = StoryObj<typeof meta>;

/**
 * Estado por defecto del selector de idiomas.
 * Muestra el componente con el idioma español seleccionado por defecto.
 */
export const Default: Story = {
  render: () => <LanguageSelectorWrapper />,
};

/**
 * Selector de idiomas en un contenedor con fondo oscuro.
 * Útil para verificar el contraste y la legibilidad en temas oscuros.
 */
export const DarkBackground: Story = {
  render: () => (
    <div className="dark bg-gray-900 p-4 rounded-lg">
      <LanguageSelectorWrapper />
    </div>
  ),
  parameters: {
    backgrounds: {
      default: 'dark',
    },
  },
};

/**
 * Selector de idiomas con documentación de uso.
 * Incluye información sobre cómo interactuar con el componente.
 */
export const WithDocumentation: Story = {
  render: () => (
    <div className="space-y-4">
      <div className="text-sm text-gray-600 mb-4">
        <p><strong>Instrucciones de uso:</strong></p>
        <ul className="list-disc list-inside space-y-1">
          <li>Haz clic en el botón para abrir el selector</li>
          <li>Usa la barra de búsqueda para filtrar idiomas</li>
          <li>Selecciona un idioma de la lista</li>
          <li>El idioma seleccionado se guardará automáticamente</li>
        </ul>
      </div>
      <LanguageSelectorWrapper />
    </div>
  ),
  parameters: {
    docs: {
      description: {
        story: 'Esta historia muestra el componente con documentación de uso para ayudar a los usuarios a entender cómo interactuar con él.',
      },
    },
  },
};