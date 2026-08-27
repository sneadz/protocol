"use client";
import { useState } from "react";
import { WEEK, KIND } from "@/lib/plan";

export default function WeekPlan({ todayIndex }: { todayIndex: number }) {
  const [open, setOpen] = useState<number | null>(null);

  return (
    <section>
      <h2 className="px-1 text-xs font-semibold uppercase tracking-widest text-neutral-400">
        Planning semaine
      </h2>

      <div className="mt-3 space-y-2">
        {WEEK.map((day, i) => {
          const kind = KIND[day.kind];
          const isOpen = open === i;
          const isToday = i === todayIndex;

          return (
            <div
              key={day.name}
              className={`overflow-hidden rounded-2xl border transition-colors ${
                isOpen ? "border-accent/40 bg-accent/[0.03]" : "border-neutral-200 bg-white"
              }`}
            >
              <button
                type="button"
                onClick={() => setOpen(isOpen ? null : i)}
                aria-expanded={isOpen}
                aria-controls={`detail-${i}`}
                className="flex w-full items-center gap-3 px-4 py-3.5 text-left active:bg-neutral-50"
              >
                <span aria-hidden className="text-xl">
                  {kind.emoji}
                </span>

                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-2">
                    <span className="font-medium">{day.name}</span>
                    {isToday && (
                      <span className="rounded-full bg-accent px-1.5 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                        Auj.
                      </span>
                    )}
                  </span>
                  <span className="mt-0.5 block text-sm text-neutral-500">{kind.label}</span>
                </span>

                {day.detail.length > 0 && (
                  <svg
                    aria-hidden
                    viewBox="0 0 20 20"
                    className={`h-4 w-4 shrink-0 text-neutral-400 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  >
                    <path
                      d="M5 7.5 10 12.5 15 7.5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </button>

              {/* grid-rows 0fr -> 1fr : anime une hauteur inconnue sans JS */}
              <div
                id={`detail-${i}`}
                className={`grid transition-[grid-template-rows] duration-200 ${
                  isOpen ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                }`}
              >
                <div className="overflow-hidden">
                  <div className="space-y-4 px-4 pb-4">
                    {day.detail.length === 0 ? (
                      <p className="text-sm text-neutral-400">
                        Rien de prévu. Récupération complète.
                      </p>
                    ) : (
                      day.detail.map((block) => (
                        <div key={block.title}>
                          <h3 className="text-xs font-semibold uppercase tracking-wide text-neutral-400">
                            {block.title}
                          </h3>
                          <ul className="mt-2 space-y-1.5">
                            {block.lines.map((line) => (
                              <li
                                key={line}
                                className="border-l-2 border-neutral-200 pl-3 text-sm leading-snug text-neutral-700"
                              >
                                {line}
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
