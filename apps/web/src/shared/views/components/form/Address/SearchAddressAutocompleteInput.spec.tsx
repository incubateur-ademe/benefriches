import { fireEvent, render, screen } from "@testing-library/react";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";

import type { AddressWithBanId } from "@/shared/core/gateways/AddressSearchGateway";

import SearchAddressAutocompleteInput from "./SearchAddressAutocompleteInput";

// Mock Autocomplete to avoid HeadlessUI Combobox jsdom incompatibilities
// (ComboboxInput event handlers are disconnected from native input through DSFR Input wrapper).
// This tests SearchAddressAutocompleteInput's logic without HeadlessUI internals.
vi.mock("../../Autocomplete/Autocomplete", () => ({
  default: ({
    options,
    onSelect,
    children,
  }: {
    options: { label: string; value: string }[];
    onSelect: (value: string) => void;
    children: ReactNode;
  }) => (
    <div>
      {children}
      <ul role="listbox">
        {options.map((opt) => (
          <li
            key={opt.value}
            role="option"
            onClick={() => {
              onSelect(opt.value);
            }}
          >
            {opt.label}
          </li>
        ))}
      </ul>
    </div>
  ),
}));

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

    const option = screen.getByRole("option", { name: /1 rue de la Paix/ });
    fireEvent.click(option);

    expect(onSearchTextChange).toHaveBeenCalledWith(address.value);
    expect(onSelectedAddressChange).toHaveBeenCalledWith(address);
  });

  it("formats municipality address labels with postCode", () => {
    const address = createAddress({
      banId: "ban-mun",
      value: "Montrouge",
      postCode: "92120",
    });

    render(
      <SearchAddressAutocompleteInput
        {...defaultProps()}
        suggestions={[address]}
        addressType="municipality"
      />,
    );

    const option = screen.getByRole("option", { name: "Montrouge (92120)" });
    expect(option).toBeInTheDocument();
  });

  it("displays suggestions with correct labels", () => {
    const addresses = [
      createAddress({ banId: "ban-1", value: "1 rue de la Paix, Paris" }),
      createAddress({ banId: "ban-2", value: "2 avenue des Champs, Paris" }),
    ];

    render(<SearchAddressAutocompleteInput {...defaultProps()} suggestions={addresses} />);

    expect(screen.getByRole("option", { name: "1 rue de la Paix, Paris" })).toBeInTheDocument();
    expect(screen.getByRole("option", { name: "2 avenue des Champs, Paris" })).toBeInTheDocument();
  });
});
