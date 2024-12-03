/* eslint-disable react/prop-types */
const Title = ({ title }) => {
  return (
    <div className="relative">
      <h2 className="mb-14 font-semibold text-4xl text-center pt-12 bg-gradient-to-r from-white to-orange-500 bg-clip-text text-transparent">
        {title}
      </h2>
      <h2 className="absolute inset-0 blur-md font-semibold text-4xl text-center pt-12 text-orange-400 before:content-[''] before:absolute before:bg-orange-300 before:w-[0] before:h-1 before:-skew-y-3 before:-bottom-4">
        {title}
      </h2>
    </div>
  );
};

export default Title;
