import { parse, parseISO, isValid } from 'date-fns';
import { formatInBogota } from './timezone';

/**
 * Intenta parsear una fecha en múltiples formatos comunes.
 * Acepta string o Date, y devuelve Date válido o null si no es parseable.
 */
export function parseFlexibleDate(
  raw: string | Date | null | undefined,
): Date | null {
  if (!raw) return null;
  if (raw instanceof Date) return isValid(raw) ? raw : null;

  // ISO simple yyyy-MM-dd
  if (/^\d{4}-\d{2}-\d{2}$/.test(raw)) {
    const d = parse(raw + 'T12:00:00', "yyyy-MM-dd'T'HH:mm:ss", new Date());
    return isValid(d) ? d : null;
  }

  // ISO completo / parcial
  const iso = parseISO(raw);
  if (isValid(iso)) return iso;

  // Último intento con Date nativo
  const d = new Date(raw);
  return isValid(d) ? d : null;
}

/**
 * Formatea en zona Bogotá si es posible, de lo contrario devuelve null.
 */
export function formatBogotaTolerant(
  raw: string | Date | null | undefined,
  fmt: string,
): string | null {
  const d = parseFlexibleDate(raw);
  if (!d) return null;
  return formatInBogota(d, fmt);
}
