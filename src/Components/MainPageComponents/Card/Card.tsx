import React, { useEffect, type FC } from "react";
import HeartButton from "./HeartContainer";
import { type Dishes } from "@prisma/client";
import Image from "next/image";
import { useRouter } from "next/router";
import { useSession } from "next-auth/react";
import { api } from "~/utils/api";
const Card: FC<Dishes | null> = (data) => {
  const router = useRouter();
  const { data: session } = useSession();
  const { data: queryData, refetch} = api.main.getIsLiked.useQuery(
    {
      dish_id: data?.id ?? -1,
      user_id: session?.user.id ?? "",
    }
  );
  // console.log(isFetchedAfterMount);

  if (!data) {
    return <></>;
  }
  return (
    <div className="card-show-anim bg-slate-200 dark:bg-slate-700">
      <div
        className="m-3 flex w-auto cursor-pointer flex-col  rounded-md p-7 shadow-md transition duration-200  hover:z-10 hover:scale-110 hover:shadow-md dark:text-white dark:shadow-white"
        //Cannot invoke an object which is possibly 'undefined' in TS without ?.
      >
        <div className="h-96 overflow-hidden">
          <Image
            src={data?.url ?? ""}
            alt="Meal"
            height={500}
            width={500}
            className="h-full w-full"
            // onError={handleError}
            onClick={() => {
              // localStorage.setItem("food", JSON.stringify(data));
              void router.push(`/dish/${data?.slug}`);
            }}
          />
        </div>
        <div className="h-auto w-auto flex-col">
          <h3>
            <b>{data?.name}</b>
          </h3>
          <p>{data?.cuisine}</p>
          <div className="float-right ">
            <HeartButton
            refetch={refetch}
              isLiked={queryData ?? false}
              id={data?.id ?? -1}
              numberOfLikes={data.likes}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Card;
