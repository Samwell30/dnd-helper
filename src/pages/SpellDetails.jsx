import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';

const SpellDetails = () => {
  const { spellIndex } = useParams(); // Get the spell index from the URL
  const [spell, setSpell] = useState(null);

  useEffect(() => {
    axios.get(`https://www.dnd5eapi.co/api/spells/${spellIndex}`)
      .then(response => {
        setSpell(response.data); // Set the spell details
      })
      .catch(error => {
        console.error('Error fetching spell details:', error);
      });
  }, [spellIndex]);

  if (!spell) {
    return <div>Loading...</div>; // Show a loading message while fetching data
  }

  return (
    <div className='detail-page'>
      <h1>{spell.name} --- <span className='red'>Spell level</span> {spell.level}</h1>
      <p><strong>Description:</strong> {spell.desc?.join(' ')}</p>
      <p><strong>Range:</strong> {spell.range}</p>
      <p><strong>Duration:</strong> {spell.duration}</p>
      <p><strong>Casting Time:</strong> {spell.casting_time}</p>
        <Link to="/spells">
          <button className="btn__details">Back to Spells</button>
          </Link>
    </div>
  );
};

export default SpellDetails;