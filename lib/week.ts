// Semaine = lundi -> dimanche. Tout est en heure locale (pas d'UTC : la
// remise à zéro doit tomber au minuit du téléphone, pas à celui de Greenwich).

/** "YYYY-MM-DD" local, sans passer par toISOString() qui décale en UTC. */
export function toISO(d: Date): string {
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}`;
}

/** Parse "YYYY-MM-DD" en Date locale à minuit. */
export function fromISO(iso: string): Date {
  const [y, m, d] = iso.split("-").map(Number);
  return new Date(y, m - 1, d);
}

/** Lundi de la semaine contenant `d`, en ISO. */
export function mondayOf(d: Date): string {
  const x = new Date(d.getFullYear(), d.getMonth(), d.getDate());
  x.setDate(x.getDate() - ((x.getDay() + 6) % 7)); // getDay(): 0=dim -> 6
  return toISO(x);
}

/** Lundi précédent. setDate() reste correct au passage heure d'été/hiver. */
export function prevMonday(iso: string): string {
  const d = fromISO(iso);
  d.setDate(d.getDate() - 7);
  return toISO(d);
}

/** Semaine bouclée = tous les jours prévus (hors repos) sont cochés. */
export function isWeekComplete(checks: boolean[], planned: boolean[]): boolean {
  return planned.every((p, i) => !p || checks[i]);
}

/**
 * Nombre de semaines pleines consécutives. La semaine en cours ne casse pas
 * le streak tant qu'elle n'est pas finie : on repart du lundi précédent.
 */
export function streak(completedWeeks: string[], today: Date): number {
  const done = new Set(completedWeeks);
  let cur = mondayOf(today);
  if (!done.has(cur)) cur = prevMonday(cur);
  let n = 0;
  while (done.has(cur)) {
    n++;
    cur = prevMonday(cur);
  }
  return n;
}
