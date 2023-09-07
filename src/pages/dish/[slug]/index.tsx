import { useEffect, useState } from "react";
import Card from "~/Components/MainPageComponents/Card/Card";
import { api } from "~/utils/api";
import { createServerSideHelpers } from "@trpc/react-query/server";
import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";
import {
  type InferGetStaticPropsType,
  type GetStaticPropsContext,
  type GetStaticPaths,
} from "next";
import NavBar from "~/Components/NavBar";
import CommentsSection from "~/Components/Comments";
import { FullDish, type Thread } from "~/types";
const DishPage = (props: InferGetStaticPropsType<typeof getStaticProps>) => {
  const { slug } = props;
  const { data, isFetched } = api.main.getBySlug.useQuery(slug ?? "");
  const [allFood, setallFood] = useState(data);
  //Сделать от 2х до 5 нормальные названия
  useEffect(() => {
    if (data) setallFood(data);
  }, [isFetched]);

  const {
    data: comments,
    isLoading,
    refetch,
  } = api.main.getComments.useQuery(data?.id ?? -1);
  useEffect(() => {
    // console.log(comments);
  }, [isLoading]);
  if (!allFood) return <>No data</>;

  return (
    <>
      <NavBar />
      <div className="flex w-screen flex-col items-center bg-base-300 ">
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
        <div className="m-2  w-auto border-spacing-3 rounded-lg border-2 border-slate-800 p-2">
          <ol
            className="list-decimal space-y-3 pl-7 font-mono text-lg"
            type="1"
          >
            {allFood.recipes?.step.map((elem, index) => (
              <li key={index} className="list-decimal">
                {elem}
              </li>
            ))}
          </ol>
        </div>
      </div>
      <div className="container mx-auto p-4">
        {/* {isLoading ? (
          <span className="loading loading-spinner loading-lg"></span>
        ) : ( */}
        <CommentsSection
          comments={comments ?? []}
          post_id={allFood.post.id}
          refetch={() => void refetch()}
        />
        {/* )} */}
      </div>
    </>
  );
};
// const comments2: Thread[] = [
//   {
//     id: 10,
//     post_id: 6,
//     body: "zxc",
//     created_at: new Date("2023-09-03 21:03:24.989254"),
//     user_id: "cll2wgdjz0000uz2c9kxea20o",
//     image:
//       "https://lh3.googleusercontent.com/a/AAcHTtdEobpd_GiP-ijvBMgdfG1tce3QAPXEttoBG8NsQTgT6g=s96-c",
//     parent_id: null,
//   },
//   {
//     id: 12,
//     post_id: 6,
//     body: "yrte",
//     created_at: new Date("2023-09-03 21:05:56.901422"),
//     user_id: "cll2wgdjz0000uz2c9kxea20o",
//     image:
//       "https://lh3.googleusercontent.com/a/AAcHTtdEobpd_GiP-ijvBMgdfG1tce3QAPXEttoBG8NsQTgT6g=s96-c",
//     parent_id: 10,
//   },
//   {
//     id: 15,
//     post_id: 6,
//     body: "This is comment 1 with a parent.",
//     created_at: new Date("2023-09-03 21:10:00"),
//     user_id: "cll2wgdjz0000uz2c9kxea20o",
//     image:
//       "https://lh3.googleusercontent.com/a/AAcHTtdEobpd_GiP-ijvBMgdfG1tce3QAPXEttoBG8NsQTgT6g=s96-c",
//     parent_id: 10,
//   },
//   {
//     id: 16,
//     post_id: 6,
//     body: "This is comment 2 with a parent.",
//     created_at: new Date("2023-09-03 21:11:00"),
//     user_id: "cll2wgdjz0000uz2c9kxea20o",
//     parent_id: 12,
//     image:
//       "https://lh3.googleusercontent.com/a/AAcHTtdEobpd_GiP-ijvBMgdfG1tce3QAPXEttoBG8NsQTgT6g=s96-c",
//   },
//   {
//     id: 17,
//     post_id: 6,
//     body: "This is comment 3 with a parent.",
//     created_at: new Date("2023-09-03 21:12:00"),
//     user_id: "cll2wgdjz0000uz2c9kxea20o",
//     image:
//       "https://lh3.googleusercontent.com/a/AAcHTtdEobpd_GiP-ijvBMgdfG1tce3QAPXEttoBG8NsQTgT6g=s96-c",
//     parent_id: 10,
//   },
//   {
//     id: 18,
//     post_id: 6,
//     body: "This is comment 4 with a parent.",
//     created_at: new Date("2023-09-03 21:13:00"),
//     user_id: "cll2wgdjz0000uz2c9kxea20o",
//     parent_id: 12,
//     image:
//       "https://lh3.googleusercontent.com/a/AAcHTtdEobpd_GiP-ijvBMgdfG1tce3QAPXEttoBG8NsQTgT6g=s96-c",
//   },
//   {
//     id: 19,
//     post_id: 6,
//     body: "This is comment 5 with a parent.",
//     created_at: new Date("2023-09-03 21:14:00"),
//     user_id: "cll2wgdjz0000uz2c9kxea20o",
//     image:
//       "https://lh3.googleusercontent.com/a/AAcHTtdEobpd_GiP-ijvBMgdfG1tce3QAPXEttoBG8NsQTgT6g=s96-c",
//     parent_id: 10,
//   },
//   {
//     id: 20,
//     post_id: 6,
//     body: "This is comment 6 with a parent.",
//     created_at: new Date("2023-09-03 21:15:00"),
//     user_id: "cll2wgdjz0000uz2c9kxea20o",
//     parent_id: 12,
//     image:
//       "https://lh3.googleusercontent.com/a/AAcHTtdEobpd_GiP-ijvBMgdfG1tce3QAPXEttoBG8NsQTgT6g=s96-c",
//   },
//   {
//     id: 21,
//     post_id: 6,
//     body: "This is comment 7 with a parent.",
//     created_at: new Date("2023-09-03 21:16:00"),
//     user_id: "cll2wgdjz0000uz2c9kxea20o",
//     image:
//       "https://lh3.googleusercontent.com/a/AAcHTtdEobpd_GiP-ijvBMgdfG1tce3QAPXEttoBG8NsQTgT6g=s96-c",
//     parent_id: 10,
//   },
//   {
//     id: 22,
//     post_id: 6,
//     body: "This is comment 8 with a parent.",
//     created_at: new Date("2023-09-03 21:17:00"),
//     user_id: "cll2wgdjz0000uz2c9kxea20o",
//     parent_id: 12,
//     image:
//       "https://lh3.googleusercontent.com/a/AAcHTtdEobpd_GiP-ijvBMgdfG1tce3QAPXEttoBG8NsQTgT6g=s96-c",
//   },
//   {
//     id: 23,
//     post_id: 6,
//     body: "This is comment 9 with a parent.",
//     created_at: new Date("2023-09-03 21:18:00"),
//     user_id: "cll2wgdjz0000uz2c9kxea20o",
//     image:
//       "https://lh3.googleusercontent.com/a/AAcHTtdEobpd_GiP-ijvBMgdfG1tce3QAPXEttoBG8NsQTgT6g=s96-c",
//     parent_id: 10,
//   },
//   {
//     id: 24,
//     post_id: 6,
//     body: "This is comment 10 with a parent.",
//     created_at: new Date("2023-09-03 21:19:00"),
//     user_id: "cll2wgdjz0000uz2c9kxea20o",
//     parent_id: 12,
//     image:
//       "https://lh3.googleusercontent.com/a/AAcHTtdEobpd_GiP-ijvBMgdfG1tce3QAPXEttoBG8NsQTgT6g=s96-c",
//   },
// ];
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
  const data = await helpers.main.getBySlug.fetch(slug ?? "");

  return {
    props: {
      trpcState: helpers.dehydrate(),
      slug: data?.slug,
    },
    revalidate: 1,
  };
};
export default DishPage;

