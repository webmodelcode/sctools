/**
 * Compares two semantic version strings and determines if the first is greater than the second.
 *
 * Pads version numbers to three segments if necessary.
 *
 * @param v1 - The first semantic version string (e.g., "1.2.3").
 * @param v2 - The second semantic version string (e.g., "1.2.0").
 * @returns True if v1 is greater than v2, otherwise false.
 */

export const compareSemanticVersions = (
  checkVersion: string,
  currentVersion: string,
): boolean => {
  const checkParts = checkVersion.split(".").map(Number);
  const currentParts = currentVersion.split(".").map(Number);

  while (checkParts.length < 3) checkParts.push(0);
  while (currentParts.length < 3) currentParts.push(0);

  for (let i = 0; i < 3; i++) {
    if (checkParts[i] > currentParts[i]) return true;
    if (checkParts[i] < currentParts[i]) return false;
  }
  return false;
};
