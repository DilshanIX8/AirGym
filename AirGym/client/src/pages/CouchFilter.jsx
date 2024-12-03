import { useCallback, useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";
import { BiSolidError } from "react-icons/bi";
import { BsInfoCircleFill } from "react-icons/bs";
import { FaStar } from "react-icons/fa6";

const CouchFilter = () => {
  const [experience, setExperience] = useState("");
  const [ratings, setRatings] = useState("");
  const [price, setPrice] = useState("");
  const [coaches, setCoaches] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // get coach details
  const fetchCoaches = useCallback(
    async (experience = undefined, ratings = undefined, price = undefined) => {
      setLoading(true);
      setError(null);
      // change url with user selected filters
      let url = "/public/coaches?";
      if (experience) url += `experience=${experience}&`;
      if (ratings) url += `ratings=${ratings}&`;
      if (price) url += `price=${price}`;

      // clear current data and errors
      setError(null);
      setCoaches([]);

      await axios
        .get(url)
        .then((res) => {
          setCoaches(res?.data?.coaches);
        })
        .catch((err) => {
          setError(err?.response?.data?.message || "Something went wrong");
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [],
  );

  // filter coaches by filter criteria
  const handleSubmit = (e) => {
    e.preventDefault();
    fetchCoaches(experience, ratings, price);
  };

  // load coaches in component mounting
  useEffect(() => {
    fetchCoaches();
  }, [fetchCoaches]);

  return (
    <section>
      {/* navbar */}
      <Navbar />
      {/* filter form */}
      <form
        onSubmit={handleSubmit}
        className="flex w-full justify-center rounded p-4 pt-24"
      >
        {/* filter criteria */}
        <div className="grid w-full max-w-7xl grid-cols-1 gap-4 rounded-md border border-slate-700 bg-slate-900 p-4 px-5 sm:grid-cols-2 lg:grid-cols-4">
          {/* experience */}
          <div className="w-full">
            <label className="text-sm font-medium text-gray-100">
              Experience
            </label>
            <select
              id="experience"
              name="experience"
              className="mt-1 block w-full rounded-md border border-slate-600 bg-transparent px-4 py-2 text-sm text-white"
              value={experience}
              onChange={(e) => setExperience(e.target.value)}
            >
              <option className="bg-slate-900" value="">Select experience</option>
              <option className="bg-slate-900" value="BELOW_1_YEAR">Below 1 Year</option>
              <option className="bg-slate-900" value="ONE_TO_THREE_YEARS">1 to 3 Years</option>
              <option className="bg-slate-900" value="THREE_TO_FIVE_YEARS">3 to 5 Years</option>
              <option className="bg-slate-900" value="ABOVE_FIVE_YEARS">Above 5 Years</option>
            </select>
          </div>
          {/* ratings */}
          <div className="w-full">
            <label className="text-sm font-medium text-gray-100">Ratings</label>
            <select
              value={ratings}
              onChange={(e) => setRatings(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-600 bg-transparent px-4 py-2 text-sm text-white"
            >
              <option className="bg-slate-900" value="">Select Ratings</option>
              <option className="bg-slate-900" value="ONE_STAR">1 Star</option>
              <option className="bg-slate-900" value="TWO_STAR">2 Stars</option>
              <option className="bg-slate-900" value="THREE_STAR">3 Stars</option>
              <option className="bg-slate-900" value="FOUR_STAR">4 Stars</option>
              <option className="bg-slate-900" value="FIVE_STAR">5 Stars</option>
            </select>
          </div>
          {/* price */}
          <div className="w-full">
            <label className="text-sm font-medium text-gray-100">Price</label>
            <select
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="mt-1 block w-full rounded-md border border-slate-600 bg-transparent px-4 py-2 text-sm text-white"
            >
              <option className="bg-slate-900" value="">Select Price Order</option>
              <option className="bg-slate-900" value="LOW_TO_HIGH">Low to High</option>
              <option className="bg-slate-900" value="HIGH_TO_LOW">High to Low</option>
            </select>
          </div>
          {/* submit button */}
          <div className="flex items-end">
            <button
              type="submit"
              className="h-10 w-full rounded bg-orange-500 p-2 px-8 text-white"
            >
              Filter
            </button>
          </div>
        </div>
      </form>

      {/* filtered coaches details */}
      <div className="mt-4 flex flex-col items-center justify-center gap-y-4 rounded-lg p-4 shadow-md">
        {/* if loading */}
        {loading && <p className="max-w-3xl text-white">Loading...</p>}
        {/* if error */}
        {error && !loading && (
          <p className="flex w-full max-w-3xl items-center justify-center gap-x-2 rounded-md bg-red-500/80 p-2 text-white">
            <BiSolidError className="h-6 w-6" /> {error}
          </p>
        )}
        {/* if no coaches found and no errors or not a loading*/}
        {coaches.length === 0 && !loading && !error && (
          <p className="flex w-full max-w-3xl items-center justify-center gap-x-2 rounded-md bg-slate-600 p-2 text-white">
            <BsInfoCircleFill className="h-5 w-5" />
            No coaches found
          </p>
        )}
        {/* filtered details */}
        <div className="grid w-full max-w-7xl grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          {/* if data is available */}
          {coaches.map((coach) => (
            <div
              key={coach.user.username}
              className="mb-4 flex w-full flex-col items-center justify-between gap-x-2 rounded border border-orange-400/40 bg-slate-900 p-4 text-sm text-white shadow-xl shadow-orange-500/20 drop-shadow-2xl hover:shadow-orange-500/40"
            >
              {/* profile image*/}
              <div className="flex justify-center">
                {/* if image url is null */}
                {coach?.user?.profileImage == null && (
                  <div className="flex h-36 w-36 items-center justify-center rounded-full bg-orange-500 text-7xl">
                    {coach.user.firstName.charAt(0)}
                    {coach.user.lastName.charAt(0)}
                  </div>
                )}
                {/* if image url is not null */}
                {coach?.user?.profileImage != null && (
                  <img
                    src={
                      import.meta.env.VITE_APP_IMAGE_URL +
                      coach?.user?.profileImage
                    }
                    alt={
                      coach.user.firstName.charAt(0) +
                      coach.user.lastName.charAt(0)
                    }
                    className="flex h-36 w-36 items-center justify-center rounded-full bg-orange-500 text-7xl"
                  />
                )}
              </div>

              {/* coach details */}
              <div className="w-full">
                {/* coach name */}
                <h2 className="mb-2 mt-4 flex justify-between text-base font-medium text-slate-100">
                  <span className="w-full truncate text-ellipsis">
                    {coach.user.firstName} {coach.user.lastName}
                  </span>
                  <span className="flex items-center gap-x-1">
                    <FaStar className="text-amber-400" /> {coach?.ratings}
                  </span>
                </h2>
                {/* description */}
                <p className="mb-2 line-clamp-4">{coach.description}</p>
                {/* experience */}
                <p className="flex justify-between gap-x-2 font-medium">
                  <span className="">Experience:</span>
                  <span className="capitalize text-orange-400">
                    {coach.experience.replaceAll("_", " ").toLowerCase()}
                  </span>
                </p>
                {/* session fee */}
                <p className="flex justify-between gap-x-2 font-medium">
                  <span className="">Price per session:</span>
                  <span className="capitalize text-orange-400">
                    LKR {coach.oneSessionFee}
                  </span>
                </p>
              </div>

              {/* flex grower for filling the spaces */}
              <div className="flex flex-grow flex-col" />

              {/* go to profile button */}
              <div className="mb-2 mt-4 flex w-full text-center text-gray-50">
                <Link
                  className="w-full rounded-md bg-orange-500 px-4 py-2"
                  to={"/user/" + coach.user.username}
                >
                  Go to Profile
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* footer */}
      <Footer />
    </section>
  );
};

export default CouchFilter;
