import React, { type FC } from "react";
import HeartButton from "./HeartContainer";
import { type Dishes } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
import { FullDishClient } from "~/types";
const Card: FC<Dishes | null> = (data) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: queryData, refetch } = api.main.getIsLiked.useQuery({
    dish_id: data?.id ?? -1,
    user_id: session?.user.id ?? "",
  });
  // console.log(isFetchedAfterMount);

  if (!data) {
    return <></>;
  }

  return (
    <div className="animate-fadeIn hover:cursor-point card my-4 w-96 bg-base-100 shadow-xl transition duration-300 hover:scale-105">
      <figure className="relative h-72 md:w-full">
        <Image
          className="object-fill"
          fill={true}
          src={data.url ? data.url : "/Background.jpg"}
          onClick={() => void router.push(`/dish/${data?.slug}`)}
          alt={""}
        />
      </figure>
      <div className="card-body">
        <h2 className="card-title">{data.name}</h2>
        <p>{data.cuisine}</p>
        <div className="card-actions justify-end">
          <HeartButton
            refetch={() => void refetch()}
            isLiked={queryData ?? false}
            id={data.id}
            numberOfLikes={data.likes}
          />
        </div>
      </div>
    </div>
  );
};
export default Card;
