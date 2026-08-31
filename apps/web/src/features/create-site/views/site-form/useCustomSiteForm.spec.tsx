import { render } from "@testing-library/react";

import { useCustomSiteForm } from "./useCustomSiteForm";

function ComponentUsingCustomSiteForm() {
  useCustomSiteForm();
  return null;
}

describe("useCustomSiteForm", () => {
  it("throws when used outside its provider", () => {
    // Arrange: a component calling the hook, rendered with no CustomSiteFormProvider ancestor.
    // Act + Assert
    expect(() => render(<ComponentUsingCustomSiteForm />)).toThrow(
      "useCustomSiteForm must be used within CustomSiteFormProvider",
    );
  });
});
