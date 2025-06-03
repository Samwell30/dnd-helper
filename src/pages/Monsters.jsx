import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Monsters() {
  const [monsters, setMonsters] = useState([]);
  const [searchMonster, setSearchMonster] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    setIsLoading(true);
    axios.get("https://www.dnd5eapi.co/api/monsters").then((response) => {
      setMonsters(response.data.results);
      setIsLoading(false);
    });
  }, []);

  const filteredMonsters = monsters.filter((monster) =>
    monster.name.toLowerCase().includes(searchMonster.toLowerCase())
  );

  return (
    <div className="section">
      <h1>Monsters List</h1>
      <p>
        Type a keyword (e.g., "dragon") to search.
        <br /> Scroll to explore all monsters.
      </p>
      <div className="input__container">
        <input
          type="text"
          placeholder="Search monsters..."
          value={searchMonster}
          onChange={(e) => setSearchMonster(e.target.value)}
        />
        {searchMonster && (
          <button
            className="btn"
            aria-label="Clear search"
            onClick={() => setSearchMonster("")}
            style={{ marginLeft: 8 }}
          >
            Clear
          </button>
        )}
      </div>
      {isLoading ? (
        <p>Loading monsters...</p>
      ) : (
        <ul className="list__items">
          {filteredMonsters.map((monster, idx) => (
            <li
              className="list__item"
              key={monster.index}
              onClick={() => navigate(`/monsters/${monster.index}`)}
              title={`Index: ${monster.index}\nAPI URL: https://www.dnd5eapi.co${monster.url}`}
            >
              {monster.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default Monsters;
