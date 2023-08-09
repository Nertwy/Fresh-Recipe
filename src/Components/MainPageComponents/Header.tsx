import Image from "next/image";
import { type FC } from "react";
import img from "../../assets/Logo.png";
const Header: FC = () => {
  return (
    <header className="top-0 h-auto w-auto overflow-hidden bg-green-500  text-center drop-shadow dark:bg-gray-600">
      <h2 className="font-fasthand p-10 text-center text-6xl font-bold">
        Welcome to Home Page!
      </h2>
      <Image
        src={img}
        className="z-10  mx-auto  h-24 transition-transform duration-200 hover:scale-110"
        alt="Dish for wish"
      />
    </header>
  );
};

export default Header;
