/* eslint-disable react/prop-types */
export default function Feature(props) {
  return (
    <div
      className={`flex flex-col items-center gap-4 text-center ${props.className}`}
    >
      <div className="flex items-center text-orange-500">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="1.5"
          stroke="currentColor"
          className="h-6 w-6"
          aria-label="Dashboard icon"
          role="graphics-symbol"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
          />
        </svg>
      </div>
      <div className="flex w-full min-w-0 flex-col items-center justify-center gap-0 text-base">
        <h3 className="mb-4 text-lg leading-6 text-orange-400 font-medium">
          {props.title || "Title"}
        </h3>
        <p className="text-slate-100 text-sm">
          {props.text || "sample text goes here."}
        </p>
      </div>
    </div>
  );
}
