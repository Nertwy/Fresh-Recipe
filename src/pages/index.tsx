import Footer from "~/Components/Footer";
import GlobalSearch from "~/Components/GlobalSearch";
import CardInfiniteList from "~/Components/MainPageComponents/Card/CardInfiniteList";
import NavBar from "~/Components/NavBar";

export default function Home() {
  return (
    <>
      <NavBar />
      <GlobalSearch />
      <CardInfiniteList />
      <Footer />
    </>
  );
}
