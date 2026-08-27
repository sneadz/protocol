import { test } from "node:test";
import assert from "node:assert/strict";
import { parseKg } from "./kg.ts";

test("parseKg accepte les saisies plausibles", () => {
  assert.equal(parseKg("108"), 108);
  assert.equal(parseKg("107,4"), 107.4);
  assert.equal(parseKg("107.46"), 107.5);
});

test("parseKg rejette le reste", () => {
  assert.equal(parseKg(""), null);
  assert.equal(parseKg("abc"), null);
  assert.equal(parseKg("1"), null); // saisie en cours de "108"
  assert.equal(parseKg("999"), null);
});
