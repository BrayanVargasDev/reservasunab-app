import { formatInTimeZone, toZonedTime, fromZonedTime } from 'date-fns-tz';
import { parseISO } from 'date-fns';

// Zona horaria por defecto de la app
export const APP_TZ = 'America/Bogota';

// Formatea cualquier Date o ISO string en la zona horaria de Bogotá
export function formatInBogota(
  date: Date | string | number,
  pattern = 'dd/MM/yyyy HH:mm a',
) {
  const d =
    typeof date === 'string' || typeof date === 'number'
      ? new Date(date)
      : date;
  return formatInTimeZone(d, APP_TZ, pattern);
}

// Convierte una fecha (Date u ISO) a Date ajustada a la zona de Bogotá (misma pared de reloj)
export function toBogotaDate(date: Date | string | number): Date {
  const d = typeof date === 'string' ? parseISO(date) : new Date(date);
  return toZonedTime(d, APP_TZ);
}

// Convierte un Date en hora local Bogotá a UTC ISO para enviar al backend
export function bogotaLocalToUtcISO(date: Date | string | number): string {
  const d = typeof date === 'string' ? parseISO(date) : new Date(date);
  const utc = fromZonedTime(d, APP_TZ);
  return utc.toISOString();
}

// Atajos de formato comunes
export const fmt = {
  corto: (d: Date | string | number) => formatInBogota(d, 'dd/MM/yyyy'),
  largo: (d: Date | string | number) =>
    formatInBogota(d, 'MMMM dd yyyy, h:mm a'),
  hora: (d: Date | string | number) => formatInBogota(d, 'HH:mm'),
};
