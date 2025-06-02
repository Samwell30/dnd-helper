import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ClassDetail = () => {
    const { classIndex } = useParams();
    const navigate = useNavigate();
    const [classData, setClassData] = useState(null);
    const [abilityScores, setAbilityScores] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedAbilityScore, setSelectedAbilityScore] = useState(null);
    const [abilityScoreDetail, setAbilityScoreDetail] = useState(null);

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

    const handleEquipmentProficiencyClick = (prof) => {
        const category = prof.name;
        navigate("/equipment", { state: { category } });
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
        <div className="section">
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
                                style={{ position: "relative", cursor: "pointer" }}
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
                                    <div className="ability__score__detail">
                                        {abilityScoreDetail ? (
                                            <>
                                                <strong>
                                                    {abilityScoreDetail.full_name ||
                                                        abilityScoreDetail.name}
                                                </strong>
                                                <ul>
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
            {classData.spellcasting && (
                <div className="section">
                    <div style={{ fontWeight: "bold", marginBottom: "0.5em" }}>
                        Spellcasting
                    </div>
                    <p>
                        <strong>Spellcasting Ability:</strong>{" "}
                        {classData.spellcasting.spellcasting_ability?.name}
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
            {/* Add more details as needed */}
        </div>
    );
};

export default ClassDetail;
