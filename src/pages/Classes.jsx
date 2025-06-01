import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [spellcasting, setSpellcasting] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // Fetch list of classes
  useEffect(() => {
    async function fetchClasses() {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await axios.get("https://www.dnd5eapi.co/api/classes");
        setClasses(data.results);

        // Fetch spellcasting info for each class in parallel
        const spellPromises = data.results.map(async (cls) => {
          const { data: classData } = await axios.get(
            `https://www.dnd5eapi.co/api/classes/${cls.index}`
          );
          return {
            index: cls.index,
            spellcasting: classData.spellcasting ? true : false,
          };
        });

        const spellResults = await Promise.all(spellPromises);
        const spellMap = {};
        spellResults.forEach((item) => {
          spellMap[item.index] = item.spellcasting;
        });
        setSpellcasting(spellMap);
      } catch (err) {
        setError("Failed to load classes.");
      }
      setIsLoading(false);
    }
    fetchClasses();
  }, []);

  return (
    <div className="section">
      <h1>Classes</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}
      {isLoading && <p>Loading...</p>}
      <ul className="list__items">
        {classes.map((cls) => (
          <li className="list__item" key={cls.index}>
            <Link to={`/classes/${cls.index}`}>{cls.name}</Link>
            {spellcasting[cls.index] && (
              <span style={{ marginLeft: 8, color: "purple" }}>
                (Spellcaster)
              </span>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Classes;