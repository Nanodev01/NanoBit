export { cn } from "cn"

/**
 * Parsea de forma segura un string JSON a un array.
 * Si el string está corrupto o vacío, devuelve un array vacío en vez de crashear.
 */
export function safeParseTags(tagsString: string): string[] {
  try {
    const parsed = JSON.parse(tagsString);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
