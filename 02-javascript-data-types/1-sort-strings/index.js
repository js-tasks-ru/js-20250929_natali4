/**
 * sortStrings - sorts array of string by two criteria "asc" or "desc"
 * @param {string[]} arr - the array of strings
 * @param {string} [param="asc"] param - the sorting type "asc" or "desc"
 * @returns {string[]}
 */
export function sortStrings(arr, param = 'asc') {
  if (param === 'asc') {
    const res = arr.toSorted((a, b) => a.localeCompare(b, 'ru', { sensitivity: 'accent' }) > 0 ? 1 : -1);
    console.log(res);
    return res;
  }

  const res = arr.toSorted((a, b) => a.localeCompare(b, 'ru', { sensitivity: 'accent' }) > 0 ? -1 : 1);
  console.log(res);
  return res;
}
