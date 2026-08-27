"use client";
import { useState } from "react";
import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fromISO, toISO } from "@/lib/week";
import { useLocal } from "@/lib/useLocal";

type Entry = { d: string; kg: number };
type State = { goal: number; entries: Entry[] };

const EMPTY: State = { goal: 100, entries: [] };
const ACCENT = "#4f7ef7";

const fmtDay = (iso: string) => {
  const d = fromISO(iso);
  return `${String(d.getDate()).padStart(2, "0")}/${String(d.getMonth() + 1).padStart(2, "0")}`;
};

export default function WeightTracker() {
  const [state, setState, loaded] = useLocal<State>("fitweek.weight", EMPTY);
  const [draft, setDraft] = useState("");
  const [editGoal, setEditGoal] = useState(false);

  const today = toISO(new Date());
  const isSaturday = new Date().getDay() === 6;
  const loggedToday = state.entries.some((e) => e.d === today);

  const save = () => {
    const kg = Number(draft.replace(",", "."));
    // garde-fou : une faute de frappe ne doit pas ruiner la courbe
    if (!Number.isFinite(kg) || kg < 20 || kg > 400) return;
    const rounded = Math.round(kg * 10) / 10;
    setState((s) => ({
      ...s,
      entries: [...s.entries.filter((e) => e.d !== today), { d: today, kg: rounded }].sort((a, b) =>
        a.d < b.d ? -1 : 1,
      ),
    }));
    setDraft("");
  };

  const last = state.entries.at(-1);
  const delta = last ? Math.round((last.kg - state.goal) * 10) / 10 : null;

  const values = [...state.entries.map((e) => e.kg), state.goal];
  const domain: [number, number] = [
    Math.floor(Math.min(...values) - 1),
    Math.ceil(Math.max(...values) + 1),
  ];

  return (
    <section>
      <div className="flex items-baseline justify-between px-1">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-neutral-400">
          Suivi poids
        </h2>
        <button
          type="button"
          onClick={() => setEditGoal((v) => !v)}
          className="text-xs text-neutral-400 underline-offset-2 hover:underline"
        >
          Objectif {state.goal} kg
        </button>
      </div>

      {editGoal && (
        <div className="mt-3 flex items-center gap-2 rounded-2xl border border-neutral-200 p-3">
          <label htmlFor="goal" className="text-sm text-neutral-500">
            Objectif
          </label>
          <input
            id="goal"
            type="number"
            inputMode="decimal"
            step="0.5"
            value={state.goal}
            onChange={(e) => {
              const g = Number(e.target.value);
              if (Number.isFinite(g) && g >= 20 && g <= 400) setState((s) => ({ ...s, goal: g }));
            }}
            className="w-24 rounded-lg border border-neutral-200 px-2 py-1.5 text-right tabular-nums focus:border-accent focus:outline-none"
          />
          <span className="text-sm text-neutral-400">kg</span>
        </div>
      )}

      {loaded && isSaturday && !loggedToday && (
        <p className="mt-3 rounded-2xl bg-accent/10 px-4 py-3 text-sm font-medium text-accent">
          💊 Jour de pesée
        </p>
      )}

      <div className="mt-3 rounded-2xl border border-neutral-200 p-4">
        <div className="flex items-end gap-2">
          <div className="flex-1">
            <label htmlFor="kg" className="text-xs text-neutral-400">
              {loggedToday ? "Corriger le poids du jour" : "Poids du jour"}
            </label>
            <input
              id="kg"
              type="number"
              inputMode="decimal"
              step="0.1"
              placeholder={last ? String(last.kg) : "—"}
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && save()}
              className="mt-1 w-full rounded-xl border border-neutral-200 px-3 py-2.5 text-lg tabular-nums focus:border-accent focus:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={save}
            disabled={draft === ""}
            className="rounded-xl bg-accent px-5 py-2.5 font-medium text-white transition-opacity active:opacity-80 disabled:opacity-30"
          >
            OK
          </button>
        </div>

        {last && (
          <p className="mt-3 text-sm text-neutral-500">
            Dernière pesée{" "}
            <span className="font-medium tabular-nums text-neutral-900">{last.kg} kg</span>{" "}
            <span className="text-neutral-400">
              ({fmtDay(last.d)}
              {delta !== null && delta !== 0 && `, ${delta > 0 ? "+" : ""}${delta} kg de l'objectif`}
              )
            </span>
          </p>
        )}

        <div className="mt-4 h-48">
          {loaded && state.entries.length > 0 ? (
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={state.entries} margin={{ top: 8, right: 8, bottom: 0, left: -20 }}>
                <CartesianGrid stroke="#f1f1f1" vertical={false} />
                <XAxis
                  dataKey="d"
                  tickFormatter={fmtDay}
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 11, fill: "#a3a3a3" }}
                  minTickGap={16}
                />
                <YAxis
                  domain={domain}
                  tickLine={false}
                  axisLine={false}
                  width={44}
                  tick={{ fontSize: 11, fill: "#a3a3a3" }}
                />
                <Tooltip
                  labelFormatter={fmtDay}
                  formatter={(v: number) => [`${v} kg`, "Poids"]}
                  contentStyle={{
                    borderRadius: 12,
                    border: "1px solid #e5e5e5",
                    fontSize: 13,
                  }}
                />
                <ReferenceLine y={state.goal} stroke="#d4d4d4" strokeDasharray="4 4" />
                <Line
                  type="monotone"
                  dataKey="kg"
                  stroke={ACCENT}
                  strokeWidth={2}
                  dot={{ r: 3, fill: ACCENT, strokeWidth: 0 }}
                  activeDot={{ r: 5 }}
                  isAnimationActive={false}
                />
              </LineChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-neutral-300">
              Première pesée samedi matin
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
