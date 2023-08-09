//NOT FOR THE INTENDED USAGE ONLY FOR DEV 
import { Dishes, Ingredient, PrismaClient, Recipe } from "@prisma/client";
import * as fs from "fs/promises";

const prisma = new PrismaClient();

async function seedDatabase() {
  try {
    // Load data from the FoodDB.json file
    const data = await fs.readFile("FoodDB.json", "utf8");
    const dishes = JSON.parse(data) as Dishes[];

    for (const dish of dishes) {
      const { name, cuisine, slug, url, ingredients, recipes, likes } = dish;

      console.log(recipes);
      const createdDish = await prisma.dishes.create({
        data: {
          name,
          cuisine,
          slug,
          url,
          likes,
          ingredients: {
            createMany: {
              data: ingredients.map((ingredient: Ingredient) => ({
                id: undefined,
                amount: ingredient.amount,
                name: ingredient.name,
                measureUnit: ingredient.measureUnit,
              })),
            },
          },
          recipes: {
            create: {
              id: undefined,
              step: recipes.step,
            },
          },
        },
        include: {
          ingredients: true,
          recipes: true,
        },
      });

      // console.log(`Dish created: ${createdDish.name}`);

      // console.log("Database seeding completed.");
    }
  } catch (error) {
    console.error("Error seeding database:", error);
  } finally {
    await prisma.$disconnect();
  }
}
//void seedDatabase();
