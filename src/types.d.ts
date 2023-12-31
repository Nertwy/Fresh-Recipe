import {
  type Posts,
  type Comments,
  type Dishes,
  type Ingredient,
  type Recipe,
} from "@prisma/client";
type FullDish =
  | (Dishes & { ingredients: Ingredient[]; recipes: Recipe; post: Posts })
  | null;

type LooseAutoComplete<T extends string> = T | Omit<string, T>;

type Measurements = [
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
  "drop"
];

// eslint-disable-next-line @typescript-eslint/ban-types
type Measurement = Measurements[number] | (string & {});
type IngredientClient = Omit<Ingredient, "dishId" | "id">;
type RecipeClient = Omit<Recipe, "id" | "dishId">;
type FullDishClient =
  | (Omit<Dishes, "id"> & {
      ingredients: IngredientClient[];
      recipes: RecipeClient;
    })
  | null;
type Thread = (Comments & { image: string }) | null;
type ThreadTreeData = {
  comment: Thread;
  children: ThreadTreeData[];
};
type ClientThread = Omit<Comments, "id">;
type Theme = "light" | "dark";
