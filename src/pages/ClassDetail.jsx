import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import ClassFeatures from "./ClassFeatures"; // Adjust the import path as necessary

const ClassDetail = () => {
  const { classIndex } = useParams();
  const navigate = useNavigate();
  const [classData, setClassData] = useState(null);
  const [abilityScores, setAbilityScores] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedAbilityScore, setSelectedAbilityScore] = useState(null);
  const [abilityScoreDetail, setAbilityScoreDetail] = useState(null);
  const detailRef = useRef();

  useEffect(() => {
    async function fetchClassDetail() {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(
          `https://www.dnd5eapi.co/api/classes/${classIndex}`
        );
        setClassData(data);
        const abilityRes = await axios.get(
          "https://www.dnd5eapi.co/api/ability-scores"
        );
        setAbilityScores(abilityRes.data.results);
      } catch (err) {
        setError("Failed to load class details.");
      }
      setIsLoading(false);
    }
    fetchClassDetail();
  }, [classIndex]);

  useEffect(() => {
    if (!selectedAbilityScore) return;
    function handleClick(event) {
      if (detailRef.current && !detailRef.current.contains(event.target)) {
        setSelectedAbilityScore(null);
        setAbilityScoreDetail(null);
      }
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [selectedAbilityScore]);

  const handleEquipmentProficiencyClick = (prof) => {
    navigate("/equipment");
  };

  if (isLoading)
    return (
      <div className="section">
        <p>Loading...</p>
      </div>
    );
  if (error)
    return (
      <div className="section">
        <p style={{ color: "red" }}>{error}</p>
      </div>
    );
  if (!classData) return null;

  return (
    <div
      className="section"
      style={{
        position: "relative",
        paddingBottom: selectedAbilityScore ? 180 : undefined,
      }}
    >
      <h1>{classData.name}</h1>
      <p>
        <strong>Hit Die:</strong> d{classData.hit_die}
      </p>
      {classData.proficiencies && (
        <>
          <div style={{ fontWeight: "bold", marginBottom: "0.5em" }}>
            Proficiencies:
          </div>
          <ul className="list__items">
            {classData.proficiencies.map((prof) => {
              const isEquipment =
                prof.index &&
                (prof.index.includes("armor") ||
                  prof.index.includes("weapon") ||
                  prof.index.includes("tools") ||
                  prof.index.includes("shield"));
              return (
                <li
                  className="list__item"
                  key={prof.index}
                  {...(isEquipment
                    ? {
                      onClick: () => handleEquipmentProficiencyClick(prof),
                    }
                    : {})}
                >
                  {prof.name}
                </li>
              );
            })}
          </ul>
        </>
      )}
      {abilityScores.length > 0 && (
        <div>
          <div
            style={{ textAlign: "center", fontWeight: "bold", padding: "20px" }}
          >
            Ability Scores:
          </div>
          <ul
            style={{
              display: "flex",
              gap: "1em",
              flexWrap: "wrap",
              padding: 0,
              alignItems: "flex-start",
            }}
          >
            {abilityScores.map((score) => (
              <li
                style={{ position: "relative" }}
                className="list__item ability__score"
                key={score.index}
                onClick={async () => {
                  if (selectedAbilityScore === score.index) {
                    setSelectedAbilityScore(null);
                    setAbilityScoreDetail(null);
                    return;
                  }
                  setSelectedAbilityScore(score.index);
                  setAbilityScoreDetail(null);
                  try {
                    const { data } = await axios.get(
                      `https://www.dnd5eapi.co/api/ability-scores/${score.index}`
                    );
                    setAbilityScoreDetail(data);
                  } catch {
                    setAbilityScoreDetail({
                      name: score.name,
                      desc: ["Failed to load details."],
                    });
                  }
                }}
              >
                {score.name}
                {selectedAbilityScore === score.index && (
                  <div
                    ref={detailRef}
                    className="ability__score__detail"
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: "50%",
                      transform: "translateX(-50%)",
                      zIndex: 10,
                      background: "#fff",
                      border: "1px solid #ccc",
                      borderRadius: 8,
                      boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                      padding: 16,
                      width: 900,
                      marginTop: 8,
                    }}
                  >
                    {abilityScoreDetail ? (
                      <>
                        <strong>
                          {abilityScoreDetail.full_name ||
                            abilityScoreDetail.name}
                        </strong>
                        <ul style={{ paddingLeft: 18 }}>
                          {abilityScoreDetail.desc &&
                            abilityScoreDetail.desc.map((desc, i) => (
                              <li key={i}>{desc}</li>
                            ))}
                        </ul>
                      </>
                    ) : (
                      <span>Loading...</span>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
      <ClassFeatures classIndex={classIndex} />
      {classData.spellcasting && (
        <div className="section">
          <div style={{ fontWeight: "bold", marginBottom: "0.5em" }}>
            Spellcasting
          </div>
          <p>
            <strong>Spellcasting Ability:</strong>{" "}
            {classData.spellcasting.spellcasting_ability?.name}
            {classData.spellcasting && (
              <button
                style={{ marginLeft: 12 }}
                className="btn__details"
                onClick={() => navigate(`/classes/${classIndex}/spells`)}
              >
                View {classData.name} Spells
              </button>
            )}
          </p>
          {classData.spellcasting.info && (
            <ul className="list__items">
              {classData.spellcasting.info.map((info, idx) => (
                <li className="list__item" key={idx}>
                  <strong>{info.name}:</strong>{" "}
                  {info.desc &&
                    info.desc.map((desc, i) => (
                      <span key={i}>
                        {desc}
                        <br />
                      </span>
                    ))}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <button className="btn__details" onClick={() => navigate("/classes")}>
        Back to Classes
      </button>
    </div>
  );
};

export default ClassDetail;
