import { useState, type FC } from "react";
import Search from "~/Components/Search";
import { CardList } from "~/Components/MainPageComponents/Card/CardList";
import NavBar from "~/Components/NavBar";
import { api } from "~/utils/api";
import FilterBar from "~/Components/FilterBar";
const LikedDishes: FC = () => {
  const { data, isFetched } = api.main.getLikedDishes.useQuery();
  const [dishes, setDishes] = useState(data);
  if (isFetched)
    return (
      <>
        <NavBar></NavBar>
        <FilterBar data={data} setData={setDishes} />
        <CardList dishes={dishes} />
      </>
    );
  return <>Spinner</>;
};
export default LikedDishes;
