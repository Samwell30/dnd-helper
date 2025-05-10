import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function SpellsList() {
  const [spells, setSpells] = useState([]);
  const [searchSpell, setSearchSpell] = useState('');
  const [searchLevel, setSearchLevel] = useState('');

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
    const spellList =spell.name.toLowerCase().includes(searchSpell.toLowerCase());
    const spellLevel = searchLevel === '' || spell.level === parseInt(searchLevel); // Match level if provided
    return spellList && spellLevel;

});

  return (
    <div className='spells'>
      <h1>Spells List</h1>
      <p>For a better experience
      type a keyword (e.g., "fire") or search by spell level
      <br /> or scroll as you desire
      </p>
    <div className="container">
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
        {filteredSpells.map(spell => (
          <li className="spells__list" key={spell.index}>
            <Link to={`/spells/${spell.index}`}>{spell.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SpellsList;