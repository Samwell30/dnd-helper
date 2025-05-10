import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function SpellsList() {
  const [spells, setSpells] = useState([]);
  const [searchSpell, setSearchSpell] = useState('');
  const [searchLevel, setSearchLevel] = useState('');
  const navigate = useNavigate(); 

  useEffect(() => {
    axios.get('https://www.dnd5eapi.co/api/spells')
      .then(response => {
        setSpells(response.data.results);
      })
      .catch(error => {
        console.error('Error fetching spells:', error);
      });
  }, []);

  const filteredSpells = spells.filter(spell => {
    const spellList = spell.name.toLowerCase().includes(searchSpell.toLowerCase());
    const spellLevel = searchLevel === '' || spell.level === parseInt(searchLevel); // Match level if provided
    return spellList && spellLevel;
  });

  return (
    <div className="section">
      <h1>Spells List</h1>
      <p>
        Type a keyword (e.g., "fire") or search by spell level.
        <br /> Scroll to explore all spells.
      </p>
      <div className="input-container">
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
          onChange={(e) => setSearchLevel(e.target.value)}
        />
      </div>
      <ul>
      {filteredSpells.map((spell) => (
    <li
      className="list-item"
      key={spell.index}
      onClick={() => navigate(`/spells/${spell.index}`)} // Navigate on click
    >
      {spell.name}
    </li>
  ))}
</ul>    </div>
  );
}

export default SpellsList;