// Visitor-facing copy for the in-chat slot picker, EN/ES. Client-safe.
import { isSpanishPath } from './openers';

export type BookingStrings = {
  locale: string; // for Intl date/time labels
  heading: string;
  tzNote: string;
  typeZoom: string;
  typePhone: string;
  namePlaceholder: string;
  emailPlaceholder: string;
  phonePlaceholder: string;
  confirmCta: string;
  booking: string;
  success: (when: string, email: string) => string;
  joinLink: string;
  slotTaken: string;
  loadFailed: string;
  noTimes: string;
  openEmbed: string;
  errorGeneric: string;
};

const EN: BookingStrings = {
  locale: 'en-US',
  heading: 'Pick a time',
  tzNote: 'All times US Central',
  typeZoom: 'Video call · 30 min',
  typePhone: 'Phone call · 15 min',
  namePlaceholder: 'Your name',
  emailPlaceholder: 'Email',
  phonePlaceholder: 'Phone number',
  confirmCta: 'Book it',
  booking: 'Booking…',
  success: (when, email) => `You're booked for ${when} — the invite is on its way to ${email}.`,
  joinLink: 'Join link',
  slotTaken: 'That time just got grabbed — pick another.',
  loadFailed: "Couldn't load times. Use the booking window instead:",
  noTimes: 'No open times in the next few days — use the booking window instead:',
  openEmbed: 'Open booking window',
  errorGeneric: 'Booking failed — try again, or use the booking window.',
};

const ES: BookingStrings = {
  locale: 'es-US',
  heading: 'Elige una hora',
  tzNote: 'Horarios en hora del centro de EE. UU.',
  typeZoom: 'Videollamada · 30 min',
  typePhone: 'Llamada telefónica · 15 min',
  namePlaceholder: 'Tu nombre',
  emailPlaceholder: 'Correo electrónico',
  phonePlaceholder: 'Número de teléfono',
  confirmCta: 'Reservar',
  booking: 'Reservando…',
  success: (when, email) => `Listo — tu cita quedó para ${when}. La invitación va en camino a ${email}.`,
  joinLink: 'Enlace para unirte',
  slotTaken: 'Esa hora se acaba de ocupar — elige otra.',
  loadFailed: 'No pude cargar los horarios. Usa la ventana de reservas:',
  noTimes: 'No hay horarios disponibles estos días — usa la ventana de reservas:',
  openEmbed: 'Abrir ventana de reservas',
  errorGeneric: 'No se pudo reservar — intenta de nuevo o usa la ventana de reservas.',
};

export function getBookingStrings(pathname: string | null): BookingStrings {
  return isSpanishPath(pathname ?? '/') ? ES : EN;
}
