import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Classes = () => {
  const [classes, setClasses] = useState([]);
  const [spellcasting, setSpellcasting] = useState({});
  const [allRaces, setAllRaces] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedRace, setSelectedRace] = useState(null);
  const [raceDetail, setRaceDetail] = useState(null);
  const navigate = useNavigate();

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

    // Fetch all races
    async function fetchRaces() {
      try {
        // Try both endpoints for maximum compatibility
        let data;
        try {
          ({ data } = await axios.get(
            "https://www.dnd5eapi.co/api/2014/races"
          ));
        } catch {
          ({ data } = await axios.get("https://www.dnd5eapi.co/api/races"));
        }
        setAllRaces(data.results);
      } catch {}
    }
    fetchRaces();
  }, []);

  return (
    <div className="section">
      <h1>Classes</h1>
      <p>Here is where you can see a list of what character you can choose</p>
      {selectedRace && raceDetail && (
        <>
          <div
            style={{
              position: "fixed",
              top: 0,
              left: 0,
              width: "100vw",
              height: "100vh",
              background: "rgba(0,0,0,0.01)",
              zIndex: 1000,
            }}
            onClick={() => {
              setSelectedRace(null);
              setRaceDetail(null);
            }}
          />
          <div
            className="ability__score__detail race-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <strong>{raceDetail.name}</strong>
            {raceDetail.alignment && (
              <p>
                <strong>Alignment:</strong> {raceDetail.alignment}
              </p>
            )}
            {raceDetail.age && (
              <p>
                <strong>Age:</strong> {raceDetail.age}
              </p>
            )}
            {raceDetail.size && (
              <p>
                <strong>Size:</strong> {raceDetail.size}
              </p>
            )}
            {raceDetail.speed && (
              <p>
                <strong>Speed:</strong> {raceDetail.speed}
              </p>
            )}
            {raceDetail.language_desc && (
              <p>
                <strong>Languages:</strong> {raceDetail.language_desc}
              </p>
            )}
            {raceDetail.ability_bonuses &&
              raceDetail.ability_bonuses.length > 0 && (
                <p>
                  <strong>Ability Bonuses:</strong>{" "}
                  {raceDetail.ability_bonuses
                    .map((b) => `${b.ability_score.name} +${b.bonus}`)
                    .join(", ")}
                </p>
              )}
            {raceDetail.starting_proficiencies &&
              raceDetail.starting_proficiencies.length > 0 && (
                <p>
                  <strong>Proficiencies:</strong>{" "}
                  {raceDetail.starting_proficiencies
                    .map((p) => p.name)
                    .join(", ")}
                </p>
              )}
            {raceDetail.traits && raceDetail.traits.length > 0 && (
              <p>
                <strong>Traits:</strong>{" "}
                {raceDetail.traits.map((t) => t.name).join(", ")}
              </p>
            )}
            {raceDetail.subraces && raceDetail.subraces.length > 0 && (
              <p>
                <strong>Subraces:</strong>{" "}
                {raceDetail.subraces.map((s) => s.name).join(", ")}
              </p>
            )}
            {raceDetail.desc && (
              <ul>
                {raceDetail.desc.map((desc, i) => (
                  <li key={i}>{desc}</li>
                ))}
              </ul>
            )}
          </div>
        </>
      )}

      {error && <p style={{ color: "red" }}>{error}</p>}
      {isLoading && <p>Loading...</p>}
      <ul className="list__items">
        {classes.map((cls, idx) => (
          <li
            className="list__item"
            key={cls.index}
            onClick={() => navigate(`/classes/${cls.index}`)}
          >
            <span style={{ color: "inherit" }}>{cls.name}</span>
            {spellcasting[cls.index] && (
              <span style={{ color: "#e66e53", marginLeft: 8 }}>
                Spellcaster
              </span>
            )}
          </li>
        ))}
        {allRaces.length > 0 && (
          <div
            style={{
              color: "#555",
              fontSize: 15,
              display: "flex",
              flexWrap: "wrap",
              gap: 8,
              backgroundColor: "rgba(230,110,83,0.13)",
              padding: "1rem 1rem",
            }}
          >
            <strong style={{marginLeft: "2.2rem"}}>All Races:</strong>
            {allRaces.map((r) => (
              <span
                key={r.index}
                style={{
                  textDecoration: "underline",
                  color: selectedRace === r.index ? "#e66e53" : "#555",
                  cursor: "pointer",
                  fontWeight: selectedRace === r.index ? "bold" : "normal",
                  background:
                    selectedRace === r.index ? "rgba(230,110,83,0.13)" : "none",
                  borderRadius: 4,
                  padding: "2px 6px",
                  transition: "background 0.2s",
                }}
                onClick={async () => {
                  if (selectedRace === r.index) {
                    setSelectedRace(null);
                    setRaceDetail(null);
                    return;
                  }
                  setSelectedRace(r.index);
                  setRaceDetail(null);
                  try {
                    let data;
                    try {
                      ({ data } = await axios.get(
                        `https://www.dnd5eapi.co/api/2014/races/${r.index}`
                      ));
                    } catch {
                      ({ data } = await axios.get(
                        `https://www.dnd5eapi.co/api/races/${r.index}`
                      ));
                    }
                    setRaceDetail(data);
                  } catch {
                    setRaceDetail({
                      name: r.name,
                      desc: ["Failed to load details."],
                    });
                  }
                }}
              >
                {r.name}
              </span>
            ))}
          </div>
        )}
      </ul>
    </div>
  );
};

export default Classes;
