import { faqs } from "../data/faq.json";

const Faq = () => {
  return (
    <div className="w-full divide-y rounded divide-slate-200 md:w-[600px] lg:w-[1000px]">
      {faqs.map((faq, index) => (
        <details key={index} className="p-4 group" open={index === 0}>
          <summary className="relative cursor-pointer list-none pr-8 font-medium text-slate-200 transition-colors duration-300 focus-visible:outline-none group-hover:text-slate-300  [&::-webkit-details-marker]:hidden">
            {faq.question}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute right-0 w-4 h-4 transition duration-300 top-1 shrink-0 stroke-white group-open:rotate-45"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-labelledby={`title-ac${index + 1} desc-ac${index + 1}`}
            >
              <title id={`title-ac${index + 1}`}>Open icon</title>
              <desc id={`desc-ac${index + 1}`}>
                icon that represents the state of the summary
              </desc>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 4v16m8-8H4"
              />
            </svg>
          </summary>
          <p className="mt-4 text-orange-200">{faq.answer}</p>
        </details>
      ))}
    </div>
  );
};

export default Faq;
