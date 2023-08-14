import { useState, type FC, useEffect } from "react";
import Card from "./Card";
import { type Dishes } from "@prisma/client";
import { api } from "~/utils/api";
import { CardList } from "./CardList";

const CardInfiniteList: FC = () => {
  const [dishes, setDishes] = useState<Dishes[]>([]);
  const [currentLength, setCurrentLength] = useState(0);
  const { data, isFetched } = api.main.getDish25.useQuery(currentLength);

  useEffect(() => {
    if (data && isFetched) {
      setDishes((prev) => [...prev, ...data]);
      setCurrentLength(dishes.length);
    }
  }, [isFetched]);
  return (
    <>
      <CardList dishes={dishes} />
      <div className="text-center self-center pb-6">
        <button
          className="btn btn-xs sm:btn-sm md:btn-md lg:btn-lg"
          onClick={() => setCurrentLength(currentLength + 25)}
        >
          Load More!
        </button>
      </div>
    </>
  );
};
export default CardInfiniteList;
