import {useEffect, useState} from "react";

export const useDebounceValue = <T>(value: T, delay: number) => {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    let timeoutId: number = setTimeout(() => {
      setDebouncedValue(value);
    }, delay) as any;

    return () => {
      clearTimeout(timeoutId);
    };
  }, [value, delay]);

  return debouncedValue;
}