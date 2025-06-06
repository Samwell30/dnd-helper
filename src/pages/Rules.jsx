import React, { useEffect, useState } from 'react';
import axios from 'axios';

const Rules = () => {
    const [sections, setSections] = useState([]);
    const [selected, setSelected] = useState(null);
    const [detail, setDetail] = useState(null);
    const [error, setError] = useState(null);
    // Fetch all rule sections
    useEffect(() => {
        async function fetchSections() {
            try {
                const { data } = await axios.get(
                    'https://www.dnd5eapi.co/api/rule-sections'
                );
                if (data && Array.isArray(data.results)) {
                    setSections(data.results);
                } else {
                    setSections([]);
                    setError('No rule sections found.');
                }
            } catch (err) {
                setError('Failed to load rule sections.');
            }
        }
        fetchSections();
    }, []);
    // Fetch detail when a section is selected
    useEffect(() => {
        if (!selected) {
            setDetail(null);
            return;
        }
        async function fetchDetail() {
            try {
                let data;
                try {
                    ({ data } = await axios.get(
                        `https://www.dnd5eapi.co/api/2014/rule-sections/${selected}`
                    ));
                } catch {
                    ({ data } = await axios.get(
                        `https://www.dnd5eapi.co/api/rule-sections/${selected}`
                    ));
                }
                setDetail(data);
            } catch (err) {
                setDetail({ name: 'Error', desc: ['Failed to load details.'] });
            }
        }
        fetchDetail();
    }, [selected]);

    return (
        <div className="section">
            <h1>Rules</h1>
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
                            fontWeight: selected === s.index ? 'bold' : 'normal',
                            color: selected === s.index ? '#e66e53' : undefined,
                        }}
                        onClick={() => setSelected(s.index)}
                    >
                        {s.name}
                    </li>
                ))}
            </ul>
            {detail && (
                <div className="ability__score__detail" style={{ marginTop: 24 }}>
                    <strong>{detail.name}</strong>
                    {Array.isArray(detail.desc)
                        ? detail.desc.map((p, i) => <p key={i}>{p}</p>)
                        : detail.desc && <p>{detail.desc}</p>}
                </div>
            )}
        </div>
    );
};

export default Rules;