/**
 * UI components and utilities for QuickMessageOptions
 */

import React from "react";
import { Delete, NotebookPen, Plus } from "lucide-react";
import { LabelOptions } from "./types";

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
  const titleMap: Record<LabelOptions, string> = {
    add: "Add Quick Message",
    update: "Update Quick Message",
    delete: "Delete Quick Message",
  };
  
  return titleMap[label];
};

/**
 * Gets the appropriate dialog description based on the action type
 * @param label - The action type (add, update, delete)
 * @returns string - The dialog description
 */
export const getDialogDescription = (label: LabelOptions): string => {
  const descriptionMap: Record<LabelOptions, string> = {
    add: "Add a quick message here. Click save when you're done.",
    update: "Update a quick message here. Click save when you're done.",
    delete: "Delete a quick message here. Click save when you're done.",
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