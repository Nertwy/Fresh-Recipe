import { type FC } from "react";
import ChangeableInput from "~/Components/ChangeableInput";
import { CardList } from "~/Components/MainPageComponents/Card/CardList";
import StickyNav from "~/Components/StickyNav";
import { api } from "~/utils/api";
const SearchForLikedDishes: FC = () => {
  return (
    <div className="">
      <ChangeableInput className="flex w-full items-center rounded-md border border-gray-300 p-2 focus:border-blue-500 focus:outline-none" />
    </div>
  );
};
const LikedDishes: FC = () => {
  const { data, isFetched } = api.main.getLikedDishes.useQuery();
  console.log(data);
  
  if (isFetched)
    return (
      <>
        <StickyNav></StickyNav>
        <SearchForLikedDishes></SearchForLikedDishes>
        <CardList dishes={data}/>
      </>
    );
  return <>Spinner</>;
};
export default LikedDishes;
