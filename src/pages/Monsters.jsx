import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Monsters() {
  const [monsters, setMonsters] = useState([]);
  const [searchMonster, setSearchMonster] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const cachedMonsters = localStorage.getItem("detailedMonsters");

    if (cachedMonsters) {
      setMonsters(JSON.parse(cachedMonsters));
      setIsLoading(false);
    } else {
      axios.get("https://www.dnd5eapi.co/api/monsters").then((response) => {
        const monsterSummaries = response.data.results;

        const fetchDetails = monsterSummaries.map((monster) =>
          axios.get(`https://www.dnd5eapi.co${monster.url}`).then((res) => res.data)
        );

        Promise.all(fetchDetails).then((detailedMonsters) => {
          localStorage.setItem("detailedMonsters", JSON.stringify(detailedMonsters));
          setMonsters(detailedMonsters);
          setIsLoading(false);
        });
      });
    }
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
            aria-label="Clear search"
            onClick={() => setSearchMonster("")}
            style={{ marginLeft: 8 }}
          >
            ✖
          </button>
        )}
      </div>
      {isLoading ? (
        <p>Loading monsters...</p>
      ) : (
        <ul className="list__items">
          {filteredMonsters.map((monster) => (
            <li
              className="list__item"
              key={monster.index}
              onClick={() => navigate(`/monsters/${monster.index}`)}
              title={`Index: ${monster.index}\nAPI URL: https://www.dnd5eapi.co${monster.url}`}
              style={{ cursor: 'pointer' }}
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
