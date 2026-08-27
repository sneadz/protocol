export type Kind = "full" | "cardio" | "rest";

export type Day = {
  name: string;
  short: string;
  kind: Kind;
  /** Blocs du détail : un titre + des lignes. */
  detail: { title: string; lines: string[] }[];
};

export const KIND = {
  full: { label: "Séance complète", emoji: "💪" },
  cardio: { label: "Cardio léger", emoji: "🚴" },
  rest: { label: "Repos", emoji: "😴" },
} as const;

const CARDIO_LEGER: Day["detail"] = [
  {
    title: "Cardio léger",
    lines: ["Vélo — 20 min, niveau 2-3", "Tapis incliné 7% — 5 km/h, 15 min"],
  },
];

const SEANCE_COMPLETE: Day["detail"] = [
  {
    title: "Full body — 3×12-15 reps, 60-90 s de récup",
    lines: [
      "1. Leg Press",
      "2. Vertical Traction",
      "3. Seated Leg Curl",
      "4. Chest Press",
      "5. Leg Extension",
      "6. Shoulder Press",
      "7. Low Row",
      "8. Rotary Torso",
    ],
  },
  {
    title: "Cardio — 40 min, FC cible 130-150 bpm",
    lines: [
      "Vélo échauffement — 5 min, niv. 2-3, 55-60 RPM",
      "Vélo fractionné — 20 min (×6 : 2 min niv. 3 / 1 min niv. 5)",
      "Tapis incliné 7% — 5 km/h, 15 min",
    ],
  },
];

/** Index 0 = lundi. */
export const WEEK: Day[] = [
  { name: "Lundi", short: "Lun", kind: "cardio", detail: CARDIO_LEGER },
  { name: "Mardi", short: "Mar", kind: "rest", detail: [] },
  { name: "Mercredi", short: "Mer", kind: "full", detail: SEANCE_COMPLETE },
  { name: "Jeudi", short: "Jeu", kind: "cardio", detail: CARDIO_LEGER },
  { name: "Vendredi", short: "Ven", kind: "cardio", detail: CARDIO_LEGER },
  { name: "Samedi", short: "Sam", kind: "full", detail: SEANCE_COMPLETE },
  { name: "Dimanche", short: "Dim", kind: "rest", detail: [] },
];

/** Les jours qui comptent pour boucler la semaine. */
export const PLANNED = WEEK.map((d) => d.kind !== "rest");
