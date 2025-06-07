import React from "react";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <nav>
        <ul className="nav__list">
            <li className="nav__item"><Link to="/">Home</Link></li>
            <li className="nav__item"><Link to="/spells">Spells</Link></li>
            <li className="nav__item"><Link to="/monsters">Monsters</Link></li>
            <li className="nav__item"><Link to="/equipment">Equipment</Link></li>
            <li className="nav__item"><Link to="/magicItems">Magic Items</Link></li>
            <li className="nav__item"><Link to="/classes">Classes</Link></li>
            <li className="nav__item"><Link to="/rules">Rules</Link></li>
        </ul>
    </nav>
  );
};

export default Nav;