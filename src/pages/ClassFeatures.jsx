import React, { useEffect, useState } from "react";
import axios from "axios";

const ClassFeatures = ({ classIndex }) => {
  const [features, setFeatures] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedFeature, setSelectedFeature] = useState(null);
  const [featureDetail, setFeatureDetail] = useState(null);
  const [featureDetailsCache, setFeatureDetailsCache] = useState({});

  useEffect(() => {
    async function fetchFeatures() {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(
          `https://www.dnd5eapi.co/api/2014/classes/${classIndex}/features`
        );
        setFeatures(data.results);
      } catch (err) {
        setError("Failed to load features for this class.");
      }
      setIsLoading(false);
    }
    fetchFeatures();
  }, [classIndex]);

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
    const match = name.match(/^(.+?)\s*\(.*\)$/);
    return match ? match[1].trim().toLowerCase() : name.toLowerCase();
  }
  const uniqueFeatures = [];
  const seen = new Set();
  for (const feature of features) {
    const key = normalizeFeatureKey(feature.name);
    if (!seen.has(key)) {
      seen.add(key);
      uniqueFeatures.push(feature);
    }
  }

  return (
    <div className="section">
      <h2 style={{ marginBottom: 16 }}>Class Features</h2>
      {isLoading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}
      <ul
        className="list__items class-features-list"
        style={{
          width: "50vw",
          maxWidth: 750,
          minWidth: 320,
          margin: 0,
          padding: 0,
        }}
      >
        {uniqueFeatures.map((feature, idx) => (
          <React.Fragment key={feature.index}>
            <li onClick={() => handleSelect(feature)}>{feature.name}</li>
            {selectedFeature === feature.index && featureDetail && (
              <li>
                <div className="inline-detail">
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
      </ul>{" "}
    </div>
  );
};

export default ClassFeatures;
