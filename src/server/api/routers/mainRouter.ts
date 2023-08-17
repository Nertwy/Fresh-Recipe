import { Dishes, Ingredient, Recipe } from "@prisma/client";
import { z } from "zod";
import {
  createTRPCRouter,
  protectedProcedure,
  publicProcedure,
} from "~/server/api/trpc";
type FullDish = Dishes & { ingredients: Ingredient[]; recipes: Recipe };

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
    .input(z.object({}))
    .mutation(({ ctx, input }) => {
      return;
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
});
