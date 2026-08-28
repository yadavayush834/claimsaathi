import type { ReactNode } from "react";

import styles from "./callout.module.css";

type CalloutProps = Readonly<{
  children: ReactNode;
  title: string;
}>;

export function Callout({ children, title }: CalloutProps) {
  return (
    <aside className={styles.callout} aria-label={title}>
      <span className={styles.marker} aria-hidden="true">
        i
      </span>
      <div>
        <strong>{title}</strong>
        <p>{children}</p>
      </div>
    </aside>
  );
}
