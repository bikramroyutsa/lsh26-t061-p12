# Third-Party Material and AI Disclosure

List material frameworks, libraries, starters, templates, UI kits, fonts, icons and assets used in this repository.

| Name | Version or source URL | Licence | Used for |
|---|---|---|---|
| next | 16.3.3 / https://nextjs.org | MIT | React framework for routing, SSR, and App Router |
| react | 19.2.8 / https://react.dev | MIT | Core UI component rendering library |
| react-dom | 19.2.8 / https://react.dev | MIT | React DOM renderer |
| lucide-react | ^1.37.0 / https://lucide.dev | ISC | Modern SVG UI icons |
| tailwindcss | ^4.3.3 / https://tailwindcss.com | MIT | Utility-first styling engine |
| @tailwindcss/postcss | ^4.3.3 / https://tailwindcss.com | MIT | PostCSS plugin for Tailwind CSS |
| typescript | ^5 / https://www.typescriptlang.org | Apache-2.0 | Static typing and interfaces |
| eslint | ^9 / https://eslint.org | MIT | Linting and code quality |
| eslint-config-next | 16.3.3 / https://nextjs.org | MIT | ESLint configuration for Next.js |
| Inter Font | https://fonts.google.com/specimen/Inter | SIL OFL 1.1 | Modern clean sans-serif typography |

## AI tools

List each AI tool in `evaluation-manifest.json`, what it was used for and how the output was verified. Write `None` if no AI tool was used.

| Tool | Used for | How output was verified |
|---|---|---|
| Gemini 3.7 Flash | Code generation, UI component structuring, reactive state flow design, and refactoring | Manual code review, interactive UI validation in browser, and test case execution |
| Gemini 3.6 Flash / 3.5 Flash | Boilerplate scaffolding, data validation helpers, and mock receipt generation | Linting checks, dataset schema verification, and browser testing |
| Gemini 3.1 Pro | Mathematical formula derivation, OCR integration, and algorithmic calculation logic | Validated mathematical output against manual calculations and official benchmark fixtures |
| Claude Sonnet 4.6 | Architecture planning, design system tokens, documentation generation, and bug fixing | TypeScript type-checking, linter validation, and manual runtime testing |

## Original-work statement

Everything not declared in this file or `EVENT.md` was created by team_zurich during the event window.
