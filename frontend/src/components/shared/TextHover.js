import { Link } from "react-router-dom";
const TextHover = ({ display, active, targetLink }) => {
  return (
    <Link to={targetLink} className="block">
      <div className="flex items-center justify-start cursor-pointer">
        <div
          className={`${active ? "text-white" : "text-gray-400"}
        text-lg font-semibold hover:text-white `}
          onClick={onclick}
        >
          {display}
        </div>
      </div>
    </Link>
  );
};

export default TextHover;
