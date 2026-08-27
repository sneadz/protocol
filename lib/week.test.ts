import { test } from "node:test";
import assert from "node:assert/strict";
import { mondayOf, prevMonday, isWeekComplete, streak, toISO, fromISO } from "./week.ts";

test("mondayOf colle au lundi, dimanche inclus", () => {
  assert.equal(mondayOf(new Date(2026, 7, 27)), "2026-08-24"); // jeudi
  assert.equal(mondayOf(new Date(2026, 7, 24)), "2026-08-24"); // lundi
  assert.equal(mondayOf(new Date(2026, 7, 30)), "2026-08-24"); // dimanche
});

test("prevMonday traverse le changement d'heure", () => {
  assert.equal(prevMonday("2026-11-02"), "2026-10-26"); // passage heure d'hiver
  assert.equal(prevMonday("2026-03-30"), "2026-03-23"); // passage heure d'été
});

test("toISO/fromISO font l'aller-retour sans décalage", () => {
  assert.equal(toISO(fromISO("2026-01-01")), "2026-01-01");
});

test("isWeekComplete ignore les jours de repos", () => {
  const planned = [true, false, true, true, true, true, false];
  assert.equal(isWeekComplete([1, 0, 1, 1, 1, 1, 0].map(Boolean), planned), true);
  assert.equal(isWeekComplete([1, 1, 1, 1, 1, 0, 1].map(Boolean), planned), false);
});

test("streak compte les semaines consécutives", () => {
  const today = new Date(2026, 7, 27); // jeudi, semaine du 24
  assert.equal(streak([], today), 0);
  // semaine en cours pas finie -> on repart de la précédente
  assert.equal(streak(["2026-08-17", "2026-08-10"], today), 2);
  // semaine en cours finie -> elle compte
  assert.equal(streak(["2026-08-24", "2026-08-17"], today), 2);
  // trou -> le streak s'arrête
  assert.equal(streak(["2026-08-17", "2026-08-03"], today), 1);
});
