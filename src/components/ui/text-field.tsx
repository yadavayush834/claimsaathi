import type { InputHTMLAttributes } from "react";

import styles from "./text-field.module.css";

type TextFieldProps = Omit<InputHTMLAttributes<HTMLInputElement>, "id"> & {
  id: string;
  label: string;
  hint?: string;
  error?: string;
};

export function TextField({
  error,
  hint,
  id,
  label,
  ...inputProps
}: TextFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;
  const describedBy = [hintId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className={styles.field}>
      <label className={styles.label} htmlFor={id}>
        {label}
      </label>
      {hint ? (
        <span className={styles.hint} id={hintId}>
          {hint}
        </span>
      ) : null}
      <input
        aria-describedby={describedBy}
        aria-invalid={Boolean(error)}
        className={styles.input}
        id={id}
        {...inputProps}
      />
      {error ? (
        <span className={styles.error} id={errorId}>
          {error}
        </span>
      ) : null}
    </div>
  );
}
