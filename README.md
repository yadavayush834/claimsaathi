# ClaimSaathi

ClaimSaathi is an independent prototype for a simpler EPF-withdrawal journey. It is not affiliated with or connected to EPFO or any government system. The application will use synthetic identities, claims, balances, documents, OTPs, and status changes throughout development and demonstration.

## Phase 01 foundation

The repository uses:

- Next.js 16 App Router
- React 19
- TypeScript with strict checking
- Tailwind CSS 4
- ESLint and Prettier
- Vitest and Testing Library
- npm on Node.js 20.9 or newer

Product features are intentionally deferred to their numbered phases in [`docs/BUILD_PLAN.md`](docs/BUILD_PLAN.md).

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Verification

```bash
npm run verify
```

The verification pipeline checks formatting, lint rules, TypeScript, unit tests, and the production build. Individual commands are also available as `npm run format:check`, `npm run lint`, `npm run typecheck`, `npm run test:run`, and `npm run build`.

## Delivery workflow

ClaimSaathi is built one approved phase at a time. Each phase receives its own branch and pull request, then development stops for user review. The binding workflow lives in [`.agents/skills/claimsaathi-phase-gate/SKILL.md`](.agents/skills/claimsaathi-phase-gate/SKILL.md).
