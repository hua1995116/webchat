export function sort(a, b) {
  return a > b ? `${a}-${b}` : `${b}-${a}`; // 大的放前面
}

export function removeBlank(str) {
  return str.replace(/\s/g, '');
}