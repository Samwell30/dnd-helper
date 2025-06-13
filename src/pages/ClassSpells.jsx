import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";

const ClassSpells = () => {
  const { classIndex } = useParams();
  const [spells, setSpells] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchClassSpells() {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(
          `https://www.dnd5eapi.co/api/2014/classes/${classIndex}/spells`
        );
        setSpells(data.results);
      } catch (err) {
        setError("Failed to load spells for this class.");
      }
      setIsLoading(false);
    }
    fetchClassSpells();
  }, [classIndex]);

  return (
    <div className="section">
      <h1>
        Spells for {classIndex.charAt(0).toUpperCase() + classIndex.slice(1)}
      </h1>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul className="list__items">
        {spells.map((spell) => (
          <li
            key={spell.index}
            className="list__item"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Link
              to={`/spells/${spell.index}`}
              state={{ fromClass: classIndex }}
              style={{
                color: "inherit",
                textDecoration: "none",
                width: "100%",
              }}
            >
              <span
                style={{ display: "block", width: "100%", textAlign: "center" }}
              >
                {spell.name}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <Link to={`/classes/${classIndex}`}>
        <button className="btn__details">Back to Class</button>
      </Link>
    </div>
  );
};

export default ClassSpells;
