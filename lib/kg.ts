/**
 * Parse une saisie de poids en kg. Renvoie null si c'est inexploitable :
 * une faute de frappe ne doit pas ruiner la courbe.
 * Accepte la virgule, arrondit au 100 g.
 */
export function parseKg(input: string): number | null {
  const n = Number(input.replace(",", "."));
  if (!Number.isFinite(n) || n < 20 || n > 400) return null;
  return Math.round(n * 10) / 10;
}
