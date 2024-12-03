import { Link } from "react-router-dom";

/* eslint-disable react/prop-types */
const Button = (props) => {
  const { btnText, borderColor, backgroundColor, fontColor, border, link } =
    props;

  const buttonStyle = {
    borderColor: borderColor || "black",
    backgroundColor: backgroundColor || "white",
    color: fontColor || "black",
    border: border || "3px solid",
    padding: "0.5rem 2rem",
    borderRadius: "9999px",
  };

  return (
    <Link to={link}>
      <button className="rounded-full px-8 py-2" style={buttonStyle}>
        {btnText}
      </button>
    </Link>
  );
};

export default Button;
