---
name: claimsaathi-phase-gate
description: Enforce ClaimSaathi's user-approved, one-phase-at-a-time implementation workflow, including scoped verification, one branch and pull request per phase, and a mandatory stop for review. Use for any implementation, refactor, testing, deployment, or submission work in the ClaimSaathi repository; do not use for discussion-only planning that changes no project files.
---

# Claimsaathi Phase Gate

Build ClaimSaathi only through the approved phases in `docs/BUILD_PLAN.md`. The phase boundary is a hard product requirement, not a suggestion.

## Before changing code

1. Read `docs/BUILD_PLAN.md` completely and inspect the repository status, current branch, remotes, and existing pull requests.
2. Identify the next phase whose prerequisite phases are merged.
3. Require an explicit user instruction to start that exact phase. General requests such as "continue building" do not authorize multiple phases.
4. If the preceding phase is still awaiting review, unmerged, or the local default branch is not synchronized, do not begin another phase.
5. Restate the active phase, its acceptance criteria, and any discovered blocker before implementation.

If the repository, GitHub remote, authentication, or pull-request mechanism is missing, stop before product implementation and report what setup is required. Do not weaken the one-PR-per-phase contract to work around missing infrastructure.

## Phase boundary

- Implement exactly one numbered phase per task.
- Change only what the active phase needs, plus the smallest supporting correction necessary to keep that phase buildable and testable.
- Do not implement acceptance criteria belonging to later phases, even when they appear easy or closely related.
- Record unrelated defects or future ideas as notes; do not fix them in the current pull request.
- Do not renumber, merge, split, or expand phases without the user's explicit approval.
- Preserve the product constraints: independent prototype, citizen-facing journey, synthetic data, no live EPFO integration, no real credentials or sensitive identifiers, and visible mock-data disclosures.

## Branch, verification, and pull request

For an authorized phase:

1. Synchronize from the repository's default branch without discarding user changes.
2. Create a dedicated branch named `phase/NN-short-slug`.
3. Implement only that phase.
4. Run the phase-specific checks from `docs/BUILD_PLAN.md` and proportionate regression checks. Do not claim checks that were not run.
5. Review the diff for scope leakage, secrets, real personal data, misleading government affiliation, and accidental changes.
6. Commit with a phase-specific message, push the branch, and create one pull request against the default branch.
7. Verify the pull request's URL, open state, base branch, head branch, title, and included commits.
8. Update the plan's status only to reflect the observable state. A phase is not complete until its pull request is merged.

Never merge the pull request unless the user explicitly asks. Never start the next phase in the same task after opening or updating the current phase's pull request.

## Mandatory stopping point

After the pull request is verified, stop completely and hand back:

- phase number and name;
- pull-request link and state;
- concise list of delivered behavior;
- checks run and their results;
- honest limitations or review notes;
- the statement that the next phase has not started.

Wait for the user to review and explicitly authorize the next phase. Finishing early, having spare context, or seeing an obvious next task does not remove this stop.
