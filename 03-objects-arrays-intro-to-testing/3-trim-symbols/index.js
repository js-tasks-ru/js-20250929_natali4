/**
 * trimSymbols - removes consecutive identical symbols if they quantity bigger that size
 * @param {string} string - the initial string
 * @param {number} size - the allowed size of consecutive identical symbols
 * @returns {string} - the new string without extra symbols according passed size
 */
export function trimSymbols(string, size) {
  if (size === 0) {
    return '';
  }

  if (size === undefined) {
    return string;
  }

  let finalString = '';
  let prevValue = '';
  let repeatCount = 0;
  for (let i = 0; i < string.length; i++) {
    const currentSymbol = string[i];

    if (prevValue === currentSymbol && repeatCount + 1 <= size) {
      repeatCount += 1;
      finalString += currentSymbol;
      prevValue = currentSymbol;
    }

    if (prevValue !== currentSymbol) {
      repeatCount = 1;
      finalString += currentSymbol;
      prevValue = currentSymbol;
    }
  }

  return finalString;
}
