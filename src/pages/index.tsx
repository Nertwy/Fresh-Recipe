import { useEffect, useRef, useState } from "react";
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
      <ScrollToTopButton />
    </>
  );
}

const ScrollToTopButton = () => {
  const scrollToTopButtonRef = useRef<HTMLButtonElement | null>(null);
  const [isVisible, setIsVisible] = useState<boolean>(false);
  const updateScrollButtonVisibility = (): void => {
    const isScrollNeeded = document.body.scrollHeight > window.innerHeight;
    const isScrolledDown = window.scrollY > 0;

    setIsVisible(isScrollNeeded && isScrolledDown);
  };

  useEffect(() => {
    updateScrollButtonVisibility();
    window.addEventListener("scroll", updateScrollButtonVisibility);
    window.addEventListener("resize", updateScrollButtonVisibility);

    return () => {
      window.removeEventListener("scroll", updateScrollButtonVisibility);
      window.removeEventListener("resize", updateScrollButtonVisibility);
    };
  }, []);

  const scrollToTop = (): void => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <button
      ref={scrollToTopButtonRef}
      onClick={scrollToTop}
      className={`fixed bottom-4 right-4 z-50 rounded bg-gray-600 px-4 py-2 text-white transition-opacity duration-300 hover:bg-gray-700 ${
        isVisible ? "opacity-100" : "hidden opacity-0"
      }`}
    >
      &#8593;
    </button>
  );
};
