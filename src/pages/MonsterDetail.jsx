import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import axios from "axios";

const MonsterDetail = () => {
  const { monsterIndex } = useParams(); // Get the monster index from the URL
  const [monster, setMonster] = useState(null);

  useEffect(() => {
    axios
      .get(`https://www.dnd5eapi.co/api/monsters/${monsterIndex}`)
      .then((response) => {
        setMonster(response.data); // Set the monster details
      })
      .catch((error) => {
        console.error("Error fetching monster details:", error);
      });
  }, [monsterIndex]);

  if (!monster) {
    return <div>Loading...</div>; // Show a loading message while fetching data
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
    <div>
      <Link to="/monsters" className="landing__link">
        <button className="btn">Back to Monsters</button>
      </Link>

      <h1>{monster.name}</h1>
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
      <div>
        <strong>Actions:</strong>
        {monster.actions && monster.actions.length > 0 ? (
          <ul>
            {monster.actions.map((action, index) => (
              <li key={index}>
                <strong>{action.name}:</strong> {action.desc}
              </li>
            ))}
          </ul>
        ) : (
          <p>No actions available.</p>
        )}
      </div>
    </div>
  );
};

export default MonsterDetail;
