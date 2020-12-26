// Loads WASM file
export const loadWasm = async (
  url: string,
  importObject = { module: {}, env: { abort() {} } }
) => {
  const result = await WebAssembly.instantiateStreaming(
    fetch(url),
    importObject
  );
  return result.instance; // or, return result;
};

// Parses date object into HH:MM
export const parseTime = (date: Date) => {
  const addZero = (number: number) => `${number < 10 ? "0" : ""}${number}`;
  const hours = date.getHours();
  const minutes = date.getMinutes();
  return `${addZero(hours)}:${addZero(minutes)}`;
};
