import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function SpellsList() {
  const [spells, setSpells] = useState([]);
  const [searchSpell, setSearchSpell] = useState('');

  useEffect(() => {
    axios.get('https://www.dnd5eapi.co/api/spells')
      .then(response => {
        setSpells(response.data.results);
      })
      .catch(error => {
        console.error('Error fetching spells:', error);
      });
  }, []);

  const filteredSpells = spells.filter(spell =>
    spell.name.toLowerCase().includes(searchSpell.toLowerCase())
  );

  return (
    <div>
      <h1>Spells List</h1>
      <input
        type="text"
        placeholder="Search spells..."
        value={searchSpell}
        onChange={(e) => setSearchSpell(e.target.value)}
      />
      <ul>
        {filteredSpells.map(spell => (
          <li key={spell.index}>
            <Link to={`/spells/${spell.index}`}>{spell.name}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default SpellsList;