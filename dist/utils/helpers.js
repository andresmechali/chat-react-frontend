export const loadWasm = async (url, importObject = {module: {}, env: {abort() {
}}}) => {
  const result = await WebAssembly.instantiateStreaming(fetch(url), importObject);
  return result.instance;
};
export const parseTime = (date) => {
  const addZero = (number) => `${number < 10 ? "0" : ""}${number}`;
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${addZero(hours)}:${addZero(minutes)}`;
};
