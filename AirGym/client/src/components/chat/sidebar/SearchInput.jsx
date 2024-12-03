import { useDispatch } from "react-redux";
import { setSearch } from "../../../state/chat-slice";
import { IoSearchSharp } from "react-icons/io5";

const SearchInput = () => {
  const dispatch = useDispatch();

  return (
    <div className="relative">
      <input
        type="text"
        placeholder="Search…"
        className="w-full rounded-md bg-slate-800 px-2 py-1.5 text-sm !outline-none !ring-0"
        onChange={(e) => dispatch(setSearch(e.target.value))}
      />
      <IoSearchSharp className="absolute end-2 top-0 h-5 w-5 translate-y-1/3 text-gray-500" />
    </div>
  );
};
export default SearchInput;
