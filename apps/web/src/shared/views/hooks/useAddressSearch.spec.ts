import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import type {
  AddressSearchGateway,
  AddressWithBanId,
} from "@/shared/core/gateways/AddressSearchGateway";

import { useAddressSearch } from "./useAddressSearch";

const createAddress = (overrides: Partial<AddressWithBanId> = {}): AddressWithBanId => ({
  banId: "ban-default",
  value: "1 rue de la Paix, Paris",
  city: "Paris",
  cityCode: "75001",
  postCode: "75001",
  long: 2.33,
  lat: 48.86,
  ...overrides,
});

const DEBOUNCE_DELAY = 300;

describe("useAddressSearch", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("does not search when text is 3 characters or fewer", async () => {
    const search = vi.fn().mockResolvedValue([]);
    const gateway: AddressSearchGateway = { search };
    const { result } = renderHook(() => useAddressSearch(gateway));

    act(() => {
      result.current.setSearchText("abc");
    });

    await act(async () => {
      vi.advanceTimersByTime(DEBOUNCE_DELAY);
    });

    expect(search).not.toHaveBeenCalled();
  });

  it("searches after debounce delay when text exceeds 3 characters", async () => {
    const search = vi.fn().mockResolvedValue([]);
    const gateway: AddressSearchGateway = { search };
    const { result } = renderHook(() => useAddressSearch(gateway));

    act(() => {
      result.current.setSearchText("Mont");
    });

    await act(async () => {
      vi.advanceTimersByTime(DEBOUNCE_DELAY);
    });

    expect(search).toHaveBeenCalledWith("Mont", { type: undefined });
  });

  it("shows results matching current search text, not latest response", async () => {
    const addressMon = createAddress({ value: "Monaco", banId: "ban-monaco" });
    const addressMontr = createAddress({ value: "Montrouge", banId: "ban-montrouge" });

    let resolveMonSearch: (value: AddressWithBanId[]) => void;
    let resolveMontrSearch: (value: AddressWithBanId[]) => void;

    const monSearchPromise = new Promise<AddressWithBanId[]>((resolve) => {
      resolveMonSearch = resolve;
    });
    const montrSearchPromise = new Promise<AddressWithBanId[]>((resolve) => {
      resolveMontrSearch = resolve;
    });

    const gateway: AddressSearchGateway = {
      search: vi.fn((text) => {
        if (text === "Mon") return monSearchPromise;
        if (text === "Montr") return montrSearchPromise;
        return Promise.resolve([]);
      }),
    };

    const { result } = renderHook(() => useAddressSearch(gateway));

    // User types "Mon" and waits for debounce
    act(() => {
      result.current.setSearchText("Mon");
    });

    await act(async () => {
      vi.advanceTimersByTime(DEBOUNCE_DELAY);
    });

    expect(result.current.suggestions).toEqual([]);

    // User types "Montr" immediately (fast typing)
    act(() => {
      result.current.setSearchText("Montr");
    });

    await act(async () => {
      vi.advanceTimersByTime(DEBOUNCE_DELAY);
    });

    // Both requests are in-flight. Now "Mon" response arrives first (slow)
    await act(async () => {
      resolveMonSearch([addressMon]);
    });

    // Should still show empty because we're waiting for "Montr" results
    expect(result.current.suggestions).toEqual([]);

    // Now "Montr" response arrives (the one we care about)
    await act(async () => {
      resolveMontrSearch([addressMontr]);
    });

    // Now we should see the correct results for "Montr"
    expect(result.current.suggestions).toEqual([addressMontr]);
  });

  it("returns cached results without re-fetching for previously searched text", async () => {
    const addressMont = createAddress({ value: "Montrouge" });
    const addressParis = createAddress({ value: "Paris" });

    const search = vi.fn((text: string) => {
      if (text === "Mont") return Promise.resolve([addressMont]);
      if (text === "Paris") return Promise.resolve([addressParis]);
      return Promise.resolve([]);
    });
    const gateway: AddressSearchGateway = { search };

    const { result } = renderHook(() => useAddressSearch(gateway));

    // First search for "Mont"
    act(() => {
      result.current.setSearchText("Mont");
    });

    await act(async () => {
      vi.advanceTimersByTime(DEBOUNCE_DELAY);
    });

    expect(search).toHaveBeenCalledTimes(1);
    expect(result.current.suggestions).toEqual([addressMont]);

    // Search for something else "Paris"
    act(() => {
      result.current.setSearchText("Paris");
    });

    await act(async () => {
      vi.advanceTimersByTime(DEBOUNCE_DELAY);
    });

    expect(search).toHaveBeenCalledTimes(2);
    expect(result.current.suggestions).toEqual([addressParis]);

    // Go back to "Mont" - should use cache and not call search again
    act(() => {
      result.current.setSearchText("Mont");
    });

    await act(async () => {
      vi.advanceTimersByTime(DEBOUNCE_DELAY);
    });

    // Should still be 2 calls total (no new call for "Mont")
    expect(search).toHaveBeenCalledTimes(2);
    expect(result.current.suggestions).toEqual([addressMont]);
  });
});
