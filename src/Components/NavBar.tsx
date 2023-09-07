import { signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { type Theme } from "~/types";

const NavBar = () => {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== "undefined") {
      const savedTheme = localStorage.getItem("theme") as Theme;
      return savedTheme || "light"; // Default to "light" if no theme is found in localStorage
    }
    return "light";
  });
  // useEffect(() => {
  //   const theme: Theme = localStorage.getItem("theme") as Theme;
  //   if (theme) setTheme(theme);
  // }, []);
  useEffect(() => {
    document.querySelector("html")?.setAttribute("data-theme", theme);
    localStorage.setItem("theme", theme);
  }, [theme]);
  const { data, status } = useSession();
  let login = false;
  if (status === "authenticated") login = true;
  return (
    <div className="navbar bg-base-300">
      <div className="flex-1">
        <a className="btn btn-ghost text-xl normal-case">
          <Image width={50} height={50} alt="Dish Website" src={"/Logo.png"} />
        </a>
      </div>
      <div className="flex-none gap-2">
        <div className="form-control">
          <Link href={"/"}>Home</Link>
        </div>
        <svg
          onClick={() => setTheme("light")}
          name="Sun"
          xmlns="http://www.w3.org/2000/svg"
          fill={theme === "light" ? "black" : "none"}
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-8 w-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v2.25m6.364.386l-1.591 1.591M21 12h-2.25m-.386 6.364l-1.591-1.591M12 18.75V21m-4.773-4.227l-1.591 1.591M5.25 12H3m4.227-4.773L5.636 5.636M15.75 12a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0z"
          />
        </svg>

        <svg
          onClick={() => setTheme("dark")}
          name="Moon"
          xmlns="http://www.w3.org/2000/svg"
          fill={theme === "dark" ? "white" : "none"}
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className="h-8 w-8"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.718 9.718 0 0118 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 009.002-5.998z"
          />
        </svg>

        <div className="flex-none gap-2"></div>
        <div className="dropdown-end dropdown">
          <label tabIndex={0} className="avatar btn btn-circle btn-ghost">
            <div className="w-10 rounded-full">
              <Image
                width={80}
                height={80}
                alt=""
                src={
                  data?.user.image ?? "/Profile_avatar_placeholder_large.png"
                }
              />
            </div>
          </label>
          <ul
            tabIndex={0}
            className="menu dropdown-content rounded-box menu-sm z-[1] mt-3 w-52 bg-base-100 p-2 shadow"
          >
            <li className="">
              <a className="justify-between">
                Profile
                <span className="badge">New</span>
              </a>
            </li>
            <li>
              <a>Settings</a>
            </li>
            <li>
              <Link href={"/Liked"} className="">
                Liked Dishes
                <span className="indicator-end  indicator-item indicator-middle">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    className="h-4 w-4"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M8 4.41c1.387-1.425 4.854 1.07 0 4.277C3.146 5.48 6.613 2.986 8 4.412z"
                    />
                    <path d="M2 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v13.5a.5.5 0 0 1-.777.416L8 13.101l-5.223 2.815A.5.5 0 0 1 2 15.5V2zm2-1a1 1 0 0 0-1 1v12.566l4.723-2.482a.5.5 0 0 1 .554 0L13 14.566V2a1 1 0 0 0-1-1H4z" />{" "}
                  </svg>
                </span>
              </Link>
            </li>
            <li>
              {login ? (
                <Link
                  href={"/"}
                  className="rounded-xl border-2 border-transparent px-2 transition duration-200 hover:cursor-pointer hover:border-opacity-100 hover:text-secondary hover:duration-300"
                  onClick={() => void signOut()}
                >
                  Logout
                </Link>
              ) : (
                <Link
                  href={"/"}
                  className="rounded-xl border-2 border-transparent px-2 transition duration-200 hover:cursor-pointer hover:border-opacity-100 hover:text-secondary hover:duration-300"
                  onClick={() => void signIn()}
                >
                  Login
                </Link>
              )}
            </li>
            <li>
              {login ? (
                <Link href={"/AddDish"}>
                  Add Dish
                  <span className="indicator-end  indicator-item indicator-middle">
                    +
                  </span>
                </Link>
              ) : (
                <></>
              )}
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default NavBar;
