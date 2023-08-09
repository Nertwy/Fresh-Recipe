import React, { useState, type FC } from "react";
import Link from "next/link";
import { signIn, signOut, useSession } from "next-auth/react";
// Сделать случайное блюдо  Math.floor(Math.random() * 101); от 0 до 100

const StickyNav: FC = () => {
  const { status } = useSession();
  let login = false;
  if (status === "authenticated") login = true;
  return (
    <nav className="font-fasthand nav-show-anim sticky   top-0 z-50 space-x-16 bg-green-700 py-2 text-center text-3xl opacity-70 shadow-sm drop-shadow dark:shadow-white">
      <Link
        href={"/"}
        className="rounded-xl border-2 border-transparent  border-opacity-0  px-2 transition duration-200 hover:cursor-pointer hover:border-2 hover:border-opacity-100 hover:text-green-400"
      >
        Home
      </Link>
      <Link
        href="#"
        className="rounded-xl border-2 border-transparent px-2 transition duration-200  hover:cursor-pointer hover:border-opacity-100 hover:text-green-400 hover:duration-300"
      >
        Random Recipes
      </Link>
      <Link
        onClick={() =>
          window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
          })
        }
        href={"/About"}
        className="rounded-xl border-2 border-transparent px-2 transition duration-200 hover:cursor-pointer hover:border-2 hover:border-opacity-100 hover:text-green-400 hover:duration-300"
      >
        About
      </Link>
      {login ? (
        <Link
          href={"/"}
          className="rounded-xl border-2 border-transparent px-2 transition duration-200 hover:cursor-pointer hover:border-opacity-100 hover:text-green-400 hover:duration-300"
          onClick={() => void signOut()}
        >
          Logout
        </Link>
      ) : (
        <Link
          href={"/"}
          className="rounded-xl border-2 border-transparent px-2 transition duration-200 hover:cursor-pointer hover:border-opacity-100 hover:text-green-400 hover:duration-300"
          onClick={() => void signIn()}
        >
          Login
        </Link>
      )}
      <Link
        href={"/Liked"}
        // onClick={() => navigate("/like")}
        className="rounded-xl border-2 border-transparent px-2 transition duration-200 hover:cursor-pointer hover:border-opacity-100 hover:text-green-400 hover:duration-300"
      >
        Liked
      </Link>
      <Link
        href={"/AddDish"}
        className="rounded-xl border-2 border-transparent px-2 transition duration-200 hover:cursor-pointer hover:border-opacity-100 hover:text-green-400 hover:duration-300 "
      >
        Add Dish
      </Link>
    </nav>
  );
};
export default StickyNav;
