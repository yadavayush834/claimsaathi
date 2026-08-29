import type {
  DemoPreflightCheck,
  DemoPreflightSnapshot,
} from "@/lib/demo/model";

export type DemoPreflightResult = Readonly<{
  checks: readonly DemoPreflightCheck[];
  readyCount: number;
  actionCount: number;
  categoriesNeedingAction: readonly string[];
}>;

export function runDemoPreflight(
  snapshot: DemoPreflightSnapshot,
): DemoPreflightResult {
  const checks = snapshot.checks;
  const actionChecks = checks.filter(
    (check) => check.status === "action_needed",
  );

  return Object.freeze({
    checks,
    readyCount: checks.length - actionChecks.length,
    actionCount: actionChecks.length,
    categoriesNeedingAction: Object.freeze(
      actionChecks.map((check) => check.category),
    ),
  });
}
