/**
 * Validation for an optional citizen ID document. CPF has a national
 * check-digit algorithm (mod 11) we can verify; RG has no nationwide
 * standard, so for non-CPF lengths we only sanity-check the digit count.
 *
 * Pure and React-free — a domain rule, unit-testable in isolation.
 */

export type DocumentValidationResult =
  | { ok: true; digits: string }
  | { ok: false; reason: string };

const CPF_LENGTH = 11;
const RG_MIN_DIGITS = 7;
const RG_MAX_DIGITS = 9;

/**
 * Validate a raw (possibly masked) document string. Returns the sanitized
 * digits when valid, or a human-readable reason when not.
 */
export function validateDocument(raw: string): DocumentValidationResult {
  const digits = raw.replace(/\D/g, '');

  if (digits.length === CPF_LENGTH) {
    return isValidCpf(digits)
      ? { ok: true, digits }
      : { ok: false, reason: 'CPF inválido — verifique os dígitos.' };
  }

  if (digits.length >= RG_MIN_DIGITS && digits.length <= RG_MAX_DIGITS) {
    return { ok: true, digits };
  }

  return { ok: false, reason: 'Documento inválido — informe um CPF (11 dígitos) ou RG.' };
}

/** Standard Brazilian CPF mod-11 check-digit validation. */
function isValidCpf(digits: string): boolean {
  // Reject known invalid sequences (all same digit pass the math otherwise).
  if (/^(\d)\1{10}$/.test(digits)) return false;

  const checkDigit = (sliceLength: number): number => {
    let sum = 0;
    for (let i = 0; i < sliceLength; i += 1) {
      sum += Number(digits[i]) * (sliceLength + 1 - i);
    }
    const remainder = (sum * 10) % 11;
    return remainder === 10 ? 0 : remainder;
  };

  return checkDigit(9) === Number(digits[9]) && checkDigit(10) === Number(digits[10]);
}
