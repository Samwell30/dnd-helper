import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

function Monsters() {
  const [monsters, setMonsters] = useState([]);
  const [searchMonster, setSearchMonster] = useState('');
  

  useEffect(() => {
    axios.get('https://www.dnd5eapi.co/api/monsters')
      .then(response => {
        setMonsters(response.data.results);
      })
      .catch(error => {
        console.error('Error fetching monsters:', error);
      });
  }, []);

  const filteredMonsters = monsters.filter(monster =>
    monster.name.toLowerCase().includes(searchMonster.toLowerCase())
  );

  return (
    <div>
      <h1>Monsters List</h1>
      <input 
      type="text" 
      placeholder='Search monsters...'
      value={searchMonster}
      onChange={(e) => setSearchMonster(e.target.value)}
      />
      <ul>
        {filteredMonsters.map(monster => (
          <li key={monster.index}>   
          <Link to={`/monsters/${monster.index}`}>{monster.name}</Link>         
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Monsters;
