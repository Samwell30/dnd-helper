import React, { useEffect, useState } from "react";
import axios from "axios";

const Features = () => {
    const [features, setFeatures] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    const [selectedFeature, setSelectedFeature] = useState(null);
    const [featureDetail, setFeatureDetail] = useState(null);
    const [featureDetailsCache, setFeatureDetailsCache] = useState({});
    const [search, setSearch] = useState("");

    useEffect(() => {
        async function fetchFeatures() {
            setIsLoading(true);
            setError(null);
            try {
                const { data } = await axios.get(
                    "https://www.dnd5eapi.co/api/2014/features"
                );
                setFeatures(data.results);
            } catch (err) {
                setError("Failed to load features.");
            }
            setIsLoading(false);
        }
        fetchFeatures();
    }, []);

    const handleSelect = async (feature) => {
        if (selectedFeature === feature.index) {
            setSelectedFeature(null);
            setFeatureDetail(null);
            return;
        }
        setSelectedFeature(feature.index);
        setFeatureDetail(null);

        if (featureDetailsCache[feature.index]) {
            setFeatureDetail(featureDetailsCache[feature.index]);
            return;
        }

        try {
            const { data } = await axios.get(
                `https://www.dnd5eapi.co/api/2014/features/${feature.index}`
            );
            setFeatureDetail(data);
            setFeatureDetailsCache((prev) => ({
                ...prev,
                [feature.index]: data,
            }));
        } catch {
            const fallback = {
                name: feature.name,
                desc: ["Failed to load details."],
            };
            setFeatureDetail(fallback);
            setFeatureDetailsCache((prev) => ({
                ...prev,
                [feature.index]: fallback,
            }));
        }
    };
    function normalizeFeatureKey(name) {
        // For features with parenthesis, use only the part before the parenthesis
        // For others, use the full name
        const match = name.match(/^(.+?)\s*\(.*\)$/);
        return match ? match[1].trim().toLowerCase() : name.toLowerCase();
    }
    const filteredFeatures = features.filter((f) =>
        f.name.toLowerCase().includes(search.toLowerCase())
    );
    const uniqueFeatures = [];
    const seen = new Set();
    for (const feature of filteredFeatures) {
        // Use both normalized name and class name (if present) as the key
        const className = feature.class ? feature.class.name.toLowerCase() : "";
        const key = `${normalizeFeatureKey(feature.name)}|${className}`;
        if (!seen.has(key)) {
            seen.add(key);
            uniqueFeatures.push(feature);
        }
    }
    return (
        <div className="section">
            <h1>Features</h1>
            <p>
                Browse and search D&D 5e class features. Click a feature for details.
            </p>
            <div className="input__container">
                <input
                    type="text"
                    placeholder="Search features..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            {isLoading ? (
                <p>Loading features...</p>
            ) : (
                <ul className="list__items">
                    {uniqueFeatures.map((feature, idx) => (
                        <React.Fragment key={feature.index}>
                            <li
                                className="list__item"
                                onClick={() => handleSelect(feature)}
                                style={{
                                    backgroundColor:
                                        idx % 2 === 0 ? "#fff" : "rgba(230,110,83,0.13)",
                                }}
                            >
                                {feature.name}
                                {/* Show class name if available */}
                                {feature.class && (
                                    <span style={{ color: "#888", marginLeft: 8 }}>
                                        ({feature.class.name})
                                    </span>
                                )}
                            </li>
                            {selectedFeature === feature.index && featureDetail && (
                                <li
                                    style={{
                                        background: "#f9f9f9",
                                        padding: "8px 16px",
                                        borderLeft: "4px solid #bdbdbd",
                                    }}
                                >
                                    <div className="equipment-detail">
                                        <strong>{featureDetail.name}</strong>
                                        <ul>
                                            {featureDetail.desc &&
                                                featureDetail.desc.map((desc, i) => (
                                                    <li key={i}>{desc}</li>
                                                ))}
                                        </ul>
                                    </div>
                                </li>
                            )}
                        </React.Fragment>
                    ))}
                </ul>
            )}
        </div>
    );
};

export default Features;
