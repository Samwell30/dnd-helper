import React, { useEffect, useState } from 'react';
import { Link, useParams, useLocation } from 'react-router-dom';
import axios from 'axios';

const SpellDetails = () => {
  const { spellIndex } = useParams(); // Get the spell index from the URL
  const location = useLocation();
  const [spell, setSpell] = useState(null);

  useEffect(() => {
    async function fetchSpells() {
      const { data } = await axios.get(
        `https://www.dnd5eapi.co/api/spells/${spellIndex}`
      );
      setSpell(data);
    }
    fetchSpells();
  }, [spellIndex]);

  if (!spell) {
    return <div className="loading__container">Loading...</div>;
  }

  return (
    <div className='detail__page'>
      <h1>{spell.name} <span> --- Spell level</span> {spell.level}</h1>
      <div className='details'>
        <p><strong>Description:</strong> {spell.desc?.join(' ')}</p>
        <p><strong>Range:</strong> {spell.range}</p>
        <p><strong>Duration:</strong> {spell.duration}</p>
        <p><strong>Casting Time:</strong> {spell.casting_time}</p>
        {location.state && location.state.fromClass ? (
          <Link to={`/classes/${location.state.fromClass}/spells`}>
            <button className="btn__details">Back to {location.state.fromClass.charAt(0).toUpperCase() + location.state.fromClass.slice(1)} Spells</button>
          </Link>
        ) : (
          <Link to="/spells">
            <button className="btn__details">Back to Spells</button>
          </Link>
        )}
      </div>
    </div>
  );
};

export default SpellDetails;