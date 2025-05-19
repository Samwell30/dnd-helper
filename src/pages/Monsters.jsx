import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Monsters() {
  const [monsters, setMonsters] = useState([]);
  const [searchMonster, setSearchMonster] = useState("");
  const [searchBySize, setSearchBySize] = useState("");
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

  const filteredMonsters = monsters.filter((monster) => {
    const size = monster.size || "Unknown"; // Provide a fallback value for size
    const monsterList = monster.name
      .toLowerCase()
      .includes(searchMonster.toLowerCase());
    const monsterSize =
      searchBySize === "" || size.toLowerCase() === searchBySize.toLowerCase();
    return monsterList && monsterSize;
  });

  return (
    <div className="section">
      <h1>Monsters List</h1>
      <p>
        Type a keyword (e.g., "dragon") or filter by size.
        <br /> Scroll to explore all monsters.
      </p>
      <div className="input__container">
        <input
          type="text"
          placeholder="Search monsters..."
          value={searchMonster}
          onChange={(e) => setSearchMonster(e.target.value)}
        />
        <select
          value={searchBySize}
          onChange={(e) => setSearchBySize(e.target.value)}
        >
          <option value="">All Sizes</option>
          <option value="Tiny">Tiny</option>
          <option value="Small">Small</option>
          <option value="Medium">Medium</option>
          <option value="Large">Large</option>
          <option value="Huge">Huge</option>
          <option value="Gargantuan">Gargantuan</option>
        </select>
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
