// // NOT FOR THE INTENDED USAGE ONLY FOR DEV
// import { Dishes, Ingredient, PrismaClient, Recipe } from "@prisma/client";
// import { error } from "console";
// import * as fs from "fs/promises";
// import { FullDish } from "~/types";

// const prisma = new PrismaClient();

// async function isDatabaseEmpty() {
//   const dishCount = await prisma.dishes.count();
//   return dishCount === 0;
// }
// async function seedDatabase() {
//   try {
//     // Load data from the FoodDB.json file
//     const data = await fs.readFile("FoodDB.json", "utf8");
//     const dishes = JSON.parse(data) as FullDish[];

//     for (const dish of dishes) {
//       if (!dish) throw error("No dish");
//       const createdDish = await prisma.dishes.create({
//         data: {
//           ...dish,
//           ingredients: {
//             createMany: {
//               data: dish.ingredients.map(
//                 (ingredient: Ingredient) =>
//                   ({
//                     id: undefined,
//                     amount: ingredient.amount,
//                     name: ingredient.name,
//                     measureUnit: ingredient.measureUnit,
//                   } ?? [])
//               ),
//             },
//           },
//           recipes: {
//             create: {
//               id: undefined,
//               step: dish?.recipes.step,
//             },
//           },
//         },
//         include: {
//           ingredients: true,
//           recipes: true,
//         },
//       });

//       // console.log(`Dish created: ${createdDish.name}`);

//       // console.log("Database seeding completed.");
//     }
//   } catch (error) {
//     console.error("Error seeding database:", error);
//   } finally {
//     await prisma.$disconnect();
//   }
// }
// void seedDatabase();
