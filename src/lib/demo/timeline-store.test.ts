import { beforeEach, describe, expect, it } from "vitest";

import {
  DEMO_DATA_VERSION,
  type DemoClaimTimelineRecord,
} from "@/lib/demo/model";

import {
  createTimelineStore,
  DEMO_TIMELINE_STORAGE_KEY,
} from "./timeline-store";

const mockRecord: DemoClaimTimelineRecord = {
  version: DEMO_DATA_VERSION,
  personaId: "asha-planning",
  claimId: "DEMO-CLM-1001",
  acknowledgementNumber: "ACK-2026-AV-9482",
  status: "submitted",
  requestedAmountRupees: 75000,
  events: [
    {
      id: "EVT-1",
      occurredOn: "2026-08-29",
      title: "Claim submitted in demo",
      description: "Synthetic claim submitted with mock OTP.",
    },
  ],
  updatedAt: "2026-08-29T12:00:00.000Z",
  pendingAction: {
    title: "Field office allocation",
    description: "Your mock claim is queued for field review.",
  },
};

describe("TimelineStore", () => {
  beforeEach(() => {
    window.localStorage.clear();
  });

  it("saves and restores a timeline record for a persona", () => {
    const store = createTimelineStore(window.localStorage);
    expect(store.save(mockRecord)).toBe(true);
    expect(store.load("asha-planning")).toEqual(mockRecord);
  });

  it("maintains separate timelines per persona", () => {
    const store = createTimelineStore(window.localStorage);
    store.save(mockRecord);
    expect(store.load("imran-returned")).toBeNull();
  });

  it("safely ignores corrupted data in storage", () => {
    window.localStorage.setItem(
      DEMO_TIMELINE_STORAGE_KEY,
      JSON.stringify({ "asha-planning": { invalid: true } }),
    );
    const store = createTimelineStore(window.localStorage);
    expect(store.load("asha-planning")).toBeNull();
  });

  it("clears individual persona timeline without affecting others", () => {
    const store = createTimelineStore(window.localStorage);
    store.save(mockRecord);
    store.save({
      ...mockRecord,
      personaId: "imran-returned",
      claimId: "DEMO-CLM-1002",
    });

    store.clear("asha-planning");
    expect(store.load("asha-planning")).toBeNull();
    expect(store.load("imran-returned")).not.toBeNull();
  });
});
