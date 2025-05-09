import React from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";

const Nav = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate();
  };

  return (
    <div>
      <Link to="/" className="landing__link">
        <button onClick={handleClick} className="btn">
          Home
        </button>
      </Link>
      <Link to="/about" className="landing__link">
        <button onClick={handleClick} className="btn">
          About
        </button>
      </Link>
    </div>
  );
};

export default Nav;
