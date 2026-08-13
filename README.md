# PR Change Video

An agent skill that turns a GitHub pull request and its project context into a short, stakeholder-ready changelog video. It plans an evidence-backed story, renders it with Remotion or Manim after approval, and independently reviews the result.

## Install

```sh
npx skills add andrewmarous/pr-change-video
```

## Use

Ask your agent to create a changelog video for a pull request, for example:

```text
Create a 90-second IC-facing changelog video for <PR URL>.
Use these implementer notes as context, and stop after planning for my approval.
```

The skill requires a GitHub PR URL and authenticated GitHub access. Narrated production also requires an `ELEVENLABS_API_KEY` and a supported renderer toolchain. See [SKILL.md](SKILL.md) for the complete workflow and requirements.

## Repository layout

```text
SKILL.md       Skill entry point
references/    Planning, production, and review guidance
scripts/       Requirements and narration helpers
LICENSE.md     MIT license
```

Development artifacts and evaluation history are maintained on the [`dev`](https://github.com/andrewmarous/pr-change-video/tree/dev) branch. The `main` branch contains only the distributable skill.

## License

[MIT](LICENSE.md)
