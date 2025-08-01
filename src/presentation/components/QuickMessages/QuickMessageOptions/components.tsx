/**
 * UI components and utilities for QuickMessageOptions
 */

import React from "react";
import { Delete, NotebookPen, Plus } from "lucide-react";
import { LabelOptions } from "./types";
import { COMPONENTS } from "./quickMessageOptions.strings.json";

/**
 * Returns the appropriate icon component based on the action type
 * @param label - The action type (add, update, delete)
 * @returns React.ReactElement - The corresponding icon component
 */
export const getActionIcon = (label: LabelOptions): React.ReactElement => {
  const iconMap: Record<LabelOptions, React.ReactElement> = {
    add: <Plus />,
    delete: <Delete />,
    update: <NotebookPen />,
  };

  return iconMap[label];
};

/**
 * Gets the appropriate dialog title based on the action type
 * @param label - The action type (add, update, delete)
 * @returns string - The dialog title
 */
export const getDialogTitle = (label: LabelOptions): string => {
  const strings = COMPONENTS.GET_DIALOG_TITLE;
  const titleMap: Record<LabelOptions, string> = {
    add: strings.ADD,
    update: strings.UPDATE,
    delete: strings.DELETE,
  };

  return titleMap[label];
};

/**
 * Gets the appropriate dialog description based on the action type
 * @param label - The action type (add, update, delete)
 * @returns string - The dialog description
 */
export const getDialogDescription = (label: LabelOptions): string => {
  const strings = COMPONENTS.GET_DIALOG_DESCRIPTION;
  const descriptionMap: Record<LabelOptions, string> = {
    add: strings.ADD,
    update: strings.UPDATE,
    delete: strings.DELETE,
  };

  return descriptionMap[label];
};

/**
 * Determines if the message input should be shown based on the action type
 * @param label - The action type (add, update, delete)
 * @returns boolean - True if message input should be shown
 */
export const shouldShowMessageInput = (label: LabelOptions): boolean => {
  return label !== "delete";
};
