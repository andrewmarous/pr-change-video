---
name: pr-change-video
description: Turn a GitHub pull request and its surrounding project context into a short narrated stakeholder-ready changelog video using Remotion or Manim and approval-gated ElevenLabs speech. Use whenever a user asks to explain, present, summarize, animate, narrate, or make a video about a PR, code change, implementation, release, engineering update, or technical changelog. Coordinate separate planning, coding/rendering, and review agents; recommend an audience and renderer; and require user approval before production or paid speech generation.
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

Generate ElevenLabs narration for complete workflows. Use one full-script timestamp-enabled speech request per approved generation attempt and synchronize scenes and captions locally from the returned alignment.

Honor a partial-workflow boundary only when the user explicitly requests one of these two endpoints:

- **Plan submission:** deliver the approval packet and stop before production.
- **First render and review:** after approval, produce exactly one render, perform exactly one independent review pass, deliver those intermediate artifacts, and stop without corrections or final audiovisual approval. If the user explicitly requests this endpoint as a silent visual or typography test, omit ElevenLabs discovery, authorization, generation, narration artifacts, captions, audio, and muxing; use the approved estimated scene timings and mark the MP4 and manifest `silent intermediate—not final delivery`.

Do not infer a partial boundary from phrases such as “quick,” “preview,” or “draft.” A partial run still requires planning approval before source creation, preserves all evidence and role boundaries, and may stop only at one of the two endpoints above.

## Evidence boundaries

Treat the current PR diff as the source of truth for implementation facts: what changed and what behavior the code implements. Treat user-provided context as the only source for motivation, rationale, tradeoffs, intended impact, risks, emphasis, conclusions, next steps, and argumentative framing. Supplying a PR URL admits that PR's description, commits, reviews, inline comments, and discussion into the context set.

Do not derive argumentative points from the code. A plausible interpretation of a diff can still conflict with how the creator understands or presents the work. If the supplied context does not establish why a change was made, how it should be evaluated, or what happens next, omit that point. Ask the user only when the missing information prevents a coherent artifact; do not invite expansion by default.

Apply these rules when sources disagree:

1. Current PR diff and repository code determine implemented behavior.
2. User-provided context determines motivation, rationale, tradeoffs, intended impact, risk framing, conclusions, next steps, and communication style.
3. PR descriptions, commits, reviews, inline comments, and general discussion count as user-provided context when the user includes them in the context set.

Surface material contradictions in the approval packet. Never silently turn implementation details into creator intent. Distinguish implementation facts from attributed context claims. Do not include inference, analysis, recommendations, or proposed next steps in the video plan.

## Workflow

### 0. Check requirements

Resolve this skill's installed directory and run `node <skill-directory>/scripts/check-requirements.mjs --json`. For an explicitly requested silent first-render-and-review run, add `--silent-preview`; otherwise require a nonempty `ELEVENLABS_API_KEY`. The checker reports only whether the key is set and never its value. Treat a nonzero exit as a blocker and report the failed checks without attempting to install or modify dependencies. Warnings are non-blocking.

If the only failed required check is GitHub authentication, do not immediately
tell the user that they are unauthenticated. The sandbox may prevent `gh` from
reading credentials that are available on the host. Request permission to rerun
the same requirements-checker command outside the sandbox. Continue when that
host-level check succeeds; report an authentication blocker only when the
outside-sandbox check also fails. Do not expose tokens or credential contents in
either attempt.

After the user approves a renderer, run the checker again with `--renderer remotion` or `--renderer manim` before production. Do not check both renderer toolchains or require an unselected renderer.

### 1. Create the hidden PR workspace

Keep all artifacts out of the user's visible project tree. Extract the PR number from the required GitHub PR URL and create a PR-specific directory under `.pr-change-video/` in the repository or current working directory. Put each run's working artifacts in a unique nested run directory, but put the delivered video at the top level of the PR-specific directory:

```text
.pr-change-video/pr-44/
  video.mp4
  runs/<timestamp>/
    evidence/
    plan/
    production/
    review/
```

For PR 44, the delivery path is therefore `.pr-change-video/pr-44/video.mp4`, not a visible output directory and not a file inside `production/` or `runs/`. Never create a visible workspace or output directory. Do not overwrite an earlier run's working artifacts. A corrected rerender for the same approved workflow may replace the top-level `video.mp4`; otherwise preserve an existing delivery by choosing a clear suffixed MP4 filename alongside it. Record the exact absolute delivery path.

### 2. Spawn the planning agent

Give the planning agent:

- the PR URL;
- paths or links to all supplied context;
- all user audience and content controls;
- `references/planning.md`; and
- the workspace path.

Tell it to save the evidence ledger and approval packet in the workspace. The planning agent must inspect the PR description, commits, changed files, full diff, reviews, inline review comments, and general discussion. It must inspect relevant repository files when the diff alone is insufficient.

Require `plan/approved-narration.json`; it contains the exact spoken-only generation inputs and no API key. For an explicitly requested silent first-render-and-review run, omit that file and voice metadata; instead record `Narration: none—silent intermediate` and estimated scene timings in the packet.

### 3. Stop for user approval

Present the complete approval packet. Explicitly call out:

- recommended audience preset and all fine-tuned assumptions;
- material exclusions, gaps, and unresolved contradictions once;
- one timed scene table containing the narrative, storyboard, narration, on-screen content, and provenance;
- Remotion or Manim recommendation with evidence and rejected-alternative rationale;
- duration; and
- brand treatment.

For narrated runs, call out the exact spoken text, voice and model choices, pronunciation controls, character count, documented credit rate, estimated credits, and model request limit. For an explicitly requested silent run, state that no speech request, captions, or audio will be produced. Keep audio and video encoding details out of the packet unless the user asks. Approval authorizes one generation attempt at the stated estimate; if the rate is unknown, do not guess or proceed.

For the voice choice, require an exact ID and name returned by the configured
account's fully paginated authenticated `GET /v2/voices` inventory and confirmed
by a filtered v2 lookup. Documentation examples, remembered default IDs, and
legacy aliases are not evidence that a voice is available to the account. Reject
any v1 lookup that returns a different ID from the requested one.

Keep the approval packet compact. The evidence ledger is a background audit artifact; do not copy it into the approval packet. State each source claim, boundary, and production decision once. Do not repeat scene claims in a summary, separate narration section, exclusions list, or checklist.

Do not spawn the coding/rendering agent or create animation source until the user approves this packet. Apply requested planning changes through the planning agent and present the revised packet again.

Approval freezes the source-derived content, audience treatment, storyboard, spoken wording, narration configuration, renderer, planned timing policy, and visual direction. Returned alignment may replace estimated scene timestamps without another approval when the resulting duration remains at or below 120 seconds and all other frozen decisions remain intact. Record the approved packet separately from drafts.

### 4. Spawn the coding/rendering agent

After approval, give the coding/rendering agent only the evidence it needs, the frozen approval packet, brand assets, `references/production.md`, and the workspace path. It owns all animation source changes and rendering commands.

Require it to render an MP4, save a production manifest, and place the completed MP4 at the previously selected delivery path. The authoritative final video must not remain buried under `production/`; internal render files may remain there. For narrated runs, require one approved full-script generation or reuse of an exact cached match, then local timing and muxing. For an approved silent partial run, render from estimated scene timings with no narration call, captions, audio, or muxing, and label all outputs as intermediate. A source-only result is incomplete unless a missing dependency or environment restriction makes rendering impossible; report that blocker precisely.

Immediately before the billable request, require production to repeat the
filtered authenticated v2 lookup and stop if the approved ID/name pair is no
longer available.

### 5. Spawn the review agent

Give the review agent read-only responsibility for the frozen approval packet, production manifest, source, and render. It follows `references/review.md`, extracts a screenshot from every scene (plus additional frames for materially different states), includes those images as context in its multimodal review request, evaluates the rendered composition against the plan and design-quality criteria, and writes a review report with scene-level evidence.

At an explicitly requested first-render-and-review boundary, write and deliver the review report after this first pass regardless of its result, then stop; report identified mismatches without starting corrections and do not call the artifact final. Otherwise, if automated review passes, present the final video for user audiovisual approval and keep the workflow open. If it has a small implementation mismatch, the review agent sends a precise correction request to the existing coding/rendering agent. That agent changes the source and rerenders; the review agent then verifies the new render.

Local timing, caption, silence, level, fade, and mux corrections reuse the narration and stay in the loop. A voice, model, delivery, or pronunciation change requires a fresh estimate and approval before one new full-script request. Any spoken-wording change invalidates approval and restarts workflow step 1 in a new workspace, then reruns planning with the prior packet, artifacts, and final-video feedback as context. Other frozen creative changes also return to the user.

### 6. Deliver

Begin the delivery response with the exact absolute path to the rendered MP4 in the hidden PR-specific directory. Do not make the user search through a `production/` or `runs/` tree.

Return links or paths to:

- the top-level delivered MP4;
- animation source and build instructions;
- the approved packet;
- timed narration script and captions;
- narration request, alignment, timing report, and preserved audio artifacts;
- production manifest; and
- final review report.

State which claims are implementation facts from the PR and which narrative claims are directly supported by user-provided context. List unresolved gaps and caveats. For narrated output, report `automated review passed; user audiovisual approval pending` until the user accepts the final video. Never claim automated judgment of pronunciation, delivery, or subjective voice quality.

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
