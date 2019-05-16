export function queryString(url, key) {
  const query = url.split('?')[1];
  const obj = {};
  if (query) {
    const parms = query.split('&');
    for (let i = 0; i < parms.length; i++) {
      const name = parms[i].split('=')[0];
      const value = parms[i].split('=')[1];
      obj[name] = value;
    }
    if (Object.hasOwnProperty.call(obj, key)) {
      return obj[key];
    }
  }
  return false;
}
