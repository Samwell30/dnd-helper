import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Rules = () => {
    const [sections, setSections] = useState([]);
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);
    const [preview, setPreview] = useState({});
    const [hoveredIndex, setHoveredIndex] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        async function fetchSections() {
            setLoading(true);
            try {
                const { data } = await axios.get(
                    'https://www.dnd5eapi.co/api/rule-sections'
                );
                console.log('Sections API response:', data);
                if (data && Array.isArray(data.results)) {
                    setSections(data.results);
                    setError(null);
                } else {
                    setSections([]);
                    setError('No rule sections found.');
                }
            } catch (err) {
                console.error('Error fetching sections:', err);
                setSections([]);
                setError('Failed to load rule sections.');
            } finally {
                setLoading(false);
            }
        }
        fetchSections();
    }, []);

    // Fetch preview on hover
    const handleMouseEnter = async (index) => {
        setHoveredIndex(index);
        if (preview[index]) return; // Already fetched
        try {
            const { data } = await axios.get(
                `https://www.dnd5eapi.co/api/rule-sections/${index}`
            );
            let firstSentence = '';
            if (Array.isArray(data.desc) && data.desc.length > 0) {
                firstSentence = data.desc[0].split('. ')[0] + '.';
            } else if (typeof data.desc === 'string') {
                firstSentence = data.desc.split('. ')[0] + '.';
            }
            setPreview((prev) => ({ ...prev, [index]: firstSentence }));
        } catch (err) {
            setPreview((prev) => ({ ...prev, [index]: 'No preview available.' }));
        }
    };
    const handleMouseLeave = () => setHoveredIndex(null);

    return (
        <div className="section">
            <h1>Rules</h1>
            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}
            <ul className="list__items">
                {sections.length === 0 && !error && (
                    <li>No rule sections found.</li>
                )}
                {sections.map((s) => (
                    <li
                        key={s.index}
                        className="list__item"
                        style={{
                            cursor: 'pointer',
                        }}
                        onClick={() => navigate(`/rules/${s.index}`)}
                        onMouseEnter={() => handleMouseEnter(s.index)}
                        onMouseLeave={handleMouseLeave}
                    >
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <span style={{ fontWeight: 'bold' }}>{s.name}</span>
                            {hoveredIndex === s.index && preview[s.index] && (
                                <span style={{ color: '#666', fontSize: '0.95em', marginTop: 2 }}>
                                    {preview[s.index]}
                                </span>
                            )}
                        </div>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default Rules;