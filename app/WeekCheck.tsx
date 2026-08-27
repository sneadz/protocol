"use client";
import { useCallback, useEffect } from "react";
import { WEEK, PLANNED } from "@/lib/plan";
import { isWeekComplete, mondayOf, streak } from "@/lib/week";
import { useLocal } from "@/lib/useLocal";

type State = {
  weekStart: string;
  checks: boolean[];
  /** Lundis ISO des semaines bouclées. */
  completed: string[];
};

const EMPTY: State = { weekStart: "", checks: Array(7).fill(false), completed: [] };

export default function WeekCheck({ todayIndex }: { todayIndex: number }) {
  const [state, setState, loaded] = useLocal<State>("fitweek.checks", EMPTY);

  // Bascule de semaine : on archive la semaine écoulée si elle était pleine,
  // puis on remet les cases à zéro.
  // ponytail: vérifié à l'ouverture et au retour au premier plan, pas de timer
  // qui attend minuit. L'app est fermée à 00h00 le lundi de toute façon.
  const rollOver = useCallback(() => {
    setState((s) => {
      const now = mondayOf(new Date());
      if (s.weekStart === now) return s;
      if (!s.weekStart) return { ...s, weekStart: now };
      const done =
        isWeekComplete(s.checks, PLANNED) && !s.completed.includes(s.weekStart)
          ? [...s.completed, s.weekStart]
          : s.completed;
      return { weekStart: now, checks: Array(7).fill(false), completed: done };
    });
  }, [setState]);

  useEffect(() => {
    if (!loaded) return;
    rollOver();
    document.addEventListener("visibilitychange", rollOver);
    return () => document.removeEventListener("visibilitychange", rollOver);
  }, [loaded, rollOver]);

  const toggle = (i: number) =>
    setState((s) => ({ ...s, checks: s.checks.map((c, j) => (j === i ? !c : c)) }));

  const weekDone = isWeekComplete(state.checks, PLANNED);
  const allWeeks = weekDone && state.weekStart ? [...state.completed, state.weekStart] : state.completed;
  const n = streak(allWeeks, new Date());
  const doneCount = state.checks.filter((c, i) => c && PLANNED[i]).length;
  const totalCount = PLANNED.filter(Boolean).length;

  return (
    <section>
      <div className="flex items-baseline justify-between px-1">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
          Check séances
        </h2>
        <span className="text-xs text-neutral-400">
          {doneCount}/{totalCount} cette semaine
        </span>
      </div>

      <div className="mt-3 rounded-2xl border border-neutral-200 p-4">
        <div className="grid grid-cols-7 gap-1.5">
          {WEEK.map((day, i) => {
            const checked = state.checks[i];
            const rest = !PLANNED[i];
            return (
              <button
                key={day.name}
                type="button"
                onClick={() => toggle(i)}
                aria-pressed={checked}
                aria-label={`${day.name} — séance ${checked ? "faite" : "à faire"}`}
                className={`flex flex-col items-center gap-1.5 rounded-xl py-2 transition-colors active:scale-95 ${
                  i === todayIndex ? "bg-neutral-100" : ""
                }`}
              >
                <span
                  className={`text-[11px] font-medium ${
                    rest ? "text-neutral-300" : "text-neutral-500"
                  }`}
                >
                  {day.short}
                </span>
                <span
                  className={`flex h-8 w-8 items-center justify-center rounded-full border-2 transition-colors ${
                    checked
                      ? "border-accent bg-accent text-white"
                      : rest
                        ? "border-dashed border-neutral-200"
                        : "border-neutral-300"
                  }`}
                >
                  {checked && (
                    <svg aria-hidden viewBox="0 0 20 20" className="h-4 w-4">
                      <path
                        d="m5 10.5 3.5 3.5L15 7"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.25"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  )}
                </span>
              </button>
            );
          })}
        </div>

        <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-4">
          <span className="text-sm text-neutral-500">Semaines d&apos;affilée</span>
          <span className="flex items-baseline gap-1">
            <span className="text-2xl font-semibold tabular-nums text-accent">{n}</span>
            <span className="text-sm text-neutral-400">{n > 1 ? "semaines" : "semaine"}</span>
          </span>
        </div>
      </div>
    </section>
  );
}
