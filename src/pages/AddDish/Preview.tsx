import { FC } from "react";
import Card from "~/Components/MainPageComponents/Card/Card";
import NavBar from "~/Components/NavBar";
import { FullDishClient } from "~/types";

type PreviewProps = {
  dish: FullDishClient;
  visible: boolean;
};
const Preview: FC<PreviewProps> = ({ dish, visible }) => {
  //Сделать от 2х до 5 нормальные названия

  if (!dish) return <>No data</>;
  return (
    <>
      <div
        className={` flex w-screen  flex-col items-center bg-gray-200 ${
          visible ? "pointer-events-none visible cursor-not-allowed" : "hidden"
        }`}
      >
        <Card {...dish} id={-1} />
        <h3 className="text-xl font-semibold">Ингридиенты</h3>
        <div className="text mb-3 flex-col pb-6 font-serif sm:w-3/5 md:w-2/4 lg:w-1/3">
          {dish?.ingredients?.map((e, i) => (
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
            {dish.recipes?.step.map((elem, index) => (
              <li key={index} className="list-decimal">
                {elem}
              </li>
            ))}
          </ol>
        </div>
      </div>
    </>
  );
};

export default Preview;
