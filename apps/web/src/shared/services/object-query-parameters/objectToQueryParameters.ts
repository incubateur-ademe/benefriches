type StringableValue = string | number | boolean;

type QueryParamsObject = {
  [key: string]: StringableValue | StringableValue[] | { [key: string]: StringableValue }[];
};

export const objectToQueryParams = (obj: QueryParamsObject) => {
  const params = new URLSearchParams();

  for (const [key, value] of Object.entries(obj)) {
    if (Array.isArray(value)) {
      value.forEach((item, index) => {
        if (typeof item === "object") {
          for (const [nestedKey, nestedValue] of Object.entries(item)) {
            params.append(`${key}[${index}][${nestedKey}]`, String(nestedValue));
          }
        } else {
          params.append(`${key}[${index}]`, String(item));
        }
      });
    } else {
      params.append(key, String(value));
    }
  }

  return params.toString();
};
