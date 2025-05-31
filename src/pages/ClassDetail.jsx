import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const ClassDetail = () => {
    const { classIndex } = useParams();
    const navigate = useNavigate();
    const [classData, setClassData] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        async function fetchClassDetail() {
            setIsLoading(true);
            setError(null);
            try {
                const { data } = await axios.get(`https://www.dnd5eapi.co/api/classes/${classIndex}`);
                setClassData(data);
            } catch (err) {
                setError("Failed to load class details.");
            }
            setIsLoading(false);
        }
        fetchClassDetail();
    }, [classIndex]);

    const handleEquipmentProficiencyClick = (prof) => {
        const category = prof.name;
        navigate('/equipment', { state: { category } });
    };

    if (isLoading) return <div className="section"><p>Loading...</p></div>;
    if (error) return <div className="section"><p style={{ color: "red" }}>{error}</p></div>;
    if (!classData) return null;

    return (
        <div className="section">
            <h1>{classData.name}</h1>
            <p><strong>Hit Die:</strong> d{classData.hit_die}</p>
            {classData.proficiencies && (
                <>
                    <div style={{ fontWeight: 'bold', marginBottom: '0.5em' }}>Proficiencies:</div>
                    <ul className="list__items">
                        {classData.proficiencies.map((prof) => {
                            const isEquipment = prof.index && (
                                prof.index.includes("armor") ||
                                prof.index.includes("weapon") ||
                                prof.index.includes("tools") ||
                                prof.index.includes("shield")
                            );
                            return (
                                <li
                                    className="list__item"
                                    key={prof.index}
                                    {...(isEquipment ? {
                                        onClick: () => handleEquipmentProficiencyClick(prof),
                                        
                                    } : {})}
                                >
                                    {prof.name}
                                </li>
                            );
                        })}
                    </ul>
                </>
            )}
            {/* Add more details as needed */}
        </div>
    );
};

export default ClassDetail;
