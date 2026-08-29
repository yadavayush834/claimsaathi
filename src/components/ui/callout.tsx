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
      <div className={styles.body}>
        <p className={styles.title}>{title}</p>
        <p className={styles.text}>{children}</p>
      </div>
    </aside>
  );
}
