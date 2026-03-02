import Input from "@codegouvfr/react-dsfr/Input";
import { type ChangeEvent, useState } from "react";

import { monthYearDisplayToDateString, dateStringToMonthYearDisplay } from "./monthYearConversion";

type Props = {
  label: string;
  className?: string;
  /** DateString in "YYYY-MM-DD" format (e.g. "2027-01-01") or "" */
  value: string;
  /** Called with DateString "YYYY-MM-DD" when input is complete, or "" when cleared/incomplete */
  onChange: (dateString: string) => void;
  onBlur?: () => void;
  name?: string;
  state?: "default" | "error" | "success";
  stateRelatedMessage?: string;
};

function formatMonthYearInput(rawValue: string, previousValue: string): string {
  const digits = rawValue.replace(/\D/g, "");

  if (digits.length === 0) return "";

  // First digit of month: 0 or 1 are valid starters, 2-9 auto-prepend "0"
  const firstDigit = digits[0]!;
  if (digits.length === 1) {
    if (firstDigit >= "2" && firstDigit <= "9") {
      return `0${firstDigit}/`;
    }
    return firstDigit;
  }

  // Two digits for month
  const month = digits.slice(0, 2);
  const monthAsNumber = parseInt(month, 10);
  if (monthAsNumber < 1 || monthAsNumber > 12) {
    // Invalid month - keep only first digit
    return previousValue.length < rawValue.length ? digits[0]! : "";
  }

  if (digits.length === 2) {
    return `${month}/`;
  }

  // Year digits (up to 4)
  const year = digits.slice(2, 6);
  return `${month}/${year}`;
}

function MonthYearInput({
  label,
  className,
  value,
  onChange,
  onBlur,
  name,
  state,
  stateRelatedMessage,
}: Props) {
  const [prevValue, setPrevValue] = useState(value);
  const [displayValue, setDisplayValue] = useState(() => dateStringToMonthYearDisplay(value));

  // Sync internal display state when external storage value changes (e.g. form reset)
  if (value !== prevValue) {
    setPrevValue(value);
    const externalDisplay = dateStringToMonthYearDisplay(value);
    if (externalDisplay !== displayValue) {
      setDisplayValue(externalDisplay);
    } else if (!value && monthYearDisplayToDateString(displayValue)) {
      setDisplayValue("");
    }
  }

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value;

    // Handle backspace over the "/" separator
    // From "01/2" → backspace → "01/" or from "01/" → backspace → "01"
    if (displayValue.length > rawValue.length) {
      if (rawValue.length === 3 && rawValue[2] === "/") {
        const newDisplay = rawValue.slice(0, 2);
        setDisplayValue(newDisplay);
        onChange("");
        return;
      }
      if (rawValue.length === 2 && displayValue === `${rawValue}/`) {
        setDisplayValue(rawValue);
        onChange("");
        return;
      }
    }

    const formatted = formatMonthYearInput(rawValue, displayValue);
    setDisplayValue(formatted);
    onChange(monthYearDisplayToDateString(formatted) ?? "");
  };

  return (
    <Input
      label={label}
      className={className}
      state={state}
      stateRelatedMessage={stateRelatedMessage}
      nativeInputProps={{
        type: "text",
        inputMode: "numeric",
        placeholder: "MM/AAAA",
        maxLength: 7,
        value: displayValue,
        name,
        onChange: handleChange,
        onBlur,
      }}
    />
  );
}

export default MonthYearInput;
