import React from "react";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <nav>
        <ul className="nav__list">
            <li className="nav__item"><Link to="/">Home</Link></li>
            <li className="nav__item"><Link to="/spells">Spells</Link></li>
            <li className="nav__item"><Link to="/monsters">Monsters</Link></li>
            <li className="nav__item"><Link to="/about">About</Link></li>
        </ul>
    </nav>
  );
};

export default Nav;