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
  preview/              representative frames or contact sheet
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

## Narration and captions

Do not synthesize audio. Copy the approved timed narration into `narration.md`. Produce `captions.vtt` aligned with the storyboard timing. Visual timing must leave room for the planned narration even though the MP4 has no voice track.

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
- captions parse and remain within the planned duration;
- there are no missing assets, blank unintended frames, or obvious render errors; and
- representative frames or a contact sheet exist for review.

Write `manifest.json` with renderer and version, source revision if applicable, render command, dimensions, FPS, frame count, duration, output paths, and verification results.

When the review agent requests an in-scope correction, edit the source, rerender, update the manifest, and preserve a short correction history. Do not accept a request that changes frozen creative decisions; escalate it to the user.
