#!/usr/bin/env node

import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";

const usage = `Usage: node narration-request.mjs <approved-narration.json>

Validate an approved ElevenLabs narration specification and emit its deterministic
cache key, character count, credit estimate, endpoint, and request body. This script
does not make network requests or spend credits.
`;

function fail(message) {
  process.stderr.write(`${message}\n${usage}`);
  process.exit(2);
}

function canonical(value) {
  if (Array.isArray(value)) return value.map(canonical);
  if (value && typeof value === "object") {
    return Object.fromEntries(Object.keys(value).sort().map((key) => [key, canonical(value[key])]));
  }
  return value;
}

const path = process.argv[2];
if (path === "--help") {
  process.stdout.write(usage);
  process.exit(0);
}
if (!path || process.argv.length !== 3) fail("expected one narration specification path");

let spec;
try {
  spec = JSON.parse(readFileSync(path, "utf8"));
} catch (error) {
  fail(`cannot read narration specification: ${error.message}`);
}

for (const field of ["text", "voice_id", "model_id", "model_character_limit", "credit_rate_per_character"]) {
  if (spec[field] === undefined || spec[field] === null || spec[field] === "") fail(`missing ${field}`);
}
if (typeof spec.text !== "string" || spec.text.trim() !== spec.text || spec.text.length === 0) {
  fail("text must be nonempty spoken-only text without leading or trailing whitespace");
}
if (!Number.isInteger(spec.model_character_limit) || spec.model_character_limit <= 0) {
  fail("model_character_limit must be a positive integer");
}
if (typeof spec.credit_rate_per_character !== "number" || spec.credit_rate_per_character < 0) {
  fail("credit_rate_per_character must be a nonnegative number");
}

const characterCount = [...spec.text].length;
if (characterCount > spec.model_character_limit) {
  fail(`text has ${characterCount} characters and exceeds model limit ${spec.model_character_limit}`);
}

const generationInputs = canonical({
  text: spec.text,
  voice_id: spec.voice_id,
  model_id: spec.model_id,
  voice_settings: spec.voice_settings ?? null,
  pronunciation_dictionary_locators: spec.pronunciation_dictionary_locators ?? [],
  output_format: "mp3_44100_128",
});
const canonicalJson = JSON.stringify(generationInputs);
const requestHash = createHash("sha256").update(canonicalJson).digest("hex");
const requestBody = {
  text: spec.text,
  model_id: spec.model_id,
};
if (spec.voice_settings !== undefined) requestBody.voice_settings = spec.voice_settings;
if (spec.pronunciation_dictionary_locators?.length) {
  requestBody.pronunciation_dictionary_locators = spec.pronunciation_dictionary_locators;
}

process.stdout.write(`${JSON.stringify({
  request_hash: requestHash,
  character_count: characterCount,
  credit_rate_per_character: spec.credit_rate_per_character,
  estimated_credits: characterCount * spec.credit_rate_per_character,
  endpoint: `/v1/text-to-speech/${encodeURIComponent(spec.voice_id)}/with-timestamps?output_format=mp3_44100_128`,
  request_body: requestBody,
}, null, 2)}\n`);
