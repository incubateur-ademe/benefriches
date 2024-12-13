import React from "react";

export const getCustomRadioButtonStyle = (checked: boolean): React.CSSProperties => ({
  backgroundSize: "1.875rem 1.875rem",
  backgroundImage: checked
    ? `radial-gradient(transparent 10px, var(--border-active-blue-france) 11px, transparent 12px), radial-gradient(var(--background-active-blue-france) 5px, transparent 6px)`
    : `radial-gradient(transparent 10px, var(--border-action-high-blue-france) 11px, transparent 12px)`,
  backgroundRepeat: "no-repeat",
  backgroundPosition: "center",
});

export const getCustomCheckboxStyle = (checked: boolean): React.CSSProperties => ({
  width: "1.5rem",
  height: "1.5rem",
  borderRadius: "0.25rem",
  backgroundSize:
    "0.25rem 0.25rem, calc(100% - 0.25rem) 1px, 0.25rem 0.25rem, 1px calc(100% - 0.5rem), 0.25rem 0.25rem, calc(100% - 0.5rem) 1px, 0.25rem 0.25rem, 1px calc(100% - 0.5rem), 1rem",
  backgroundPosition:
    "0 0, 0.25rem 0, 100% 0, 0 0.25rem, 100% 100%, calc(100% - 0.25rem) 100%, 0 100%, 100% 0.25rem, center",
  backgroundRepeat: "no-repeat",
  backgroundColor: checked ? "var(--background-active-blue-france)" : "initial",
  backgroundImage: checked
    ? `radial-gradient(at 5px 4px, transparent 4px, var(--border-active-blue-france) 4px, var(--border-active-blue-france) 5px, transparent 6px), linear-gradient(var(--border-active-blue-france), var(--border-active-blue-france)), radial-gradient(at calc(100% - 5px) 4px, transparent 4px, var(--border-active-blue-france) 4px, var(--border-active-blue-france) 5px, transparent 6px), linear-gradient(var(--border-active-blue-france), var(--border-active-blue-france)), radial-gradient(at calc(100% - 5px) calc(100% - 4px), transparent 4px, var(--border-active-blue-france) 4px, var(--border-active-blue-france) 5px, transparent 6px), linear-gradient(var(--border-active-blue-france), var(--border-active-blue-france)), radial-gradient(at 5px calc(100% - 4px), transparent 4px, var(--border-active-blue-france) 4px, var(--border-active-blue-france) 5px, transparent 6px), linear-gradient(var(--border-active-blue-france), var(--border-active-blue-france)), url("data:image/svg+xml;charset=utf-8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'><path fill='%23f5f5fe' d='M10 15.17l9.2-9.2 1.4 1.42L10 18l-6.36-6.36 1.4-1.42z'/></svg>")`
    : "radial-gradient(at 5px 4px, transparent 4px, var(--border-action-high-blue-france) 4px, var(--border-action-high-blue-france) 5px, transparent 6px), linear-gradient(var(--border-action-high-blue-france), var(--border-action-high-blue-france)), radial-gradient(at calc(100% - 5px) 4px, transparent 4px, var(--border-action-high-blue-france) 4px, var(--border-action-high-blue-france) 5px, transparent 6px), linear-gradient(var(--border-action-high-blue-france), var(--border-action-high-blue-france)), radial-gradient(at calc(100% - 5px) calc(100% - 4px), transparent 4px, var(--border-action-high-blue-france) 4px, var(--border-action-high-blue-france) 5px, transparent 6px), linear-gradient(var(--border-action-high-blue-france), var(--border-action-high-blue-france)), radial-gradient(at 5px calc(100% - 4px), transparent 4px, var(--border-action-high-blue-france) 4px, var(--border-action-high-blue-france) 5px, transparent 6px), linear-gradient(var(--border-action-high-blue-france), var(--border-action-high-blue-france))",
});
