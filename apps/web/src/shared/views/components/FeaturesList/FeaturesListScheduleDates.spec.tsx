import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import ScheduleDates from "./FeaturesListScheduleDates";

describe("ScheduleDates", () => {
  it("shows the start and end dates in French format, whatever the browser locale", () => {
    render(<ScheduleDates startDateString="Sat Jun 01 2030" endDateString="Sun Dec 01 2030" />);

    expect(screen.getByText("01/06/2030 ➔ 01/12/2030")).toBeInTheDocument();
  });
});
