import { useState } from "react";
import CuisineSearch from "~/Components/AutoCompleteCuisine";
import DynamicInput from "~/Components/DynamicInput";
import { type FullDishClient, type RecipeClient, type IngredientClient } from "~/types";

const AddDish = () => {
  const [dish, setDish] = useState<Partial<FullDishClient>>(null);

  const handleIngAndRecipe = (
    data: RecipeClient | IngredientClient[],
    ingredients: boolean
  ) => {
    // console.log(dish);
    if (ingredients) {
      setDish({ ...dish, ingredients: data as IngredientClient[] });
    } else {
      setDish({ ...dish, recipes: data as RecipeClient });
    }
  };
  return (
    <div className="form-control items-center">
      <input
        name="name"
        type="text"
        placeholder="Dish name"
        className="input input-bordered input-secondary w-full max-w-xs"
        onChange={(e) => void setDish({ ...dish, name: e.currentTarget.value })}
      />
      <input
        onChange={(e) =>
          void setDish({ ...dish, cuisine: e.currentTarget.value })
        }
        name="cuisine"
        type="text"
        placeholder="Cuisine"
        className="input input-bordered input-secondary w-full max-w-xs"
      />
      <input type="file" className="file-input w-full max-w-xs" />
      <DynamicInput
        label="Ingredients"
        ingredients={true}
        handleData={handleIngAndRecipe}
      />
      <DynamicInput
        label="Recipe"
        ingredients={false}
        handleData={handleIngAndRecipe}
      />
      <CuisineSearch />
    </div>
  );
};

export default AddDish;
