# Repository Guidelines

## Project Structure & Module Organization

This repository develops and evaluates the `pr-change-video` agent skill.

- `pr-change-video/SKILL.md` is the skill entry point and workflow contract.
- `pr-change-video/references/` contains the planning, production, and review role instructions. Keep ownership boundaries consistent across these files.
- `pr-change-video/evals/evals.json` defines evaluation prompts and expectations; `evals/files/` holds their fixture documents.
- `pr-change-video-workspace/iteration-*` contains generated benchmark runs, grading results, and review reports. Treat these as evaluation artifacts, not source.
- `pr-change-video.skill` is the packaged ZIP archive. Update it only after source changes are validated.
- `logan-smith-info.md` is supporting research material.

## Build, Test, and Development Commands

There is no application build or dependency manifest. Use lightweight validation from the repository root:

```sh
jq empty pr-change-video/evals/evals.json
unzip -t pr-change-video.skill
rg -n "planning agent|coding/rendering agent|review agent" pr-change-video
```

The first command validates evaluation JSON, the second checks the packaged archive, and the third helps audit the three-role boundary. After running the external skill evaluation workflow, place generated results in a new `pr-change-video-workspace/iteration-N/` directory; do not rewrite earlier iterations.

## Coding Style & Naming Conventions

Write concise Markdown with descriptive headings, direct instructions, and fenced examples. Use sentence case for headings and kebab-case for skill directories and packaged files. Name reference files by responsibility (`planning.md`, `production.md`, `review.md`). Preserve the vocabulary used in `SKILL.md`, especially approval gates, evidence boundaries, and role ownership. Format JSON with two-space indentation and keep each expectation independently testable.

## Testing Guidelines

Every behavior change should add or refine an expectation in `evals.json`. Use fixture names that describe the scenario, such as `leader-failover-pr.md`. Check both successful behavior and hard constraints: evidence provenance, approval before production, renderer rationale, and separation of planning, rendering, and review. Compare benchmark output against prior iterations and record regressions rather than editing generated grading files by hand.

## Commit & Pull Request Guidelines

The repository has no commit history yet. Use short, imperative commit subjects, optionally scoped, for example `skill: tighten evidence boundary`. Keep commits focused. Pull requests should explain the workflow change, list affected evals, summarize benchmark results, and identify any regenerated archive or workspace artifacts. Include screenshots only when review HTML or rendered visual output changes.
