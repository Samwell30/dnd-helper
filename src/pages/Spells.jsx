import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const SpellsList = () => {
  const [spells, setSpells] = useState([]);
  const [searchSpell, setSearchSpell] = useState("");
  const [searchLevel, setSearchLevel] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSpells() {
      setIsLoading(true);
      const { data } = await axios.get("https://www.dnd5eapi.co/api/spells");
      setSpells(data.results);
      setIsLoading(false);
    }
    fetchSpells();
  }, []);

  const filteredSpells = spells.filter((spell) => {
    const spellList = spell.name
      .toLowerCase()
      .includes(searchSpell.toLowerCase());
    const spellLevel =
      searchLevel === "" || spell.level === parseInt(searchLevel, 10);
    return spellList && spellLevel;
  });

  return (
    <div className="section">
      <h1>Spells List</h1>
      <p>
        Type a keyword (e.g., "fire") or search by spell level.
        <br /> Scroll to explore all spells.
      </p>
      <div className="input__container">
        <input
          type="text"
          placeholder="Search spells..."
          value={searchSpell}
          onChange={(e) => setSearchSpell(e.target.value)}
        />
        <input
          type="number"
          placeholder="Search spells by level..."
          value={searchLevel}
          onChange={(e) => {
            const value = e.target.value;
            setSearchLevel(
              value === "" ? "" : Math.min(9, Math.max(0, parseInt(value, 10)))
            );
          }}
        />{" "}
      </div>
      {isLoading ? (
        <p>Loading spells...</p>
      ) : (
        <ul className="list__items">
          {filteredSpells.map((spell, idx) => (
            <li
              className="list__item"
              key={spell.index}
              onClick={() => navigate(`/spells/${spell.index}`)}
            >
              {spell.name}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SpellsList;
