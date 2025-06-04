import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const QuickSearch = () => {
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [spellList, setSpellList]   = useState([]);
  const [monsterList, setMonsterList] = useState([]);
  const [suggestions, setSuggestions] = useState([]);

  const debounceRef = useRef(null);

  useEffect(() => {
    async function loadIndexes() {
      try {
        const [spellsRes, monstersRes] = await Promise.all([
          axios.get("https://www.dnd5eapi.co/api/spells"),
          axios.get("https://www.dnd5eapi.co/api/monsters"),
        ]);
        setSpellList(spellsRes.data.results);
        setMonsterList(monstersRes.data.results);
      } catch (err) {
        console.error("Error loading indexes:", err);
      }
    }
    loadIndexes();
  }, []);

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      const term = query.trim().toLowerCase();
      if (!term) {
        setSuggestions([]);
        return;
      }

      const matchSpells = spellList
        .filter((s) => s.name.toLowerCase().includes(term))
        .map((s) => ({ ...s, type: "spell" }));

      const matchMonsters = monsterList
        .filter((m) => m.name.toLowerCase().includes(term))
        .map((m) => ({ ...m, type: "monster" }));

      setSuggestions([...matchSpells, ...matchMonsters].slice(0, 10));
    }, 200);

    return () => clearTimeout(debounceRef.current);
  }, [query, spellList, monsterList]);

  const reset = () => {
    setQuery("");
    setSuggestions([]);
  };

  const handleSelect = (item) => {
    navigate(`/${item.type}s/${item.index}`);
    reset();
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (suggestions.length) handleSelect(suggestions[0]);
  };

  return (
    <form className="quick-search" onSubmit={handleSubmit} autoComplete="off">
      <input
        type="text"
        placeholder="Search a spell or monster..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      {suggestions.length > 0 && (
        <ul className="quick-search__drop">
          {suggestions.map((s) => (
            <li key={`${s.type}-${s.index}`} onClick={() => handleSelect(s)}>
              <span className="quick-search__tag">
                {s.type === "spell" ? "🪄" : "👹"}
              </span>
              {s.name}
            </li>
          ))}
        </ul>
      )}
    </form>
  );
};

export default QuickSearch;
