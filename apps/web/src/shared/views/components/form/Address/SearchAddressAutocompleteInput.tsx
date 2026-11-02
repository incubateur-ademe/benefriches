import type { InputProps } from "@codegouvfr/react-dsfr/Input";
import type { ChangeEvent } from "react";
import type { Address } from "shared";

import {
  ADDRESS_SEARCH_MAX_LENGTH,
  type AddressWithBanId,
} from "@/shared/core/gateways/AddressSearchGateway";
import type { AddressSearchFeedback } from "@/shared/views/hooks/useAddressSearch";

import Autocomplete from "../../Autocomplete/Autocomplete";

export type SearchAddressAutocompleteInputProps = {
  searchInputProps: InputProps.RegularInput;
  selectedAddress?: Address;
  onSelectedAddressChange: (v: Address | undefined) => void;
  searchText: string;
  onSearchTextChange: (text: string) => void;
  suggestions: AddressWithBanId[];
  searchFeedback?: AddressSearchFeedback;
};

const SEARCH_FEEDBACK: Record<AddressSearchFeedback, { state: "info" | "error"; message: string }> =
  {
    no_result: {
      state: "info",
      message:
        "Aucune adresse trouvée. Vérifiez l'orthographe, ou saisissez seulement la commune ou le code postal.",
    },
    search_failed: {
      state: "error",
      message:
        "La recherche d'adresse n'a pas abouti. Modifiez votre saisie ou réessayez dans quelques instants.",
    },
    query_too_long: {
      state: "error",
      message: `L'adresse saisie est trop longue : ${ADDRESS_SEARCH_MAX_LENGTH} caractères maximum.`,
    },
  };

// The form's own validation error wins over the search outcome, which only matters while no
// address is selected.
const getInputState = (
  searchInputProps: InputProps.RegularInput,
  searchFeedback: AddressSearchFeedback | undefined,
  hasSelectedAddress: boolean,
): Pick<InputProps.RegularInput, "state" | "stateRelatedMessage"> => {
  if (searchInputProps.state === "error" || !searchFeedback || hasSelectedAddress) {
    return {
      state: searchInputProps.state,
      stateRelatedMessage: searchInputProps.stateRelatedMessage,
    };
  }
  const { state, message } = SEARCH_FEEDBACK[searchFeedback];
  return { state, stateRelatedMessage: message };
};

const SearchAddressAutocompleteInput = ({
  searchInputProps,
  onSelectedAddressChange,
  selectedAddress,
  searchText,
  onSearchTextChange,
  suggestions,
  searchFeedback,
}: SearchAddressAutocompleteInputProps) => {
  const autocompleteValue = selectedAddress?.banId;

  const handleSelect = (banId: string) => {
    const address = suggestions.find((s) => s.banId === banId);
    if (address) {
      onSearchTextChange(address.value);
      onSelectedAddressChange(address);
    }
  };

  const options = suggestions.map((address) => ({
    label: address.value,
    value: address.banId,
  }));

  return (
    <Autocomplete
      className="mb-4 pb-4"
      value={autocompleteValue}
      options={options}
      onSelect={handleSelect}
      inputProps={{
        ...searchInputProps,
        ...getInputState(searchInputProps, searchFeedback, selectedAddress !== undefined),
        nativeInputProps: {
          ...searchInputProps.nativeInputProps,
          value: searchText,
          type: "search",
          onChange: (e: ChangeEvent<HTMLInputElement>) => {
            onSearchTextChange(e.target.value);
            onSelectedAddressChange(undefined);
          },
        },
      }}
    />
  );
};

export default SearchAddressAutocompleteInput;
