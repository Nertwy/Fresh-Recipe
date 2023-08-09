import { type Dishes } from "@prisma/client";
import { useEffect, useState } from "react";
import Card from "~/Components/MainPageComponents/Card/Card";
import StickyNav from "~/Components/StickyNav";
import { api } from "~/utils/api";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import {
  type GetStaticProps,
  type InferGetStaticPropsType,
  type GetStaticPropsContext,
  type GetStaticPaths,
} from "next";

const DishPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { slug } = props;
  const { data, isFetched } = api.main.getBySlug.useQuery(slug ?? "");
  const [allFood, setallFood] = useState<Dishes | null>(data ?? null);
  //Сделать от 2х до 5 нормальные названия
  useEffect(() => {
    if (data) setallFood(data);
  }, [isFetched]);

  console.log(allFood);

  if (!allFood) return <>No data</>;
  return (
    <>
      <StickyNav />
      <div className="flex w-screen flex-col items-center bg-gray-200 ">
        <Card {...allFood} />
        <h3 className="text-xl font-semibold">Ингридиенты</h3>
        <div className="text mb-3 flex-col pb-6 font-serif sm:w-3/5 md:w-2/4 lg:w-1/3">
          {allFood?.ingredients?.map((e, i) => (
            <div className="flex justify-between" key={i}>
              <div className="float-left">
                {e.amount === 0 ? null : e.amount} {e.measureUnit}
              </div>
              <div className="float-right">{e.name}</div>
            </div>
          ))}
        </div>
        <h1 className="text-2xl font-bold">Рецепт приготовления:</h1>
        <div className="m-2  w-auto border-spacing-3 border-2 border-slate-800 p-2">
          <ol
            className="list-decimal space-y-3 pl-7 font-mono text-lg"
            type="1"
          >
            {allFood.recipes.step.map((elem, index) => (
              <li key={index} className="list-decimal">
                {elem}
              </li>
            ))}
          </ol>
        </div>
      </div>
      {/* <Post postId={allFood.id!} /> */}
    </>
  );
};

export const getStaticPaths: GetStaticPaths = async () => {
  const slugs = await prisma.dishes.findMany({
    select: {
      slug: true,
    },
  });
  return {
    paths: slugs.map((slug) => ({
      params: {
        slug: slug.slug,
      },
    })),
    fallback: "blocking",
  };
};

export const getStaticProps = async (
  context: GetStaticPropsContext<{ slug: string }>
) => {
  const slug = context.params?.slug;
  const helpers = createServerSideHelpers({
    ctx: {
      session: null,
      prisma: prisma,
    },
    router: appRouter,
  });
  await helpers.main.getBySlug.prefetch(slug ?? "");

  return {
    props: {
      trpcState: helpers.dehydrate(),
      slug,
    },
    revalidate: 1,
  };
};
export default DishPage;
