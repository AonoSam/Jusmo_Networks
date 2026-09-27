/**
 * Converts a stored phone number into the digits-only, country-code-prefixed
 * format wa.me requires. Handles common Kenyan input formats:
 *   "0710123456"      -> "254710123456"
 *   "+254 710 123 456" -> "254710123456"
 *   "254710123456"     -> "254710123456"
 */
export function formatWhatsAppNumber(raw: string): string {
  const digits = raw.replace(/\D/g, "");

  if (digits.startsWith("254")) {
    return digits;
  }

  if (digits.startsWith("0")) {
    return `254${digits.slice(1)}`;
  }

  return digits;
}

export function buildWhatsAppUrl(raw: string, message?: string): string {
  const number = formatWhatsAppNumber(raw);
  const base = `https://wa.me/${number}`;
  return message ? `${base}?text=${encodeURIComponent(message)}` : base;
}