// Loads WASM file
export const loadWasm = async (
  url,
  importObject = { module: {}, env: { abort() {} } }
) => {
  const result = await WebAssembly.instantiateStreaming(
    fetch(url),
    importObject
  );
  return result.instance; // or, return result;
};
