import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { Link } from "react-router-dom";

const RuleDetail = () => {
  const { index } = useParams();
  const navigate = useNavigate();
  const [detail, setDetail] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchDetail() {
      setLoading(true);
      try {
        const { data } = await axios.get(
          `https://www.dnd5eapi.co/api/rule-sections/${index}`
        );
        setDetail(data);
        setError(null);
      } catch (err) {
        setError("Failed to load rule detail.");
      } finally {
        setLoading(false);
      }
    }
    fetchDetail();
  }, [index]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!detail) return null;

  return (
    <div className="detail__page">
      <h1>{detail.name}</h1>
      <div className="details">
        {Array.isArray(detail.desc) && detail.desc.length > 0 ? (
          detail.desc.map((p, i) => <p key={i}>{p}</p>)
        ) : detail.desc ? (
          <p>{detail.desc}</p>
        ) : (
          <p style={{ color: "gray" }}>
            <em>No description available.</em>
          </p>
        )}
          <Link to="/rules">
            <button className="btn__details">Back to Rules</button>
          </Link>
      </div>
    </div>
  );
};

export default RuleDetail;
