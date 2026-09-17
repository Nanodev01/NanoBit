/**
 * Verificador de JWT compatible con el Edge Runtime de Next.js.
 * Utiliza la Web Crypto API nativa (crypto.subtle) para verificar firmas HS256
 * sin requerir módulos de Node.js incompatibles con Edge.
 */

function base64UrlToUint8Array(base64Url: string): Uint8Array {
  let base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
  while (base64.length % 4) {
    base64 += "=";
  }
  const binary = atob(base64);
  const buffer = new ArrayBuffer(binary.length);
  const bytes = new Uint8Array(buffer);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

export async function verifyJwtEdge(
  token: string,
  secret: string
): Promise<{ valid: boolean; payload?: Record<string, unknown> }> {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) {
      return { valid: false };
    }

    const [headerB64, payloadB64, signatureB64] = parts;
    const encoder = new TextEncoder();

    // Importar la clave secreta con Web Crypto API
    const key = await crypto.subtle.importKey(
      "raw",
      encoder.encode(secret),
      { name: "HMAC", hash: "SHA-256" },
      false,
      ["verify"]
    );

    const dataToVerify = encoder.encode(`${headerB64}.${payloadB64}`);
    const signatureBytes = base64UrlToUint8Array(signatureB64);

    // Verificar firma criptográfica
    const isValidSignature = await crypto.subtle.verify(
      "HMAC",
      key,
      signatureBytes as unknown as BufferSource,
      dataToVerify as unknown as BufferSource
    );

    if (!isValidSignature) {
      return { valid: false };
    }

    // Decodificar y validar tiempo de expiración
    const payloadJson = JSON.parse(
      new TextDecoder().decode(base64UrlToUint8Array(payloadB64))
    );

    if (payloadJson.exp && typeof payloadJson.exp === "number") {
      const currentTimeInSeconds = Math.floor(Date.now() / 1000);
      if (currentTimeInSeconds >= payloadJson.exp) {
        return { valid: false }; // Token expirado
      }
    }

    return { valid: true, payload: payloadJson };
  } catch {
    return { valid: false };
  }
}
