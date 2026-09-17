import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

/**
 * Verifica la autenticidad del token JWT del administrador.
 * Valida la firma criptográfica, no solo la existencia de la cookie.
 * Lanza un error si el token es inválido, expirado o inexistente.
 */
export async function verifyAuth(): Promise<{ userId: string; email: string }> {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET no está definido en las variables de entorno.");
  }

  const cookieStore = await cookies();
  const token = cookieStore.get("auth_token")?.value;

  if (!token) {
    throw new Error("No autenticado: Token inexistente.");
  }

  try {
    const decoded = jwt.verify(token, jwtSecret) as { userId: string; email: string };
    return decoded;
  } catch {
    throw new Error("No autenticado: Token inválido o expirado.");
  }
}
