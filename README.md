# PR Change Video

PR Change Video is an agent skill that turns a GitHub pull request and its project context into a short, stakeholder-ready changelog video. It plans an evidence-backed story, renders it with Remotion or Manim after user approval, and independently reviews the final artifact.

The repository contains the current skill source, evaluation fixtures and benchmark artifacts, and a packaged `.skill` archive. The workflow is usable, but its interface and packaging can still change before a stable release.

## Workflow

The skill uses exactly three roles with separate ownership:

1. **Planning agent** — inspects the PR, repository, and supplied context; records an evidence ledger; recommends an audience and renderer; and writes the approval packet.
2. **Coding/rendering agent** — starts only after approval, implements the frozen packet, renders the MP4, and records production metadata.
3. **Review agent** — inspects the actual render against the approved packet and requests only bounded implementation corrections.

The user must approve the source-derived content, audience treatment, storyboard, narration, renderer, duration, and visual direction before production. A correction that changes any frozen decision returns to the user for approval.

## Evidence boundary

The current PR diff and repository code determine what changed and what behavior is implemented. User-supplied context determines motivation, rationale, tradeoffs, intended impact, risks, conclusions, next steps, and argumentative framing.

The skill can select, shorten, order, quote, and visualize supplied evidence. It must not infer a stronger argument from the code or silently resolve a contradiction in favor of a convenient narrative. Material conflicts are surfaced in the approval packet.

## Audience and renderer

The supported audience presets are `TPM`, `executive`, and `IC`. The planner exposes assumptions about viewer knowledge, technical depth, terminology, emphasis, exclusions, and tone for the user to edit.

Renderer selection follows the dominant explanatory need:

- **Manim** for persistent objects whose states or relationships transform over time, such as algorithms, data structures, protocols, and control flow.
- **Remotion** for editorial composition, such as UI walkthroughs, screenshots, release narratives, timelines, and branded layouts.

The default duration is 90 seconds. Durations over 120 seconds require explicit approval. A v1 video uses one renderer, and the skill produces timed narration and captions without synthesized narration audio.

## Requirements

A production run requires:

- a GitHub PR URL;
- GitHub access through `gh` or equivalent tooling;
- support for separate planning, coding/rendering, and review agents;
- Node.js and Remotion, or Python and Manim, according to the approved plan; and
- preferably `ffmpeg` and `ffprobe` for render inspection.

Optional inputs include design notes, issue links, transcripts, screenshots, diagrams, brand assets, an audience preference, and a target duration. The skill asks only for information it cannot discover and that is necessary for a coherent artifact.

## Output

Each PR gets a hidden `.pr-change-video/pr-<number>/` directory. Individual runs keep their plans, evidence, source, narration, previews, and review artifacts under its `runs/` directory, so no visible workspace is created.

The final MP4 is placed at the top level of the PR-specific directory—for example, `.pr-change-video/pr-44/video.mp4`. The completion response reports its exact absolute path so it is never buried in a run or `production/` tree.

A run is complete only when it delivers a rendered MP4, animation source and build instructions, the frozen approval packet, narration and captions, a production manifest, and a review report for the final render. If rendering is blocked by a missing dependency or environment restriction, the agent reports that blocker precisely.

## Repository layout

```text
pr-change-video/
  SKILL.md                 workflow entry point and contract
  references/
    planning.md            evidence, audience, renderer, and approval rules
    production.md          rendering contract and output requirements
    review.md              verification and correction boundary
  evals/
    evals.json             evaluation prompts and expectations
    files/                 evaluation fixtures
pr-change-video-workspace/ generated benchmark and grading artifacts by iteration
pr-change-video.skill      packaged skill archive
logan-smith-info.md        supporting research material
LICENSE.md                 MIT license
```

The current evaluation set covers three scenarios: a conflicting vector-reserve explanation, an executive billing-flow update, and a leader-failover claim that exceeds the implementation. Generated iteration directories are historical evaluation artifacts; do not edit them as source or rewrite an earlier iteration.

## Using the skill

Use [`pr-change-video/SKILL.md`](pr-change-video/SKILL.md) as the source entry point. [`pr-change-video.skill`](pr-change-video.skill) is the packaged ZIP archive for clients that accept packaged agent skills.

Example request:

```text
Create a 90-second IC-facing changelog video for <PR URL>.
Use these implementer notes as context, and stop after planning for my approval.
```

The skill first produces an approval packet. It does not create animation source or begin rendering until the user approves that packet.

## Development and validation

There is no application build or dependency manifest in this repository. From the repository root, run the lightweight checks:

```sh
jq empty pr-change-video/evals/evals.json
unzip -t pr-change-video.skill
rg -n "planning agent|coding/rendering agent|review agent" pr-change-video
```

Every behavior change should add or refine an independently testable expectation in `pr-change-video/evals/evals.json`. Run the external skill evaluation workflow after source changes and store results in a new `pr-change-video-workspace/iteration-N/` directory. Update the packaged archive only after the source changes pass validation.

## Contributing

Keep the approval gate, evidence provenance, and three-role ownership boundary intact. Prefer concise Markdown, sentence-case headings, and responsibility-based reference filenames. Pull requests should describe the workflow change, list affected evaluations, summarize benchmark results, and identify regenerated archive or workspace artifacts.

## License

This project is licensed under the MIT License. See [`LICENSE.md`](LICENSE.md).
