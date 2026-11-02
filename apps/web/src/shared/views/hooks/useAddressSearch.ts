import { useCallback, useEffect, useRef, useState } from "react";

import {
  ADDRESS_SEARCH_MAX_LENGTH,
  type AddressSearchGateway,
  type AddressType,
  type AddressWithBanId,
} from "@/shared/core/gateways/AddressSearchGateway";

import { useDebounce } from "./useDebounce";

const SEARCH_DEBOUNCE_DELAY_IN_MS = 300;
const MIN_SEARCH_LENGTH = 3;

export type AddressSearchFeedback = "no_result" | "search_failed" | "query_too_long";

type SearchOutcome = { status: "found"; addresses: AddressWithBanId[] } | { status: "failed" };

interface UseAddressSearchResult {
  searchText: string;
  setSearchText: (text: string) => void;
  suggestions: AddressWithBanId[];
  // what to tell the user when the search gives no suggestion
  searchFeedback: AddressSearchFeedback | undefined;
}

const isQueryTooLong = (text: string) => text.trim().length > ADDRESS_SEARCH_MAX_LENGTH;

const getSearchFeedback = (
  searchText: string,
  outcome: SearchOutcome | undefined,
): AddressSearchFeedback | undefined => {
  if (isQueryTooLong(searchText)) return "query_too_long";
  if (outcome?.status === "failed") return "search_failed";
  if (outcome?.status === "found" && outcome.addresses.length === 0) return "no_result";
  return undefined;
};

export function useAddressSearch(
  gateway: AddressSearchGateway,
  addressType?: AddressType,
  initialSearchText = "",
): UseAddressSearchResult {
  const [searchText, setSearchText] = useState(initialSearchText);
  // the initial text comes from an already selected address: no need to search for it
  const hasUserTypedRef = useRef(false);
  const debouncedSearchText = useDebounce(searchText, SEARCH_DEBOUNCE_DELAY_IN_MS);
  const [cache, setCache] = useState(new Map<string, SearchOutcome>());

  const updateSearchText = useCallback((text: string) => {
    hasUserTypedRef.current = true;
    setSearchText(text);
  }, []);

  useEffect(() => {
    if (!hasUserTypedRef.current) return;
    if (debouncedSearchText.length <= MIN_SEARCH_LENGTH) return;
    if (isQueryTooLong(debouncedSearchText)) return;
    if (cache.has(debouncedSearchText)) return;

    const saveOutcome = (outcome: SearchOutcome) => {
      setCache((prev) => new Map(prev).set(debouncedSearchText, outcome));
    };
    void gateway.search(debouncedSearchText, { type: addressType }).then(
      (addresses) => {
        saveOutcome({ status: "found", addresses });
      },
      () => {
        saveOutcome({ status: "failed" });
      },
    );
  }, [debouncedSearchText, gateway, addressType, cache]);

  const outcome = cache.get(debouncedSearchText);

  return {
    searchText,
    setSearchText: updateSearchText,
    suggestions: outcome?.status === "found" ? outcome.addresses : [],
    searchFeedback: getSearchFeedback(debouncedSearchText, outcome),
  };
}
