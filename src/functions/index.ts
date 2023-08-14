import {
  type SetStateAction,
  type ChangeEvent,
  useEffect,
  useState,
} from "react";
type DebounceFunction = <T extends unknown[]>(
  func: (...args: T) => void,
  delay: number
) => (...args: T) => void;
export const handleChange = (
  e: ChangeEvent<HTMLInputElement>,
  setValue: React.Dispatch<SetStateAction<string>>
) => {
  const text = e.currentTarget.value;
  setValue(text);
};

export const debounce: DebounceFunction = (func, delay) => {
  let timeoutId: ReturnType<typeof setTimeout>;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
};

export const getObjectKeyValueTypes = (obj: object): [string, string][] => {
  const keyValueTypes: [string, string][] = [];

  const traverseObject = (nestedObj: Record<string, unknown>, prefix = "") => {
    for (const key in nestedObj) {
      const value = nestedObj[key];
      const fullKey = prefix ? `${prefix}.${key}` : key;

      if (Array.isArray(value) && value.length > 0) {
        // Handle array's first element
        const firstElement = value[0] as object;
        const valueType =
          typeof firstElement === "object" && firstElement !== null
            ? "{ " +
              getObjectKeyValueTypes(firstElement)
                .map(([k, v]) => `${k}: ${v}`)
                .join(", ") +
              " }[]"
            : typeof firstElement + "[]";

        keyValueTypes.push([fullKey, valueType]);

        if (typeof firstElement === "object" && firstElement !== null) {
          traverseObject(firstElement as Record<string, unknown>, fullKey);
        }
      } else if (typeof value === "object" && value !== null) {
        // Handle nested objects
        const valueType =
          "{ " +
          getObjectKeyValueTypes(value)
            .map(([k, v]) => `${k}: ${v}`)
            .join(", ") +
          " }";
        keyValueTypes.push([fullKey, valueType]);

        traverseObject(value as Record<string, unknown>, fullKey);
      } else {
        // Handle other types
        const valueType = typeof value;
        keyValueTypes.push([fullKey, valueType]);
      }
    }
  };

  traverseObject(obj as Record<string, unknown>);
  return keyValueTypes;
};

type BasicType = number | string | boolean | null;

export const isBasicType = (value: string): boolean =>
  value === "number" || value === "string" || value === "boolean";
export const isBasicArrType = (value: string): boolean =>
  value === "number[]" || value === "string[]" || value === "boolean[]";
// export const isArrayBasicType = (arr: unknown[]): boolean => {
//   arr.every((item) => isBasicType(typeof item));
// };

const searchType = [
  "number",
  "string",
  "boolean",
  "number[]",
  "string[]",
  "boolean[]",
] as const;
export type SearchType = (typeof searchType)[number];

type Property = [string, string];

export const mergeProperties = (content: Property[]): Map<string, string[]> => {
  const map = new Map<string, string[]>();
  content.forEach(([key, val]) => {
    const Splitted = key.split(".");
    const realKey = Splitted[Splitted.length - 2] ?? key;
    map.has(realKey) ? map.get(realKey)?.push(val) : map.set(realKey, [val]);
  });

  return map;
};

export const CheckIfItemsSameType = <const T>(
  arr: T[]
): [boolean, BasicType] => {
  if (arr.length === 0) return [true, null];
  const checkItem = typeof arr[0];
  return [arr.every((item) => typeof item === checkItem), typeof checkItem];
};

export const useDebounce = <T>(value: T, delay?: number): T => {
  const [debouncedValue, setDebouncedValue] = useState<T>(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay ?? 500);

    return () => {
      clearTimeout(timer);
    };
  }, [value, delay]);

  return debouncedValue;
};

export const useScrollLock = () => {
  const [scroll, setScroll] = useState(false);
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;

    if (scroll) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = originalOverflow;
    }
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [scroll]);
  return setScroll;
};

export const useModalScrollLock = (init: boolean) => {
  const [modal, setModal] = useState(init);
  const scrollLock = useScrollLock();

  useEffect(() => {
    scrollLock(modal);
  }, [modal]);
  return { modal, setModal };
};

export const objectKeys = <Obj extends object | null>(
  obj: Obj
): (keyof Obj)[] => {
  return Object.keys(obj ?? {}) as (keyof Obj)[];
};

export type Keys<T> = keyof T;
export type ValuesOf<T> = T[keyof T];
