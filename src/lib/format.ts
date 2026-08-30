/**
 * Format a number as BDT currency string.
 * Uses "en-IN" locale for the South Asian numbering system (lakhs/crores)
 * which is stable across server/client environments, unlike "en-BD"
 * which may not be recognized consistently.
 */
export function formatBDT(
  value: number,
  options?: { minimumFractionDigits?: number; maximumFractionDigits?: number }
): string {
  const { minimumFractionDigits = 0, maximumFractionDigits = 2 } = options ?? {};
  return value.toLocaleString("en-IN", {
    minimumFractionDigits,
    maximumFractionDigits,
  });
}
