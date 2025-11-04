const getValueByKey = (obj, key) => {
  if (typeof obj !== 'object') {
    return obj;
  }

  if (!obj.hasOwnProperty(key)) {
    return;
  }

  return obj[key];
};

/**
 * createGetter - creates function getter which allows select value from object
 * @param {string} path - the strings path separated by dot
 * @returns {function} - function-getter which allow get value from object by set path
 */
export function createGetter(path) {
  return function(obj) {
    const keys = path.split('.');

    let value = {...obj};
    for (const key of keys) {
      value = getValueByKey(value, key);
    }
    return value;
  };
}

