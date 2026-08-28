import type { ReactNode } from "react";

import styles from "./status-badge.module.css";

type StatusTone = "neutral" | "success" | "info" | "warning" | "critical";

type StatusBadgeProps = Readonly<{
  children: ReactNode;
  tone?: StatusTone;
}>;

export function StatusBadge({ children, tone = "neutral" }: StatusBadgeProps) {
  return (
    <span className={styles.badge} data-tone={tone}>
      <span className={styles.dot} aria-hidden="true" />
      {children}
    </span>
  );
}
