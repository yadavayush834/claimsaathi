import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/ui/status-badge";
import type {
  DemoCase,
  DemoClaimStatus,
  DemoIssueTone,
} from "@/lib/demo/model";

import styles from "./claim-workspace.module.css";

type ClaimWorkspaceProps = Readonly<{
  demoCase: DemoCase;
  sessionMessage: string;
  onSwitch: () => void;
  onPlanWithdrawal?: () => void;
}>;

const claimStatusLabels: Record<DemoClaimStatus, string> = {
  draft: "Draft ready",
  action_needed: "Action needed",
  settled: "Settled in demo",
};

const claimStatusTones: Record<
  DemoClaimStatus,
  "info" | "warning" | "success"
> = {
  draft: "info",
  action_needed: "warning",
  settled: "success",
};

const issueTones: Record<DemoIssueTone, "success" | "critical" | "warning"> = {
  clear: "success",
  attention: "critical",
  review: "warning",
};

const currencyFormatter = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

const dateFormatter = new Intl.DateTimeFormat("en-IN", {
  day: "numeric",
  month: "short",
  year: "numeric",
  timeZone: "UTC",
});

function formatDate(date: string) {
  return dateFormatter.format(new Date(`${date}T00:00:00Z`));
}

function getInitials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

export function ClaimWorkspace({
  demoCase,
  onPlanWithdrawal,
  onSwitch,
  sessionMessage,
}: ClaimWorkspaceProps) {
  const { claim, persona, workspace } = demoCase;
  const totalBalance =
    workspace.balance.employeeShareRupees +
    workspace.balance.employerShareRupees +
    workspace.balance.pensionShareRupees;
  const claimHeading =
    claim.status === "settled" ? "Latest claim" : "Active claim";

  const employeeSharePct = Math.round(
    (workspace.balance.employeeShareRupees / totalBalance) * 100,
  );
  const employerSharePct = Math.round(
    (workspace.balance.employerShareRupees / totalBalance) * 100,
  );
  const pensionSharePct = 100 - employeeSharePct - employerSharePct;

  return (
    <section className={styles.workspace} aria-labelledby="workspace-title">
      <header className={styles.workspaceHeader}>
        <div className={styles.personaBanner}>
          <div className={styles.personaAvatar} aria-hidden="true">
            {getInitials(persona.displayName)}
          </div>
          <div className={styles.personaDetails}>
            <p className={styles.fixtureEyebrow}>
              Fictional claim workspace · fixture v{demoCase.fixtureVersion}
            </p>
            <h2 id="workspace-title">{persona.displayName}</h2>
            <div className={styles.scenarioRow}>
              <span className={styles.scenarioTitle}>
                {persona.scenarioTitle}
              </span>
              <span className={styles.stateChip}>{persona.homeState}</span>
            </div>
          </div>
        </div>
        <div className={styles.headerBadges}>
          <StatusBadge tone="success">Demo session active</StatusBadge>
          <Button
            variant="secondary"
            onClick={onSwitch}
            className={styles.switchTopBtn}
          >
            Switch citizen
          </Button>
        </div>
      </header>

      <div className={styles.sessionBanner}>
        <span className={styles.sessionDot} aria-hidden="true" />
        <p className={styles.sessionNote} aria-live="polite">
          {sessionMessage}
        </p>
      </div>

      <section
        className={styles.nextAction}
        aria-labelledby="next-action-title"
      >
        <div className={styles.nextActionLabel}>
          <span aria-hidden="true">→</span>
          <p>What to do next</p>
        </div>
        <div className={styles.nextActionBody}>
          <div className={styles.nextActionHeading}>
            <h3 id="next-action-title">{workspace.nextAction.title}</h3>
            <StatusBadge tone={onPlanWithdrawal ? "info" : "neutral"}>
              {onPlanWithdrawal ? "Available now" : "Journey preview"}
            </StatusBadge>
          </div>
          <p className={styles.nextActionDesc}>
            {workspace.nextAction.description}
          </p>
          <small className={styles.nextActionHint}>
            {onPlanWithdrawal
              ? "Uses fictional answers and a deterministic mock policy."
              : "This workspace identifies the next step; the guided action is added in its later build phase."}
          </small>
          {onPlanWithdrawal ? (
            <Button className={styles.planActionBtn} onClick={onPlanWithdrawal}>
              Plan mock withdrawal
            </Button>
          ) : null}
        </div>
      </section>

      <div className={styles.summaryGrid}>
        <section
          className={styles.ledgerSection}
          aria-labelledby="balance-title"
        >
          <div className={styles.sectionLabel}>
            <p>Balance</p>
            <StatusBadge tone="neutral">Synthetic</StatusBadge>
          </div>
          <h3 id="balance-title">Synthetic PF balance</h3>
          <strong className={styles.balanceTotal}>
            {currencyFormatter.format(totalBalance)}
          </strong>

          {/* Visual Distribution Progress Bar */}
          <div className={styles.balanceBar} aria-hidden="true">
            <span
              className={styles.employeeBar}
              style={{ width: `${employeeSharePct}%` }}
              title={`Employee: ${employeeSharePct}%`}
            />
            <span
              className={styles.employerBar}
              style={{ width: `${employerSharePct}%` }}
              title={`Employer: ${employerSharePct}%`}
            />
            <span
              className={styles.pensionBar}
              style={{ width: `${pensionSharePct}%` }}
              title={`Pension: ${pensionSharePct}%`}
            />
          </div>

          <dl className={styles.balanceBreakdown}>
            <div className={styles.shareRow}>
              <dt>
                <span
                  className={`${styles.shareDot} ${styles.employeeDot}`}
                  aria-hidden="true"
                />
                Employee share
              </dt>
              <dd>
                {currencyFormatter.format(
                  workspace.balance.employeeShareRupees,
                )}
              </dd>
            </div>
            <div className={styles.shareRow}>
              <dt>
                <span
                  className={`${styles.shareDot} ${styles.employerDot}`}
                  aria-hidden="true"
                />
                Employer share
              </dt>
              <dd>
                {currencyFormatter.format(
                  workspace.balance.employerShareRupees,
                )}
              </dd>
            </div>
            <div className={styles.shareRow}>
              <dt>
                <span
                  className={`${styles.shareDot} ${styles.pensionDot}`}
                  aria-hidden="true"
                />
                Pension share
              </dt>
              <dd>
                {currencyFormatter.format(workspace.balance.pensionShareRupees)}
              </dd>
            </div>
          </dl>
          <p className={styles.scopeNote}>
            Balance on record is not an eligibility result.
          </p>
        </section>

        <section className={styles.ledgerSection} aria-labelledby="claim-title">
          <div className={styles.sectionLabel}>
            <p>Claim</p>
            <StatusBadge tone={claimStatusTones[claim.status]}>
              {claimStatusLabels[claim.status]}
            </StatusBadge>
          </div>
          <h3 id="claim-title">{claimHeading}</h3>
          <strong className={styles.claimAmount}>
            {currencyFormatter.format(claim.requestedAmountRupees)}
          </strong>
          <dl className={styles.claimDetails}>
            <div>
              <dt>Reference</dt>
              <dd className={styles.refCode}>{claim.id}</dd>
            </div>
            <div>
              <dt>Request type</dt>
              <dd>PF advance</dd>
            </div>
            <div>
              <dt>Last update</dt>
              <dd>{claim.lastEventLabel}</dd>
            </div>
          </dl>
        </section>
      </div>

      <div className={styles.detailGrid}>
        <section
          className={styles.issueSection}
          data-tone={workspace.issue.tone}
          aria-labelledby="issue-title"
        >
          <div className={styles.sectionLabel}>
            <p>Issue state</p>
            <StatusBadge tone={issueTones[workspace.issue.tone]}>
              {workspace.issue.ownerLabel}
            </StatusBadge>
          </div>
          <h3 id="issue-title">{workspace.issue.title}</h3>
          <p>{workspace.issue.description}</p>
        </section>

        <section
          className={styles.eventsSection}
          aria-labelledby="events-title"
        >
          <div className={styles.sectionLabel}>
            <p>Recent activity</p>
            <span className={styles.eventsMeta}>Newest first</span>
          </div>
          <h3 id="events-title">Recent events</h3>
          <ol>
            {workspace.recentEvents.map((event) => (
              <li key={event.id}>
                <time dateTime={event.occurredOn}>
                  {formatDate(event.occurredOn)}
                </time>
                <div>
                  <strong>{event.title}</strong>
                  <p>{event.description}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>
      </div>

      <footer className={styles.workspaceFooter}>
        <p>
          Only the fictional case id is saved in this browser. No real account
          is connected.
        </p>
        <Button variant="secondary" onClick={onSwitch}>
          Switch demo citizen
        </Button>
      </footer>
    </section>
  );
}
