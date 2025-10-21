// oxlint-disable-next-line no-unassigned-import
import "@testing-library/jest-dom/vitest";
import { vi } from "vitest";

(window as Window & typeof globalThis & { _benefriches_env: object })._benefriches_env = {};

// needed because highcharts checks css support
// see https://github.com/highcharts/highcharts/issues/22910
vi.stubGlobal("CSS", {
  supports: vi.fn().mockImplementation(() => {
    return true;
  }),
});
