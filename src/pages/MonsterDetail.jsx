import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const MonsterDetail = () => {
  const { monsterIndex } = useParams(); // Get the monster index from the URL
  const [monster, setMonster] = useState(null);


  async function fetchMonster() {
    const { data } = await axios.get(
      `https://www.dnd5eapi.co/api/monsters/${monsterIndex}`
    );
    setMonster(data);
  }

  useEffect(() => {
    fetchMonster();
  }, []);

  if (!monster) {
    return <div className="loading__container">Loading...</div>; // Show a loading message while fetching data
  }

  const renderSpeed = () => {
    if (typeof monster.speed === "object") {
      return Object.entries(monster.speed)
        .map(([type, value]) => `${type}: ${value}`)
        .join(", ");
    }
    return monster.speed; 
  };

  return (
    <div className="detail__page">
      <h1>{monster.name} -- CR:{monster.challenge_rating}</h1>
      <div className="details">
      <p>
        <strong>Size:</strong> {monster.size}
      </p>
      <p>
        <strong>HP:</strong> {monster.hit_points}
      </p>
      <p>
        <strong>Speed:</strong> {renderSpeed()}
      </p>
      <p>
        <strong>Armor:</strong>{" "}
        {Array.isArray(monster.armor_class)
          ? monster.armor_class.map((ac) => ac.value).join(", ")
          : monster.armor_class}
      </p>
        <strong>Actions:</strong>
        {monster.actions && monster.actions.length > 0 ? (
          <ul>
            {monster.actions.map((action, index) => (
              <li key={index}>
                <strong><span>{action.name}</span>:</strong> {action.desc}
              </li>
            ))}
          </ul>
        ) : (
          <p>No actions available.</p>
        )}
      <Link to="/monsters" >
        <button className="btn__details">Back to Monsters</button>
      </Link>
      </div>
    </div>
  );
};

export default MonsterDetail;
