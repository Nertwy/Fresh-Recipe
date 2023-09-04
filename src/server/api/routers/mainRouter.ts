import { type Dishes, type Ingredient, type Recipe } from "@prisma/client";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
import { Thread } from "~/types";
type FullDish = Dishes & { ingredients: Ingredient[]; recipes: Recipe };

const IngredientClientSchema = z.object({
  amount: z.number(),
  name: z.string(),
  measureUnit: z.string(),
});
const StepSchema = z.array(z.string());
// Define schema for RecipeClient
const RecipeClientSchema = z.object({
  step: StepSchema,
});

// Define schema for FullDishClient
const FullDishClientSchema = z
  .object({
    name: z.string(),
    cuisine: z.string(),
    slug: z.string(),
    url: z.string(),
    ingredients: z.array(IngredientClientSchema),
    recipes: RecipeClientSchema,
  })
  .nullish();

export const mainRouter = createTRPCRouter({
  getDish: publicProcedure.input(z.number()).query(async ({ ctx, input }) => {
    return ctx.prisma.dishes.findFirst({
      where: {
        id: input,
      },
    });
  }),
  getDish25: publicProcedure
    .input(z.number().nonnegative().finite())
    .query(async ({ ctx, input }) => {
      return ctx.prisma.dishes.findMany({
        take: 25,
        skip: input,
      });
    }),
  getBySlug: publicProcedure.input(z.string()).query(async ({ ctx, input }) => {
    const dish = await ctx.prisma.dishes.findFirst({
      where: {
        slug: input,
      },
      include: {
        ingredients: true,
        recipes: true,
      },
    });

    return dish;
  }),
  getFullDish: publicProcedure
    .input(z.number())
    .query(async ({ ctx, input }) => {
      const result = await ctx.prisma.dishes.findFirst({
        where: {
          id: input,
        },
        include: {
          ingredients: true,
          recipes: true,
        },
      });
      if (!result) throw new Error(`Dish not found for ID ${input}`);
      return result as FullDish;
    }),
  getLikesOfDish: publicProcedure
    .input(z.number().int())
    .query(async ({ ctx, input }) => {
      return ctx.prisma.dishes.findFirst({
        select: {
          DishLikes: true,
        },
        where: {
          id: input,
        },
      });
    }),
  setLikeOfDish: publicProcedure
    .input(
      z.object({
        dish_id: z.number().positive(),
        user_id: z.string().cuid(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      const result = await ctx.prisma.dishLikes.findFirst({
        where: {
          ...input,
        },
      });
      if (result) {
        await ctx.prisma.dishLikes.deleteMany({
          where: {
            dish_id: input.dish_id,
            user_id: input.user_id,
          },
        });
      } else {
        await ctx.prisma.dishLikes.create({
          data: {
            ...input,
          },
        });
      }
    }),
  getIsLiked: protectedProcedure
    .input(
      z.object({ user_id: z.string().cuid(), dish_id: z.number().positive() })
    )
    .query(async ({ ctx, input }) => {
      const result = await ctx.prisma.dishLikes.findFirst({
        where: {
          ...input,
        },
      });
      if (result) {
        return true;
      } else {
        return false;
      }
    }),
  getLikedDishes: protectedProcedure.query(async ({ ctx }) => {
    return await ctx.prisma.dishes.findMany({
      where: {
        DishLikes: {
          some: {
            user_id: ctx.session.user.id,
          },
        },
      },
    });
  }),
  postDish: protectedProcedure
    .input(FullDishClientSchema)
    .mutation(async ({ ctx, input }) => {
      if (!input) return "Parsed null value!";
      const { cuisine, ingredients, name, recipes, slug, url } = input;
      const result = await ctx.prisma.dishes.create({
        data: {
          name,
          cuisine,
          slug,
          url,
          recipes: {
            create: {
              step: recipes.step.map((item) => item),
            },
          },
          ingredients: {
            create: ingredients,
          },
          likes: 0,
        },
        include: {
          ingredients: true,
          recipes: true,
          DishLikes: true,
        },
      });
      console.log(result);

      return result;
    }),
  getSearched: publicProcedure
    .input(z.string().nonempty())
    .query(async ({ ctx, input }) => {
      return await ctx.prisma.dishes.findMany({
        where: {
          name: {
            contains: input,
            mode: "insensitive",
          },
        },
      });
    }),

  //CHANGE POST_id = 6 to a variable !!!!
  getComments: publicProcedure
    .input(z.number().positive())
    .query(async ({ ctx, input }) => {
      const post_id = input;
      const result = await ctx.prisma
        .$queryRaw<Thread[]>`WITH RECURSIVE comment_tree AS (
        SELECT c.id, c.post_id, c.body, c.parent_id, c.user_id, c.created_at, u.image
        FROM "Comments" c
        LEFT JOIN "User" u ON c.user_id = u.id
        WHERE c.post_id = ${post_id} AND c.parent_id IS NULL -- Start with top-level comments (parent_id is NULL)

        UNION ALL

        SELECT c.id, c.post_id, c.body, c.parent_id, c.user_id, c.created_at, u.image
        FROM "Comments" c
        INNER JOIN comment_tree ct ON ct.id = c.parent_id -- Join child comments to their parents
        LEFT JOIN "User" u ON c.user_id = u.id
      )
      SELECT * FROM comment_tree ORDER BY id;
      `;
      return result;
    }),
});
