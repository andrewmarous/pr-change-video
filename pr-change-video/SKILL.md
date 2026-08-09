---
name: pr-change-video
description: Turn a GitHub pull request and its surrounding project context into a short stakeholder-ready changelog video using Remotion or Manim. Use this skill whenever a user asks to explain, present, summarize, animate, or make a video about a PR, code change, implementation, release, engineering update, or technical changelog—even if they do not name Remotion or Manim. It coordinates separate planning, coding/rendering, and review agents; recommends an audience and renderer; and requires user approval before production.
compatibility: Requires GitHub access through gh or equivalent tools, subagent support, and the selected renderer (Remotion/Node.js or Manim/Python). ffmpeg and ffprobe are recommended for render inspection.
---

# PR Change Video

Create a concise, closed communication artifact from supplied evidence. Preserve the source meaning as immutable. The video can compress, select, order, quote, and visualize source material, but it cannot extend, reinterpret, improve, or complete the source's argument.

Use exactly three roles with hard ownership boundaries:

1. The planning agent researches the PR and context, recommends the audience treatment and renderer, and creates the approval packet.
2. The coding/rendering agent turns the approved packet into source files and a rendered MP4.
3. The review agent verifies the render against the approved packet. It does not edit source or redefine the plan.

The user supplies higher-level creative feedback. Keep the coding/rendering and review loop limited to small corrections needed to make the render match the approved plan.

## Read the required references

Read these files before spawning an agent:

- `references/planning.md` for evidence handling, audience presets, renderer selection, and the approval packet.
- `references/production.md` for the coding/rendering contract and output files.
- `references/review.md` for verification and the bounded correction loop.

## Inputs

Require a GitHub PR URL. Accept optional context such as working documentation, design notes, implementer notes, issue links, standup transcripts, screenshots, diagrams, and brand assets.

Ask only for information that cannot be discovered from the PR, repository, or supplied context. Prefer recommendations with editable assumptions over a long intake questionnaire.

Support these user controls:

- Audience preset: `TPM`, `executive`, or `IC`
- Fine-tuning: viewer knowledge, technical depth, terminology, emphasis, exclusions, and tone
- Duration: 90 seconds by default; require explicit approval to exceed 120 seconds
- Brand treatment: use supplied repository or company assets; otherwise use the restrained fallback system in `references/production.md`

Do not synthesize narration audio. Produce a timed narration script and captions.

## Evidence boundaries

Treat the current PR diff as the source of truth for implementation facts: what changed and what behavior the code implements. Treat user-provided context as the only source for motivation, rationale, tradeoffs, intended impact, risks, emphasis, conclusions, next steps, and argumentative framing.

Do not derive argumentative points from the code. A plausible interpretation of a diff can still conflict with how the creator understands or presents the work. If the supplied context does not establish why a change was made, how it should be evaluated, or what happens next, omit that point. Ask the user only when the missing information prevents a coherent artifact; do not invite expansion by default.

Apply these rules when sources disagree:

1. Current PR diff and repository code determine implemented behavior.
2. User-provided context determines motivation, rationale, tradeoffs, intended impact, risk framing, conclusions, next steps, and communication style.
3. PR descriptions, commits, reviews, inline comments, and general discussion count as user-provided context when the user includes them in the context set.

Surface material contradictions in the approval packet. Never silently turn implementation details into creator intent. Distinguish implementation facts from attributed context claims. Do not include inference, analysis, recommendations, or proposed next steps in the video plan.

## Workflow

### 1. Create the workspace

Create a dedicated output directory without overwriting unrelated files:

```text
pr-change-video-output/
  evidence/
  plan/
  production/
  review/
```

If that directory exists, choose a PR-specific or timestamped sibling.

### 2. Spawn the planning agent

Give the planning agent:

- the PR URL;
- paths or links to all supplied context;
- all user audience and content controls;
- `references/planning.md`; and
- the workspace path.

Tell it to save the evidence ledger and approval packet in the workspace. The planning agent must inspect the PR description, commits, changed files, full diff, reviews, inline review comments, and general discussion. It must inspect relevant repository files when the diff alone is insufficient.

### 3. Stop for user approval

Present the complete approval packet. Explicitly call out:

- recommended audience preset and all fine-tuned assumptions;
- material exclusions, gaps, and unresolved contradictions once;
- one timed scene table containing the narrative, storyboard, narration, on-screen content, and provenance;
- Remotion or Manim recommendation with evidence and rejected-alternative rationale;
- duration; and
- brand treatment.

Keep the approval packet compact. The evidence ledger is a background audit artifact; do not copy it into the approval packet. State each source claim, boundary, and production decision once. Do not repeat scene claims in a summary, separate narration section, exclusions list, or checklist.

Do not spawn the coding/rendering agent or create animation source until the user approves this packet. Apply requested planning changes through the planning agent and present the revised packet again.

Approval freezes the source-derived content, audience treatment, storyboard, narration, renderer, duration, and visual direction. Record the approved packet separately from drafts.

### 4. Spawn the coding/rendering agent

After approval, give the coding/rendering agent only the evidence it needs, the frozen approval packet, brand assets, `references/production.md`, and the workspace path. It owns all animation source changes and rendering commands.

Require it to render an MP4 and save a production manifest. A source-only result is incomplete unless a missing dependency or environment restriction makes rendering impossible; report that blocker precisely.

### 5. Spawn the review agent

Give the review agent read-only responsibility for the frozen approval packet, production manifest, source, and render. It follows `references/review.md` and writes a review report.

If the render passes, finish. If it has a small implementation mismatch, the review agent sends a precise correction request to the existing coding/rendering agent. That agent changes the source and rerenders; the review agent then verifies the new render.

If a proposed correction changes the source-derived content, audience treatment, storyboard, narration, renderer, duration, or visual direction, stop the loop and ask the user. The review agent cannot approve its own creative changes.

### 6. Deliver

Return links or paths to:

- the rendered MP4;
- animation source and build instructions;
- the approved packet;
- timed narration script and captions;
- production manifest; and
- final review report.

State which claims are implementation facts from the PR and which narrative claims are directly supported by user-provided context. List unresolved gaps and caveats. Do not claim the video passed review unless the review report records a pass for the final render.

## Quality principles

- Prefer one source-supported explanatory thread over a compressed list of changed files.
- Show mechanisms changing over time when that motion improves understanding.
- Keep on-screen text short enough to read at the planned pace.
- Use code only when a specific fragment is necessary to explain behavior.
- Preserve legal, security, performance, and compatibility qualifiers from the evidence.
- Do not present PR discussion speculation as implemented behavior.
- Do not infer motivation, rationale, tradeoffs, impact, risks, or argumentative framing from code.
- Do not add implications, conclusions, recommendations, next steps, discussion prompts, or calls to action unless a supplied source explicitly contains them.
- Keep each v1 video in one renderer. Do not create a hybrid Remotion/Manim pipeline unless the user explicitly requests it.
