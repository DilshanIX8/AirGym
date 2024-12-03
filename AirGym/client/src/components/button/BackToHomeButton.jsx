import { FaArrowLeft } from "react-icons/fa";
import { Link } from "react-router-dom";

const BackToHomeButton = () => {
  return (
    <Link
      className="fixed flex items-center gap-4 top-2 left-2 px-4 py-2 bg-black rounded shadow-xl z-50 m-4 text-orange-400 drop-shadow-2xl shadow-orange-400/30 border-orange-300/40 border font-bold"
      to={"/"}
    >
      <FaArrowLeft />
      Home
    </Link>
  );
};

export default BackToHomeButton;
