import { type FC } from "react";
import Card from "./Card";
import { type Dishes } from "@prisma/client";

export const CardList: FC<{ dishes?: Dishes[] }> = (props) => {
  const { dishes = [] } = props;
  return (
    <div className="grid auto-cols-fr justify-items-center sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {dishes.map((val, index) => {
        return <Card key={index} {...val} />;
      })}
    </div>
  );
};
