import { Link } from "react-router-dom";

const Content = () => {
  return (
    <footer className="w-full text-orange-200">
      <div className="flex w-full flex-wrap justify-center gap-10 bg-slate-900 px-5 py-10">
        <Link to="/" className="text-sm hover:text-orange-500">
          Home
        </Link>
        <Link to="/about-us" className="text-sm hover:text-orange-500">
          About Us
        </Link>
        <Link to="/contact-us" className="text-sm hover:text-orange-500">
          Contact Us
        </Link>
        <Link to="/login" className="text-sm hover:text-orange-500">
          Login
        </Link>
        <Link to="/sign-up" className="text-sm hover:text-orange-500">
          Register
        </Link>
        <Link to="/couches" className="text-sm hover:text-orange-500">
          Find Coach
        </Link>
      </div>

      <div className="border-t border-orange-500 bg-slate-950 py-4 text-sm">
        <div className="col-span-2 text-center md:col-span-4 lg:col-span-6">
          Copyright 2024 AirGym
        </div>
      </div>
    </footer>
  );
};

export default Content;
