import { useState, type FC, ChangeEvent } from "react";
import {
  type SearchType,
  getObjectKeyValueTypes,
  isBasicArrType,
  isBasicType,
  mergeProperties,
  useModalScrollLock,
} from "~/functions";
import {
  type User,
  type Dishes,
  type Ingredient,
  type Recipe,
} from "@prisma/client";
import { api } from "~/utils/api";
type FullDish =
  | (Dishes & { ingredients: Ingredient[]; recipes: Recipe })
  | null;
type MenuPossibleTypes = FullDish | User;
type FilterMenuProps = {
  object?: MenuPossibleTypes;
};

const FilterMenu: FC<FilterMenuProps> = ({ object }) => {
  const filterTypes = (arr: [string, string][]): [string, string][] => {
    return arr.filter((item) => {
      if (isBasicType(item[1])) return true;
      else if (isBasicArrType(item[1])) return true;
      else false;
    });
  };
  if (!object) return <></>;
  const result = getObjectKeyValueTypes(object);
  if (!result) return <></>;

  const RightMap = mergeProperties(filterTypes(result));
  console.log(RightMap);
  RightMap.set("test", ["boolean"]);
  return (
    <div className="flex flex-col items-center justify-center self-center md:w-1/2">
      {Array.from(RightMap).map((val, index) => (
        <div
          tabIndex={0}
          className="collapse-arrow collapse border border-base-300 bg-base-200"
          key={index}
        >
          <input type="checkbox" className="peer" />
          <div className="collapse-title text-xl font-medium ">
            Filter by {val[0]}
          </div>
          <div className="collapse-content">
            <p>
              {val[1].map((item, index: number) => (
                <div key={index}>
                  <ChangableInputSearch type={item as SearchType} />
                </div>
              ))}
            </p>
          </div>
        </div>
      ))}
      <button className="btn btn-wide">Search!</button>
    </div>
  );
};
type ChangableInputProps = {
  type: SearchType;
};
const ChangableInputSearch: FC<ChangableInputProps> = ({ type = "string" }) => {
  const [check, setCheck] = useState(false);
  const [input, setInput] = useState("");
  const [slider, setSlider] = useState(0);

  if (type === "number") {
    const handleSliderChange = (e: ChangeEvent<HTMLInputElement>) => {
      const value = Number(e.currentTarget.value);
      setSlider(value);
    };
    return (
      <input
        type="range"
        min={0}
        max={100}
        value={slider}
        className="range"
        onChange={(e) => handleSliderChange(e)}
      />
    );
  } else if (type === "string") {
    const handleInput = (e: ChangeEvent<HTMLInputElement>) => {
      const value = e.currentTarget.value;
      setInput(value);
    };
    return (
      <input
        value={input}
        type="text"
        placeholder="Type here"
        className="input input-bordered input-secondary w-full max-w-xs"
        onChange={(e) => handleInput(e)}
      />
    );
  } else if (type === "boolean") {
    return (
      <input
        type="checkbox"
        checked={check}
        className="checkbox checkbox-lg"
        onClick={() => setCheck(!check)}
      />
    );
  } else {
    return <>In Construction!</>;
  }
};
const Modal: FC<ModalProp> = ({ modalIsOpen, toggleModal }) => {
  const { data } = api.main.getFullDish.useQuery(9);

  return (
    <dialog
      className={`modal overflow-hidden sm:modal-top  ${
        modalIsOpen ? "modal-open backdrop-blur-md" : ""
      }`}
    >
      <form method="dialog" className="modal-box flex flex-col">
        <FilterMenu object={data} />
        <h3 className="text-lg font-bold">Hello!</h3>
        <p className="py-4">Press ESC key or click the button below to close</p>
        <div className="modal-action">
          <button className="btn" onClick={() => toggleModal(!modalIsOpen)}>
            Close
          </button>
        </div>
      </form>
    </dialog>
  );
};
const GlobalSearch = () => {
  const { modal, setModal } = useModalScrollLock(false);
  return (
    <>
      <div
        className={`input-group items-center justify-center`}
        onClick={() => setModal(!modal)}
      >
        <input
          className="input input-bordered w-24 md:w-auto"
          placeholder="Search"
        />
        <button className="btn btn-square">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
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
      <Modal toggleModal={setModal} modalIsOpen={modal} />
    </>
  );
};
type ModalProp = {
  modalIsOpen: boolean;
  toggleModal: (value: boolean) => void;
};

export default GlobalSearch;
