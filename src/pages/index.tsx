import Footer from "~/Components/Footer";
import CardInfiniteList from "~/Components/MainPageComponents/Card/CardInfiniteList";
import Header from "~/Components/MainPageComponents/Header";
import StickyNav from "~/Components/StickyNav";

export default function Home() {
  return (
    <>
      <Header />
      <StickyNav />
      <CardInfiniteList />
      <Footer />
    </>
  );
}
