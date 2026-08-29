# ClaimSaathi build plan

## Product definition

ClaimSaathi is an independent, mobile-first prototype that redesigns one citizen journey: withdrawing EPF funds successfully when the existing process is fragmented, unclear, or fails. A citizen can plan a withdrawal, check readiness, submit a synthetic claim, track it, understand a problem, correct it, and prepare a grievance without interacting with a live government system.

The prototype must never present itself as an official EPFO product. It must use synthetic identities, balances, documents, OTPs, claim identifiers, submissions, and status changes.

## Primary citizen journey

1. Enter the demo without creating an account.
2. Select a withdrawal need and understand the applicable mock path.
3. Review a synthetic balance and eligibility result.
4. Resolve KYC or document readiness issues.
5. Complete, review, and submit a simplified mock claim.
6. Track the mock claim through a clear timeline.
7. Understand and correct an unexplained rejection.
8. Reconcile an unexpected settlement amount.
9. Prepare and track a mock grievance when the issue remains unresolved.

## Product principles

- Design for a narrow mobile viewport, slow connections, keyboard use, screen readers, and limited digital experience.
- Prefer task language such as "Withdraw my PF" over portal terminology.
- Preserve entered information across steps and make every error actionable.
- Keep calculations and eligibility checks deterministic and source-grounded.
- Use OpenAI for interpretation, structured classification, plain-language explanation, and draft generation—not as the authority for entitlement or settlement calculations.
- Display persistent labels for demo data, simulated actions, and unavailable production integrations.
- Never collect or transmit real Aadhaar, PAN, UAN, bank credentials, passwords, OTPs, or government documents.

## Selected architecture

- Next.js 16.3.3 App Router with React 19.2.8.
- TypeScript 5.9 in strict, no-emit mode.
- Tailwind CSS 4.3 for the design system beginning in Phase 02.
- ESLint 9 with the Next.js Core Web Vitals and TypeScript rules, plus Prettier 3.
- Vitest 4, Testing Library 16, and jsdom 29 for baseline component tests.
- Node.js 20.9 or newer and npm with a committed lockfile.
- Server-only OpenAI integration returning validated structured output, introduced in Phase 11.
- Versioned synthetic fixtures and a deterministic mock service layer, introduced in Phase 04.
- Browser persistence for the reviewer journey; no production identity system.
- Vercel-compatible public deployment targeted for Phase 17.

## Phase status rules

Statuses are `NOT STARTED`, `IN PR`, or `MERGED`. Only one phase may be `IN PR`. A phase becomes `MERGED` only after its pull request is confirmed merged. Later phases remain `NOT STARTED` until the user explicitly authorizes them.

| Phase | Deliverable                                             | Acceptance gate                                                                                                                                                     | Status      |
| ----: | ------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- |
|    01 | Repository and application foundation                   | App runs locally; formatting, linting, type checking, and baseline tests are documented and pass; project-local phase skill is included                             | MERGED      |
|    02 | Design system and responsive application shell          | Tokens, typography, reusable controls, navigation shell, and narrow-mobile layout render without overflow                                                           | MERGED      |
|    03 | Landing, problem framing, and trust boundary            | Citizen understands the task, independence from EPFO, synthetic-data policy, and can enter the demo without login                                                   | MERGED      |
|    04 | Synthetic citizen session and mock service layer        | Versioned demo personas and claims load through typed service boundaries; refresh recovery works                                                                    | MERGED      |
|    05 | Unified PF claim workspace                              | Balance, active claim, recent events, issue state, and next action appear in one accessible mobile-first view                                                       | MERGED      |
|    06 | Withdrawal goal, eligibility, and amount planning       | Guided questions produce a deterministic, explainable mock eligibility result and amount breakdown                                                                  | MERGED      |
|    07 | Professional visual redesign and interaction foundation | Landing, demo selection, workspace, and planner form one distinctive responsive product with purposeful motion, custom interactions, and unchanged citizen behavior | IN PR       |
|    08 | KYC and document preflight                              | Synthetic identity, bank, and evidence mismatches are detected with actionable ownership and correction steps                                                       | NOT STARTED |
|    09 | Simplified claim-form journey                           | A citizen completes the required mock application fields with inline validation, saved progress, and no dead ends                                                   | NOT STARTED |
|    10 | Review and mock submission                              | Review summary, consent, simulated OTP, server-side mock submission, and synthetic acknowledgement work end to end                                                  | NOT STARTED |
|    11 | Claim-status timeline                                   | Submitted claims progress through deterministic mock states with readable events, pending actions, and refresh persistence                                          | NOT STARTED |
|    12 | OpenAI claim-issue interpreter                          | Unstructured synthetic status text becomes validated structured classification, uncertainty, explanation, and cited next steps; safe fallback works                 | NOT STARTED |
|    13 | Rejection recovery journey                              | Primary rejected-claim scenario goes from explanation through correction checklist, preflight recheck, and mock resubmission                                        | NOT STARTED |
|    14 | Unexpected-settlement reconciliation                    | Requested, eligible, and settled mock amounts reconcile deterministically; unexplained differences are clearly separated from confirmed facts                       | NOT STARTED |
|    15 | Grievance preparation and follow-up                     | Editable AI-assisted grievance, evidence checklist, export/copy action, mock registration, reminder, and status tracking work                                       | NOT STARTED |
|    16 | Hindi, accessibility, and low-bandwidth pass            | Core journey works in English and Hindi, by keyboard, at narrow width, under throttled loading, and with accessibility checks passing                               | NOT STARTED |
|    17 | Privacy, safety, resilience, and honesty pass           | Sensitive-number safeguards, API failure behavior, rate/error states, mock labels, source links, and non-affiliation disclosures are verified                       | NOT STARTED |
|    18 | End-to-end QA and public deployment                     | Automated primary journey passes; fresh-incognito public URL works on desktop and mobile without access requests                                                    | NOT STARTED |
|    19 | Submission package                                      | Two-minute video script/recording checklist, under-250-word summary, architecture explanation, limitations, and final link audit are ready                          | NOT STARTED |

## Pull-request contract

Each numbered phase uses exactly one `phase/NN-short-slug` branch and one pull request. The pull request contains only that phase's acceptance gate and necessary tests. After opening and verifying it, Codex stops. The next phase may begin only after user review, explicit authorization, and confirmation that prerequisites are merged.

## Repository baseline

The public GitHub repository is `yadavayush834/claimsaathi`, with `main` as the protected phase baseline. Product work is delivered only through the numbered phase branches and pull requests described above.
