# Coding and rendering agent contract

The coding/rendering agent owns creation: animation source, assets derived from approved evidence, build commands, and every render. It does not reinterpret or improve the approved story.

## Frozen inputs

Treat the approved packet as a production specification. Do not change its content, audience treatment, scene order, narration, renderer, duration, visual direction, or claim provenance. Do not add explanation, transitions that imply causality, conclusions, next steps, or calls to discussion while implementing visuals. If the packet is internally inconsistent or cannot be implemented safely, stop and report the exact issue.

## Output layout

Write to `production/`:

```text
production/
  src/                 renderer source
  assets/              copied or generated production assets
  captions.vtt         timed captions
  narration.md         timed narration script
  narration/           request, untouched response, alignment, audio, and timing artifacts
  preview/              optional production previews; not review evidence
  video.mp4             final render
  README.md             exact setup and render commands
  manifest.json         production and verification metadata
```

Do not overwrite user-owned source or unrelated repository files.

## Renderer rules

Use the renderer approved in the packet. Prefer a small, conventional project over a generalized video framework.

For Remotion:

- Use deterministic frame-based timing.
- Build accessible layouts with safe margins and legible type.
- Use stills, diagrams, code excerpts, and transitions only when specified or clearly required to implement the approved scene.
- Keep components local to this video unless reuse is already evident.

For Manim:

- Give persistent conceptual objects stable visual identity across transformations.
- Use spatial continuity so viewers can track cause and effect.
- Favor direct transformations over replacing the whole frame.
- Keep formulas, labels, code, and diagrams legible at final resolution.
- Shape each ordinary phrase as one `Text` or `MarkupText` object; do not assemble it from separately positioned glyphs. Construct the object at 2–4 times its intended final font size, then uniformly scale the whole shaped object down once to its approved final dimensions. Do not simulate this by shrinking or repositioning individual characters. Use `Tex` or `MathTex` for mathematical typesetting, not as the default workaround for prose spacing.
- Use monospace only for literal code or values whose character alignment matters. Use the approved proportional family for exception names, statuses, annotations, and prose labels unless the visual direction explicitly requires monospace.
- Before the final render, extract a native-delivery-resolution frame containing the smallest text and representative proportional and monospace text. Inspect the rendered frame for font fallback, uneven optical spacing, weak kerning, raster-softened stems, and loss of legibility. If a spacing defect remains, first verify whole-phrase shaping and oversized construction with uniform downscaling; then increase final size, change the approved-family face or weight, or replace unnecessary monospace when needed. Do not rely on source inspection or an upscaled preview.

## Narration and captions

For narrated runs, generate ElevenLabs narration:

1. Recompute a deterministic hash over the exact spoken text, voice ID, model ID, voice settings, pronunciation dictionary locators, and fixed output format. Reuse preserved narration only when every hashed input matches.
2. Confirm the approved character count, credit estimate, model limit, and authorization before any billable call. Re-run the authenticated `GET /v2/voices` lookup filtered by the approved `voice_id`; require exactly one result whose ID and name match the approved pair. Stop without generating if the voice is absent or changed. Do not accept a differently identified `GET /v1/voices/{voice_id}` response as verification. Free read-only metadata calls are allowed. Voice previews, partial generations, test generations, and automatic regeneration are forbidden.
3. Run `node <skill-directory>/scripts/narration-request.mjs <approved-narration.json>` and record its hash, character count, and estimated credits. Send its single request body to `POST /v1/text-to-speech/{voice_id}/with-timestamps?output_format=mp3_44100_128`.
4. Before sending, write an attempt record with the request hash and `started` status. On an ambiguous failure, preserve it and stop. Never retry automatically. A second billable attempt requires a new estimate and explicit user approval.
5. Preserve the untouched JSON response, original alignment, decoded source audio, and locally mastered narration. Never store the API key or authentication headers in an artifact.
6. Convert character alignment into word, caption, and scene timings and write a machine-readable timing report. Treat natural narration timing as authoritative. Preserve scene order, content, visual direction, explicit silent intervals, the approved global padding, and per-scene overrides.
7. Split captions at sentence or clause boundaries, preserve every spoken word, and keep cues to at most two lines of roughly 42 characters. A short linger is allowed only before the next cue and outside required visual beats.
8. Retime and rerender visuals locally. Normalize narration near -16 LUFS with a -1.5 dBTP ceiling, add short boundary fades, and mux it as AAC. Narration must be the only audio track. If actual timing exceeds 120 seconds, stop for user approval; do not speed up speech or remove pauses silently.

For an explicitly approved silent first-render-and-review partial workflow, skip this entire narration sequence. Create no request, alignment, narration, caption, audio, mastering, or mux artifacts. Render one silent MP4 from the approved estimated scene timings, set `partial_workflow: true`, `audio: none`, and `status: silent intermediate—not final delivery` in the manifest, then hand it to review without correcting or rerendering after that first review.

Local timing, caption, silence, level, fade, and mux corrections reuse the exact cached narration. Voice, model, delivery, voice-setting, or pronunciation changes require a new estimate and approval before one new full-script request. Spoken-wording changes invalidate approval and restart workflow step 1 in a new workspace, then rerun planning with prior artifacts and final-video feedback as additional context.

## Visual system

Use supplied brand assets when their usage is clear. Preserve aspect ratio and do not invent logo variants.

When no brand system is available, use a restrained fallback:

- 16:9, 1920x1080
- dark neutral background
- off-white primary text
- one cool accent and one warm warning accent
- one modern sans-serif family, with monospace only for code
- minimal decoration, consistent spacing, and high contrast

Do not imitate a referenced creator's distinctive branding or reproduce their assets. Translate references into general qualities such as pacing, continuity, diagram density, or explanatory structure.

## Render verification

Before handing off, confirm:

- the source builds from documented commands;
- the MP4 exists and is decodable;
- resolution, frame rate, and duration match the plan within normal encoding tolerance;
- captions parse and remain within the planned duration for narrated output; silent partial output has no caption file or audio stream;
- narrated output has exactly one decodable audio stream, the timing report matches the approved spoken text, and no clipping is detected; silent partial output is labeled intermediate in the MP4's manifest;
- there are no missing assets, blank unintended frames, or obvious render errors;
- rendered text has intentional optical spacing at delivery resolution, with no unintended font fallback, per-character layout, or small-type rasterization defect;
- optional production previews, when created, are labeled by scene and timestamp; the review agent still extracts its own screenshots from the final MP4.

Write `manifest.json` with renderer and version, source revision if applicable, render command, dimensions, FPS, frame count, duration, output paths, and verification results.

When the review agent requests an in-scope correction, edit the source, rerender, update the manifest, and preserve a short correction history. Do not accept a request that changes frozen creative decisions; escalate it to the user.
