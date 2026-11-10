import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import type { AddressWithBanId } from "@/shared/core/gateways/AddressSearchGateway";

import SearchAddressAutocompleteInput from "./SearchAddressAutocompleteInput";

const SEARCH_INPUT_LABEL = "Adresse";

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

const defaultProps = () => ({
  searchInputProps: {
    label: SEARCH_INPUT_LABEL,
    nativeInputProps: {},
  } as const,
  onSelectedAddressChange: vi.fn(),
  onSearchTextChange: vi.fn(),
  searchText: "",
  suggestions: [],
});

const getSearchInput = () => screen.getByLabelText(SEARCH_INPUT_LABEL);

// The options list only renders once the combobox is open; querying by role="option" beforehand
// finds nothing even when suggestions were passed in. Arrow-down is a realistic way a user (or a
// screen reader) opens it without typing.
const openDropdown = () => {
  fireEvent.keyDown(getSearchInput(), { key: "ArrowDown" });
};

describe("SearchAddressAutocompleteInput", () => {
  it("renders input with search text passed as prop", () => {
    render(<SearchAddressAutocompleteInput {...defaultProps()} searchText="test query" />);

    expect(getSearchInput()).toHaveValue("test query");
  });

  it("clears selected address when user types", () => {
    const onSelectedAddressChange = vi.fn();
    const onSearchTextChange = vi.fn();
    render(
      <SearchAddressAutocompleteInput
        {...defaultProps()}
        onSelectedAddressChange={onSelectedAddressChange}
        onSearchTextChange={onSearchTextChange}
      />,
    );

    fireEvent.change(getSearchInput(), { target: { value: "paris" } });

    expect(onSearchTextChange).toHaveBeenCalledWith("paris");
    expect(onSelectedAddressChange).toHaveBeenCalledWith(undefined);
  });

  it("calls onSelectedAddressChange with full address when a suggestion is selected", () => {
    const address = createAddress({ banId: "ban-123" });
    const onSelectedAddressChange = vi.fn();
    const onSearchTextChange = vi.fn();

    render(
      <SearchAddressAutocompleteInput
        {...defaultProps()}
        onSelectedAddressChange={onSelectedAddressChange}
        onSearchTextChange={onSearchTextChange}
        suggestions={[address]}
      />,
    );

    openDropdown();
    const option = screen.getByRole("option", { name: /1 rue de la Paix/ });
    // HeadlessUI selects an option on mousedown (so the selection commits before the input's
    // blur closes the dropdown), not on click.
    fireEvent.mouseDown(option, { button: 0 });

    expect(onSearchTextChange).toHaveBeenCalledWith(address.value);
    expect(onSelectedAddressChange).toHaveBeenCalledWith(address);
  });

  it("displays suggestions with correct labels", () => {
    const addresses = [
      createAddress({ banId: "ban-1", value: "1 rue de la Paix, Paris" }),
      createAddress({ banId: "ban-2", value: "2 avenue des Champs, Paris" }),
    ];

    render(<SearchAddressAutocompleteInput {...defaultProps()} suggestions={addresses} />);

    openDropdown();
    expect(screen.getByRole("option", { name: "1 rue de la Paix, Paris" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "2 avenue des Champs, Paris" })).toBeInTheDocument();
  });
  const feedbackCases = [
    {
      searchFeedback: "no_result",
      message:
        "Aucune adresse trouvée. Vérifiez l'orthographe, ou saisissez seulement la commune ou le code postal.",
    },
    {
      searchFeedback: "search_failed",
      message:
        "La recherche d'adresse n'a pas abouti. Modifiez votre saisie ou réessayez dans quelques instants.",
    },
    {
      searchFeedback: "query_too_long",
      message: "L'adresse saisie est trop longue : 200 caractères maximum.",
    },
  ] as const;

  for (const { searchFeedback, message } of feedbackCases) {
    it(`tells the user about the search outcome "${searchFeedback}"`, () => {
      render(
        <SearchAddressAutocompleteInput
          {...defaultProps()}
          searchText="some text"
          searchFeedback={searchFeedback}
        />,
      );

      expect(screen.getByText(message)).toBeInTheDocument();
    });
  }

  it("shows the form validation error rather than the search outcome", () => {
    render(
      <SearchAddressAutocompleteInput
        {...defaultProps()}
        searchInputProps={{
          label: SEARCH_INPUT_LABEL,
          nativeInputProps: {},
          state: "error",
          stateRelatedMessage: "L'adresse est nécessaire pour les étapes suivantes",
        }}
        searchFeedback="no_result"
      />,
    );

    expect(
      screen.getByText("L'adresse est nécessaire pour les étapes suivantes"),
    ).toBeInTheDocument();
    expect(screen.queryByText(/Aucune adresse trouvée/)).not.toBeInTheDocument();
  });
  it("gives no search feedback once an address is selected", () => {
    const address = createAddress({ banId: "ban-123", value: "Saint-Denis (93200)" });

    render(
      <SearchAddressAutocompleteInput
        {...defaultProps()}
        searchText="Saint-Denis (93200)"
        selectedAddress={address}
        searchFeedback="no_result"
      />,
    );

    expect(screen.queryByText(/Aucune adresse trouvée/)).not.toBeInTheDocument();
  });
});
