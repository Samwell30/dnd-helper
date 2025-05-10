import React from "react";
import { Link } from "react-router-dom";

function Landing() {
  return (
    <div className="landing">
      <div className="hero">
        <h1 className="hero__title">Welcome to the D<span className="red">&</span>D Helper</h1>
        <p className="hero__subtitle">
          Your ultimate companion for exploring spells, monsters, and more!
        </p>
        <div className="hero__buttons">
          <Link to="/spells" className="btn">
            Explore Spells
          </Link>
          <Link to="/monsters" className="btn">
            Discover Monsters
          </Link>
        </div>
      </div>
    </div>
  );
}

export default Landing;