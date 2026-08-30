import { describe, expect, it } from "vitest";

import { detectSensitivePii } from "./pii-detector";

describe("detectSensitivePii", () => {
  it("returns no PII for normal fictional descriptions", () => {
    const result = detectSensitivePii("Knee surgery treatment in hospital");
    expect(result.hasPii).toBe(false);
    expect(result.detectedTypes).toHaveLength(0);
    expect(result.warningEn).toBeNull();
  });

  it("detects 12-digit Aadhaar number pattern", () => {
    const result = detectSensitivePii("My aadhaar number is 9876 5432 1098");
    expect(result.hasPii).toBe(true);
    expect(result.detectedTypes).toContain("aadhaar");
    expect(result.warningEn).toContain("aadhaar");
  });

  it("detects 10-character PAN pattern", () => {
    const result = detectSensitivePii("Ref PAN: BNGPA1234K for filing");
    expect(result.hasPii).toBe(true);
    expect(result.detectedTypes).toContain("pan");
  });

  it("detects 12-digit UAN pattern", () => {
    const result = detectSensitivePii("Member UAN 109988776655 not active");
    expect(result.hasPii).toBe(true);
    expect(result.detectedTypes).toContain("uan");
  });

  it("detects passwords and secrets", () => {
    const result = detectSensitivePii("My password: mySecret123!");
    expect(result.hasPii).toBe(true);
    expect(result.detectedTypes).toContain("secret");
  });

  it("allows safe demo fixture strings without false alarms", () => {
    expect(detectSensitivePii("100904123456").hasPii).toBe(false);
    expect(detectSensitivePii("DEMO-CLM-1001").hasPii).toBe(false);
    expect(detectSensitivePii("SBIN0001234").hasPii).toBe(false);
  });
});
