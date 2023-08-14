import { type Dishes } from "@prisma/client";
import {
  useState,
  type FC,
  useEffect,
} from "react";
import { debounce, handleChange } from "~/functions";

type FilterBar = {
  data?: Dishes[];
  setData?: (value: Dishes[]) => void;
};
const FilterBar: FC<FilterBar> = ({ data, setData }) => {
  const [value, setValue] = useState("");
  const performSearch = () => {
    const result = data?.filter((item) =>
      item.name.toLowerCase().includes(value.toLowerCase())
    );

    setData?.(result ?? []);
  };
  const debounceSearch = debounce(performSearch, 500);
  useEffect(() => {
    if (value === "") {
      setData?.(data ?? []);
    } else {
      debounceSearch();
    }
  }, [value]);
  return (
      <div className="input-group items-center justify-center pt-4">
        <input
          onChange={(e) => {
            handleChange(e, setValue);
          }}
          value={value}
          type="text"
          placeholder="Search..."
          className="input input-bordered input-success w-full max-w-xs"
        />
        <button className="btn btn-square">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 "
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
        </button>
      </div>
  );
};
export default FilterBar;
