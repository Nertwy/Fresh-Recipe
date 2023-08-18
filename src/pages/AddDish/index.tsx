import { FormEvent, useEffect, useState } from "react";
import CuisineSearch from "~/Components/AutoCompleteCuisine";
import DynamicInput from "~/Components/DynamicInput";
import "@uploadthing/react/styles.css";
import {
  type FullDishClient,
  type RecipeClient,
  type IngredientClient,
} from "~/types";
import { UploadButton } from "~/utils/uploadthing";
import { api } from "~/utils/api";

const AddDish = () => {
  const [dish, setDish] = useState<Partial<FullDishClient>>(null);
  const postHook = api.main.postDish.useMutation();
  const setCuisine = (name: string) => {
    setDish({ ...dish, cuisine: name });
  };
  const handleIngAndRecipe = (
    data: RecipeClient | IngredientClient[],
    ingredients: boolean
  ) => {
    if (ingredients) {
      setDish({ ...dish, ingredients: data as IngredientClient[] });
    } else {
      setDish({ ...dish, recipes: data as RecipeClient });
    }
  };
  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const payload: FullDishClient = {
      name: dish?.name ?? "",
      url: dish?.url ?? "",
      cuisine: dish?.cuisine ?? "",
      likes: 0,
      recipes: dish?.recipes ?? { step: [] },
      ingredients: dish?.ingredients ?? [
        { amount: 0, measureUnit: "", name: "" },
      ],
      slug: dish?.slug ?? "",
    };
    payload.recipes.step.pop();
    payload.ingredients.pop();
    console.log(payload);

    postHook.mutate(payload);
  };
  useEffect(() => {
    console.log(dish);
  }, [dish]);
  return (
    <form
      className="form-control items-center"
      onSubmit={(e) => handleSubmit(e)}
    >
      <input
        name="name"
        type="text"
        placeholder="Dish name"
        className="input input-bordered input-secondary w-full max-w-xs"
        onChange={(e) => void setDish({ ...dish, name: e.currentTarget.value })}
      />
      <CuisineSearch setCuisine={setCuisine} />
      <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          res?.forEach((upload) => setDish({ ...dish, url: upload.url }));
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />
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
      <button className="btn btn-primary btn-lg" type="submit">
        Create Recipe!
      </button>
    </form>
  );
};

export default AddDish;
