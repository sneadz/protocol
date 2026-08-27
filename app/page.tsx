"use client";
import { useEffect, useState } from "react";
import WeekPlan from "./WeekPlan";
import WeekCheck from "./WeekCheck";
import WeightTracker from "./WeightTracker";

export default function Page() {
  // -1 au premier render : le fuseau du build n'est pas celui du téléphone,
  // on ne calcule le jour qu'une fois côté client.
  const [todayIndex, setTodayIndex] = useState(-1);
  useEffect(() => setTodayIndex((new Date().getDay() + 6) % 7), []);

  return (
    <main className="mx-auto max-w-md space-y-8 px-4 pb-16 pt-8">
      <header className="px-1">
        <h1 className="text-2xl font-semibold tracking-tight">Protocol</h1>
      </header>

      <WeekPlan todayIndex={todayIndex} />
      <WeekCheck todayIndex={todayIndex} />
      <WeightTracker />
    </main>
  );
}
