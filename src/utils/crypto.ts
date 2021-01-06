export const encrypt = async (text: string, password: string) => {
  if (!text || !password) {
    return "";
  }
  // Generate key
  const pwUtf8 = new TextEncoder().encode(password);
  const pwHash = await crypto.subtle.digest("SHA-256", pwUtf8);
  //const iv = window.crypto.getRandomValues(new Uint8Array(12));
  // TODO: generate a random array for encryption, and send this array to server
  const iv = new Uint8Array([
    16,
    7,
    205,
    121,
    175,
    40,
    251,
    49,
    107,
    188,
    243,
    244,
  ]);

  const algorithm = {
    name: "AES-GCM",
    iv,
  };

  const key = await crypto.subtle.importKey("raw", pwHash, algorithm, false, [
    "encrypt",
  ]);

  // Encode text
  const textUint8 = new TextEncoder().encode(text);

  // Encrypt using key
  const cipherBuffer = await crypto.subtle.encrypt(algorithm, key, textUint8);

  const cipherArray = Array.from(new Uint8Array(cipherBuffer));
  const cipherText = cipherArray
    .map((byte) => String.fromCharCode(byte))
    .join("");
  const cipherBase64 = btoa(cipherText);

  const ivHex = Array.from(iv)
    .map((b) => ("00" + b.toString(16)).slice(-2))
    .join("");

  return ivHex + cipherBase64;
};

export const decrypt = async (cipherText: string, password: string) => {
  if (!cipherText || !password) {
    return "";
  }
  // Generate key
  const pwUtf8 = new TextEncoder().encode(password);
  const pwHash = await crypto.subtle.digest("SHA-256", pwUtf8);

  // Get iv from cipherText
  const iv = cipherText
    .slice(0, 24)
    .match(/.{2}/g)
    ?.map((byte) => parseInt(byte, 16));

  if (!iv) {
    return "";
  }

  const algorithm = { name: "AES-GCM", iv: new Uint8Array(iv) };

  const key = await crypto.subtle.importKey("raw", pwHash, algorithm, false, [
    "decrypt",
  ]);

  const cipherStr = atob(cipherText.slice(24));
  const match = cipherStr.match(/[\s\S]/g);
  if (!match) {
    return "";
  }
  const ctUint8 = new Uint8Array(
    match.map((ch) => ch.charCodeAt(0))
  );

  const plainBuffer = await crypto.subtle.decrypt(algorithm, key, ctUint8);
  return new TextDecoder().decode(plainBuffer);
};
