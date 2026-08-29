import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it } from "vitest";

import { LanguageSwitcher } from "@/components/ui/language-switcher";
import { LocaleProvider, useLocale } from "@/lib/i18n/locale-context";

afterEach(cleanup);

function TestConsumer() {
  const { locale, t, isLowBandwidth } = useLocale();
  return (
    <div>
      <span data-testid="current-locale">{locale}</span>
      <span data-testid="brand-name">{t.common.brandName}</span>
      <span data-testid="low-bandwidth">
        {isLowBandwidth ? "low-bandwidth-on" : "low-bandwidth-off"}
      </span>
      <LanguageSwitcher showBandwidthToggle />
    </div>
  );
}

describe("LocaleContext & LanguageSwitcher", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("provides English by default and switches to Hindi", () => {
    render(
      <LocaleProvider>
        <TestConsumer />
      </LocaleProvider>,
    );

    expect(screen.getByTestId("current-locale")).toHaveTextContent("en");
    expect(screen.getByTestId("brand-name")).toHaveTextContent("ClaimSaathi");

    const hindiBtn = screen.getByRole("button", {
      name: /Switch language to Hindi/i,
    });
    fireEvent.click(hindiBtn);

    expect(screen.getByTestId("current-locale")).toHaveTextContent("hi");
    expect(screen.getByTestId("brand-name")).toHaveTextContent(/क्लेमसाथी/);
  });

  it("toggles low-bandwidth mode", () => {
    render(
      <LocaleProvider>
        <TestConsumer />
      </LocaleProvider>,
    );

    expect(screen.getByTestId("low-bandwidth")).toHaveTextContent(
      "low-bandwidth-off",
    );

    const toggleBtn = screen.getByRole("button", { name: /Low Bandwidth/i });
    fireEvent.click(toggleBtn);

    expect(screen.getByTestId("low-bandwidth")).toHaveTextContent(
      "low-bandwidth-on",
    );
  });
});
