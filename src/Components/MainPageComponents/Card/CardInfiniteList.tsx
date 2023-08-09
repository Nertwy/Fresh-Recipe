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
      <div className="self-center bg-slate-100 text-center dark:bg-slate-700">
        <button
          onClick={() => setCurrentLength(currentLength + 25)}
          type="button"
          className="mb-2 mr-2 rounded-lg bg-gradient-to-r from-green-200 via-green-400 to-green-500 px-5 py-2.5 text-center text-sm font-medium text-gray-900 shadow-lg shadow-green-500/50 hover:bg-gradient-to-br focus:outline-none focus:ring-4 focus:ring-green-300 dark:shadow-lg dark:shadow-green-800/80 dark:focus:ring-green-800"
        >
          Load More!
        </button>
      </div>
    </>
  );
};
export default CardInfiniteList;
