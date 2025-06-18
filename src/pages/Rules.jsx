import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Rules = () => {
  const [sections, setSections] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState({});
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [conditions, setConditions] = useState([]);
  const [condLoading, setCondLoading] = useState(false);
  const [condError, setCondError] = useState(null);
  const [condDetail, setCondDetail] = useState({});
  const [condOpen, setCondOpen] = useState(null);
  const [damageTypes, setDamageTypes] = useState([]);
  const [damageLoading, setDamageLoading] = useState(false);
  const [damageError, setDamageError] = useState(null);
  const [damageDetail, setDamageDetail] = useState({});
  const [damageOpen, setDamageOpen] = useState(null);
  const [magicSchools, setMagicSchools] = useState([]);
  const [magicLoading, setMagicLoading] = useState(false);
  const [magicError, setMagicError] = useState(null);
  const [magicDetail, setMagicDetail] = useState({});
  const [magicOpen, setMagicOpen] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function fetchSections() {
      setLoading(true);
      try {
        const { data } = await axios.get(
          "https://www.dnd5eapi.co/api/rule-sections"
        );
        if (data && Array.isArray(data.results)) {
          setSections(data.results);
          setError(null);
        } else {
          setSections([]);
          setError("No rule sections found.");
        }
      } catch (err) {
        setSections([]);
        setError("Failed to load rule sections.");
      } finally {
        setLoading(false);
      }
    }
    fetchSections();
  }, []);

  const handleMouseEnter = async (index) => {
    setHoveredIndex(index);
    if (preview[index]) return;
    try {
      const { data } = await axios.get(
        `https://www.dnd5eapi.co/api/rule-sections/${index}`
      );
      let firstSentence = "";
      if (Array.isArray(data.desc) && data.desc.length > 0) {
        firstSentence = data.desc[0].split(". ")[0] + ".";
      } else if (typeof data.desc === "string") {
        firstSentence = data.desc.split(". ")[0] + ".";
      }
      setPreview((prev) => ({ ...prev, [index]: firstSentence }));
    } catch (err) {
      setPreview((prev) => ({ ...prev, [index]: "No preview available." }));
    }
  };
  const handleMouseLeave = () => setHoveredIndex(null);

  useEffect(() => {
    async function fetchConditions() {
      setCondLoading(true);
      try {
        const { data } = await axios.get(
          "https://www.dnd5eapi.co/api/conditions"
        );
        if (data && Array.isArray(data.results)) {
          setConditions(data.results);
          setCondError(null);
        } else {
          setConditions([]);
          setCondError("No conditions found.");
        }
      } catch (err) {
        setConditions([]);
        setCondError("Failed to load conditions.");
      } finally {
        setCondLoading(false);
      }
    }
    fetchConditions();
  }, []);

  const handleCondClick = async (cond) => {
    if (condOpen === cond.index) {
      setCondOpen(null);
      return;
    }
    setCondOpen(cond.index);
    if (condDetail[cond.index]) return;
    try {
      const { data } = await axios.get(
        `https://www.dnd5eapi.co/api/conditions/${cond.index}`
      );
      setCondDetail((prev) => ({ ...prev, [cond.index]: data }));
    } catch (err) {
      setCondDetail((prev) => ({
        ...prev,
        [cond.index]: { desc: ["Failed to load detail."] },
      }));
    }
  };

  useEffect(() => {
    async function fetchDamageTypes() {
      setDamageLoading(true);
      try {
        const { data } = await axios.get(
          "https://www.dnd5eapi.co/api/damage-types"
        );
        if (data && Array.isArray(data.results)) {
          setDamageTypes(data.results);
          setDamageError(null);
        } else {
          setDamageTypes([]);
          setDamageError("No damage types found.");
        }
      } catch (err) {
        setDamageTypes([]);
        setDamageError("Failed to load damage types.");
      } finally {
        setDamageLoading(false);
      }
    }
    fetchDamageTypes();
  }, []);

  const handleDamageClick = async (dmg) => {
    if (damageOpen === dmg.index) {
      setDamageOpen(null);
      return;
    }
    setDamageOpen(dmg.index);
    if (damageDetail[dmg.index]) return;
    try {
      const { data } = await axios.get(
        `https://www.dnd5eapi.co/api/damage-types/${dmg.index}`
      );
      setDamageDetail((prev) => ({ ...prev, [dmg.index]: data }));
    } catch (err) {
      setDamageDetail((prev) => ({
        ...prev,
        [dmg.index]: { desc: ["Failed to load detail."] },
      }));
    }
  };

  useEffect(() => {
    async function fetchMagicSchools() {
      setMagicLoading(true);
      try {
        const { data } = await axios.get(
          "https://www.dnd5eapi.co/api/magic-schools"
        );
        if (data && Array.isArray(data.results)) {
          setMagicSchools(data.results);
          setMagicError(null);
        } else {
          setMagicSchools([]);
          setMagicError("No magic schools found.");
        }
      } catch (err) {
        setMagicSchools([]);
        setMagicError("Failed to load magic schools.");
      } finally {
        setMagicLoading(false);
      }
    }
    fetchMagicSchools();
  }, []);

  const handleMagicClick = async (school) => {
    if (magicOpen === school.index) {
      setMagicOpen(null);
      return;
    }
    setMagicOpen(school.index);
    if (magicDetail[school.index]) return;
    try {
      const { data } = await axios.get(
        `https://www.dnd5eapi.co/api/magic-schools/${school.index}`
      );
      setMagicDetail((prev) => ({ ...prev, [school.index]: data }));
    } catch (err) {
      setMagicDetail((prev) => ({
        ...prev,
        [school.index]: { desc: ["Failed to load detail."] },
      }));
    }
  };

  return (
    <div className="section">
      <h1>Rules</h1>
      <p>
        Here you will see the list of rules that are
        involved in DND.
      </p>
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul className="list__items">
        {sections.length === 0 && !error && <li>No rule sections found.</li>}
        {sections.map((s) => (
          <li
            key={s.index}
            className="list__item"
            style={{
            }}
            onClick={() => navigate(`/rules/${s.index}`)}
            onMouseEnter={() => handleMouseEnter(s.index)}
            onMouseLeave={handleMouseLeave}
          >
            <div style={{ display: "flex", flexDirection: "column" }}>
              <span>{s.name}</span>
              {hoveredIndex === s.index && preview[s.index] && (
                <span
                  style={{ color: "#666", fontSize: "0.95em", marginTop: 2 }}
                >
                  {preview[s.index]}
                </span>
              )}
            </div>
          </li>
        ))}
      </ul>
      <h1 className="section-header section-header--conditions">Conditions</h1>
      {condLoading && <p>Loading conditions...</p>}
      {condError && <p style={{ color: "red" }}>{condError}</p>}
      <ul className="list__items">
        {conditions.map((cond) => (
          <React.Fragment key={cond.index}>
            <li
              className="list__item"
              style={{
                fontWeight: condOpen === cond.index ? "bold" : "normal",
              }}
              onClick={() => handleCondClick(cond)}
            >
              {cond.name}
            </li>
            {condOpen === cond.index && condDetail[cond.index] && (
              <div
                className="inline-detail"
                style={{ marginTop: "10px", fontSize: "0.9rem" }}
              >
                {condDetail[cond.index].desc &&
                  condDetail[cond.index].desc.map((d, i) => <p key={i}>{d}</p>)}
              </div>
            )}
          </React.Fragment>
        ))}
      </ul>
      <h1 className="section-header section-header--damage">Damage Types</h1>
      {damageLoading && <p>Loading damage types...</p>}
      {damageError && <p style={{ color: "red" }}>{damageError}</p>}
      <ul className="list__items">
        {damageTypes.map((dmg) => (
          <React.Fragment key={dmg.index}>
            <li
              className="list__item"
              style={{
                cursor: "pointer",
                fontWeight: damageOpen === dmg.index ? "bold" : "normal",
              }}
              onClick={() => handleDamageClick(dmg)}
            >
              {dmg.name}
            </li>
            {damageOpen === dmg.index && damageDetail[dmg.index] && (
              <div
                className="inline-detail"
                style={{ marginTop: "10px", fontSize: "0.9rem" }}
              >
                {damageDetail[dmg.index].desc &&
                  damageDetail[dmg.index].desc.map((d, i) => (
                    <p key={i}>{d}</p>
                  ))}
              </div>
            )}
          </React.Fragment>
        ))}
      </ul>
      <h1 className="section-header section-header--magic">Magic Schools</h1>
      {magicLoading && <p>Loading magic schools...</p>}
      {magicError && <p style={{ color: "red" }}>{magicError}</p>}
      <ul className="list__items">
        {magicSchools.map((school) => (
          <React.Fragment key={school.index}>
            <li
              className="list__item"
              style={{
                cursor: "pointer",
                fontWeight: magicOpen === school.index ? "bold" : "normal",
              }}
              onClick={() => handleMagicClick(school)}
            >
              {school.name}
            </li>
            {magicOpen === school.index && magicDetail[school.index] && (
              <div
                className="inline-detail"
                style={{ marginTop: "10px", fontSize: "0.9rem" }}
              >
                {magicDetail[school.index].desc &&
                  (Array.isArray(magicDetail[school.index].desc) ? (
                    magicDetail[school.index].desc.map((d, i) => (
                      <p key={i}>{d}</p>
                    ))
                  ) : (
                    <p>{magicDetail[school.index].desc}</p>
                  ))}
              </div>
            )}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};

export default Rules;
