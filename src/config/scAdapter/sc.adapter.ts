import { SC_STRINGS } from "./sc.strings";

const getScElementByClassName = (elmClass: string) => {
  try {
    return document.getElementsByClassName(elmClass).item(0) || null;
  } catch (error) {
    console.warn(error);
    return null;
  }
};
const getScElementById = (elmID: string) => {
  try {
    return document.getElementById(elmID) || null;
  } catch (error) {
    console.warn(error);
    return null;
  }
};

const isScElementsReady = () => {
  const scClassElements = SC_STRINGS.SC_CLASSES;
  const scIdElements = SC_STRINGS.SC_IDS;

  const classElementsValidation = scClassElements.every((elmClass) => {
    if (!getScElementByClassName(elmClass)) {
      return false;
    }
    return true;
  });

  const idElementsValidation = scIdElements.every((elmId) => {
    if (!getScElementById(elmId)) {
      return false;
    }
    return true;
  });

  return classElementsValidation && idElementsValidation;
};

export const scAdapter = {
  getScElementByClassName,
  getScElementById,
  isScElementsReady,
};
