import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Classes = () => {
  const [classes, setClasses] = useState([]);
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
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Classes;