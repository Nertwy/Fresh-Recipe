import { type FC, useState, useEffect } from "react";
import {
  type RecipeClient,
  type IngredientClient,
  type Measurement,
} from "~/types";

const measurements = [
  "tsp",
  "tbsp",
  "fl oz",
  "c",
  "pt",
  "qt",
  "gal",
  "ml",
  "L",
  "oz",
  "lb",
  "g",
  "kg",
  "ea",
  "pc",
  "slice",
  "whole",
  "portion",
  "in",
  "cm",
  "pinch",
  "dash",
  "smidgen",
  "drop",
] as const;

type DynamicInputProps = {
  label: string;
  handleData?: (
    data: IngredientClient[] | RecipeClient,
    ingredients: boolean
  ) => void;
  ingredients: boolean;
};
const DynamicInput: FC<DynamicInputProps> = ({
  label,
  handleData,
  ingredients,
}) => {
  const initialValue: string[] | IngredientClient[] = ingredients
    ? [
        {
          amount: 0,
          measureUnit: "",
          name: "",
        },
      ]
    : [""];
  const [data, setData] = useState<IngredientClient[] | string[]>(initialValue);
  const handleInputChange = (index: number, value: string) => {
    if (!GuardCheck(data)) {
      const newInputs = [...data];
      newInputs[index] = value;
      if (value && index === newInputs.length - 1) {
        // add new input if current input is filled and is the last input
        newInputs.push("");
        // data.push();
      } else if (
        !value &&
        newInputs.length > 1 &&
        index === newInputs.length - 2
      ) {
        // remove current input if it's empty and is the second to last input
        newInputs.splice(index, 1);
      }
      setData(newInputs);
    } else {
      const newInputs = [...data];
      newInputs[index] = {
        amount: 0,
        measureUnit: "",
        name: value,
      };
      if (value && index === newInputs.length - 1) {
        // add new input if current input is filled and is the last input
        newInputs.push({ amount: 0, measureUnit: "", name: "" });
      } else if (
        !value &&
        newInputs.length > 1 &&
        index === newInputs.length - 2
      ) {
        // remove current input if it's empty and is the second to last input
        newInputs.splice(index, 1);
      }
      setData(newInputs);
    }
  };

  const GuardCheck = (
    arr: IngredientClient[] | string[]
  ): arr is IngredientClient[] => {
    if (Array.isArray(arr)) {
      for (const item of arr) {
        if (typeof item !== "object") {
          return false;
        }
      }
      return true;
    }
    return false;
  };
  const handlePropertyChange = (
    index: number,
    propertyName: keyof IngredientClient, // assuming IngredientClient is the type
    value: number | Measurement
  ) => {
    if (!GuardCheck(data)) return;

    const newState = data.map((item, i) => {
      if (i === index) {
        return {
          ...item,
          [propertyName]: value,
        };
      } else {
        return { ...item };
      }
    });

    setData(newState);
    // return newState;
  };
  const itemGuardCheck = (
    item: string | IngredientClient
  ): item is IngredientClient => {
    return typeof item === "object";
  };
  useEffect(() => {
    if (!handleData) return;
    if (GuardCheck(data)) handleData?.(data, ingredients);
    else handleData?.({ step: data }, ingredients);
  }, [data]);

  return (
    <div className="flex flex-col">
      {data.map((value, index) => {
        return (
          <div className="join" key={index}>
            <button className="btn join-item">Step {index + 1}. </button>
            <input
              id={index.toString()}
              placeholder={`${label} №...${index + 1}`}
              className="input join-item input-bordered input-secondary w-full max-w-xs"
              key={index}
              type="text"
              // value={GuardCheck(data) ? value.amount : value}
              onChange={(e) => handleInputChange(index, e.target.value)}
            />
            {ingredients ? (
              <>
                <input
                  className="input join-item select-bordered"
                  type="number"
                  min={0}
                  max={5000}
                  inputMode="numeric"
                  pattern="\d*"
                  placeholder="amount"
                  value={GuardCheck(data) ? data[index]?.amount : undefined}
                  onChange={(e) =>
                    handlePropertyChange(
                      index,
                      "amount",
                      parseInt(e.currentTarget.value)
                    )
                  }
                />
                <select
                  className="select join-item select-bordered"
                  onChange={(e) =>
                    handlePropertyChange(
                      index,
                      "measureUnit",
                      e.currentTarget.value
                    )
                  }
                >
                  <option disabled selected>
                    Measure Units
                  </option>
                  {measurements.map((measure, index) => (
                    <option key={index}>{measure}</option>
                  ))}
                </select>
              </>
            ) : null}
          </div>
        );
      })}
    </div>
  );
};

export default DynamicInput;
