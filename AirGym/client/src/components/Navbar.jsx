import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  resetUserValue,
  setRoleValue,
  setUserValue,
} from "../state/user-slice";
import { Link } from "react-router-dom";

const links = [
  {
    title: "Feed",
    url: "/feed",
  },
  {
    title: "Coaches",
    url: "/couches",
  },
  {
    title: "About Us",
    url: "/about-us",
  },
  {
    title: "Contact Us",
    url: "/contact-us",
  },
];

const Navbar = () => {
  const [isToggleOpen, setIsToggleOpen] = useState(false);
  const { user } = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const loadUser = useCallback(async () => {
    if (user !== null) {
      return;
    }
    if (!user) {
      axios
        .get("/common/user")
        .then(async ({ data }) => {
          dispatch(setUserValue(data.user));
          if (data.user.role === "COACH") {
            dispatch(setRoleValue(data.coach));
          }
        })
        .catch(() => {
          dispatch(resetUserValue());
        });
    }
  }, [dispatch, user]);

  useEffect(() => {
    loadUser();
  }, [loadUser]);

  return (
    <header className="border-b-1 fixed z-20 w-full border-b border-orange-400/60 bg-gray-950">
      <div className="relative mx-auto max-w-full px-6 lg:max-w-5xl xl:max-w-6xl">
        <nav
          className="flex h-[4rem] items-center justify-between font-medium text-orange-400 sm:h-[5rem]"
          role="navigation"
        >
          {/*Brand logo */}
          <Link className="relative" to="/">
            <img
              src="/airgym.png"
              className="h-10 rounded-md invert sm:h-16 sm:w-20"
            />
          </Link>

          {/* Mobile trigger */}
          <button
            className={`relative order-10 block h-10 w-10 self-center lg:hidden${
              isToggleOpen
                ? "visible opacity-100 [&_span:nth-child(1)]:w-6 [&_span:nth-child(1)]:translate-y-0 [&_span:nth-child(1)]:rotate-45 [&_span:nth-child(2)]:-rotate-45 [&_span:nth-child(3)]:w-0"
                : ""
            }`}
            onClick={() => setIsToggleOpen(!isToggleOpen)}
            aria-expanded={isToggleOpen ? "true" : "false"}
          >
            <div className="absolute left-1/2 top-1/2 w-6 -translate-x-1/2 -translate-y-1/2 transform">
              <span
                aria-hidden="true"
                className="absolute block h-0.5 w-9/12 -translate-y-2 transform rounded-full bg-orange-400 transition-all duration-300"
              ></span>
              <span
                aria-hidden="true"
                className="absolute block h-0.5 w-6 transform rounded-full bg-orange-400 transition duration-300"
              ></span>
              <span
                aria-hidden="true"
                className="absolute block h-0.5 w-1/2 origin-top-left translate-y-2 transform rounded-full bg-orange-400 transition-all duration-300"
              ></span>
            </div>
          </button>

          {/* Navigation links */}
          <ul
            role="menubar"
            aria-label="Select page"
            className={`absolute left-0 top-0 z-[-1] h-fit w-full justify-center overflow-hidden overflow-y-auto overscroll-contain bg-slate-900 px-8 pb-5 pt-24 font-medium transition-[opacity,visibility] duration-300 lg:visible lg:relative lg:top-0 lg:z-0 lg:flex lg:h-full lg:w-auto lg:items-stretch lg:overflow-visible lg:bg-white/0 lg:px-0 lg:py-0 lg:pt-0 lg:opacity-100 ${
              isToggleOpen
                ? "visible border-b border-b-orange-400/60 opacity-100 backdrop-blur-sm"
                : "invisible opacity-0"
            }`}
          >
            {links.map((link, index) => {
              return (
                <li key={index} role="none" className="flex items-stretch">
                  <Link
                    role="menuitem"
                    className="flex items-center gap-2 py-4 transition-colors duration-300 hover:text-orange-500 focus:text-orange-600 focus:outline-none focus-visible:outline-none lg:px-8"
                    to={link.url}
                  >
                    <span>{link.title}</span>
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* login button or user profile image */}
          <div className="ml-auto flex items-center px-6 lg:ml-0 lg:p-0">
            {user && user.profileImage && (
              <Link
                to={
                  user.role === "COACH"
                    ? "/coach"
                    : user.role === "ADMIN"
                      ? "/admin"
                      : "/client"
                }
              >
                <img
                  src={import.meta.env.VITE_APP_IMAGE_URL + user.profileImage}
                  alt="cover image"
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-orange-500 object-cover object-center text-2xl uppercase"
                />
              </Link>
            )}

            {user && !user.profileImage && (
              <Link
                to={
                  user.role === "COACH"
                    ? "/coach"
                    : user.role === "ADMIN"
                      ? "/admin"
                      : "/client"
                }
              >
                <div className="flex min-h-[2rem] w-full min-w-0 flex-col items-start justify-center gap-0 text-center">
                  <h4 className="flex h-10 w-10 items-center justify-center truncate rounded-full bg-orange-600 text-xl font-medium text-slate-100">
                    {user.firstName?.charAt(0).toUpperCase() +
                      user.lastName?.charAt(0).toUpperCase()}
                  </h4>
                </div>
              </Link>
            )}

            {!user && (
              <div className="flex items-center sm:px-6 lg:ml-0 lg:p-0">
                <Link to="/login">
                  <button className="inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-full bg-orange-500 px-8 text-sm font-medium tracking-wide text-white duration-300 hover:bg-orange-600">
                    <span>Sign in</span>
                  </button>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </div>
    </header>
  );
};

export default Navbar;
