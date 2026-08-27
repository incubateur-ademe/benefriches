import { useCallback, useEffect, useRef, useState } from "react";

import type {
  AddressSearchGateway,
  AddressType,
  AddressWithBanId,
} from "@/shared/core/gateways/AddressSearchGateway";

import { useDebounce } from "./useDebounce";

const SEARCH_DEBOUNCE_DELAY_IN_MS = 300;
const MIN_SEARCH_LENGTH = 3;

interface UseAddressSearchResult {
  searchText: string;
  setSearchText: (text: string) => void;
  suggestions: AddressWithBanId[];
}

export function useAddressSearch(
  gateway: AddressSearchGateway,
  addressType?: AddressType,
  initialSearchText = "",
): UseAddressSearchResult {
  const [searchText, setSearchText] = useState(initialSearchText);
  // the initial text comes from an already selected address: no need to search for it
  const hasUserTypedRef = useRef(false);
  const debouncedSearchText = useDebounce(searchText, SEARCH_DEBOUNCE_DELAY_IN_MS);
  const [cache, setCache] = useState(new Map<string, AddressWithBanId[]>());

  const updateSearchText = useCallback((text: string) => {
    hasUserTypedRef.current = true;
    setSearchText(text);
  }, []);

  useEffect(() => {
    if (!hasUserTypedRef.current) return;
    if (debouncedSearchText.length <= MIN_SEARCH_LENGTH) return;
    if (cache.has(debouncedSearchText)) return;

    void gateway.search(debouncedSearchText, { type: addressType }).then((results) => {
      setCache((prev) => new Map(prev).set(debouncedSearchText, results));
    });
  }, [debouncedSearchText, gateway, addressType, cache]);

  return {
    searchText,
    setSearchText: updateSearchText,
    suggestions: cache.get(debouncedSearchText) ?? [],
  };
}
