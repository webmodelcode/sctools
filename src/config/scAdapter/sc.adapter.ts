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

  return (
    scClassElements.every(
      (elmClass) => getScElementByClassName(elmClass) !== null
    ) && scIdElements.every((elmId) => getScElementById(elmId) !== null)
  );
};

export const scAdapter = {
  getScElementByClassName,
  getScElementById,
  isScElementsReady,
};
