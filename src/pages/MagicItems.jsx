import React, { useEffect, useState } from "react";
import axios from "axios";

const MagicItemList = () => {
  const [magicItems, setMagicItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [rarityFilter, setRarityFilter] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);



  async function fetchMagicItems() {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        "https://www.dnd5eapi.co/api/2014/magic-items"
      );

      const detailPromises = data.results.map((item) =>
        axios.get(`https://www.dnd5eapi.co/api/2014/magic-items/${item.index}`)
      );

      const responses = await Promise.all(detailPromises);
      const detailedItems = responses.map((res) => res.data);

      setMagicItems(detailedItems);
    } catch (error) {
      console.error("Error fetching magic items:", error);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchMagicItems();
  }, []);

  const filteredItems = magicItems.filter((item) => {
    const nameMatch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const rarityMatch =
      rarityFilter === "" ||
      (item.rarity?.name || "").toLowerCase() === rarityFilter.toLowerCase();
    return nameMatch && rarityMatch;
  });

  return (
    <div className="section">
      <h1>Magic Items</h1>
      <p>Click an item to expand. Search or filter below.</p>

      <div className="input__container">
        <input
          type="text"
          placeholder="Search magic items…"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <select
          value={rarityFilter}
          onChange={(e) => setRarityFilter(e.target.value)}
        >
          <option value="">All Rarities</option>
          <option value="common">Common</option>
          <option value="uncommon">Uncommon</option>
          <option value="rare">Rare</option>
          <option value="very rare">Very Rare</option>
          <option value="legendary">Legendary</option>
          <option value="artifact">Artifact</option>
        </select>
      </div>

      {isLoading ? (
        <p>Loading magic items…</p>
      ) : (
        <ul className="list__items">
          {filteredItems.map((item) => (
            <li
              key={item.index}
              className="list__item"
              onClick={() =>
                setExpandedIndex(
                  expandedIndex === item.index ? null : item.index
                )
              }
              style={{ cursor: "pointer" }}
            >
              <div>{item.name}</div>

              {expandedIndex === item.index && (
                <div className="equipment-detail">
                  {item.rarity?.name && (
                    <p>
                      <strong>Rarity:</strong> {item.rarity.name}
                    </p>
                  )}
                  {item.equipment_category?.name && (
                    <p>
                      <strong>Category:</strong>{" "}
                      {item.equipment_category.name}
                    </p>
                  )}
                  {item.variant && (
                    <p>
                      <em>This is a variant magic item.</em>
                    </p>
                  )}
                  {item.requires_attunement && (
                    <p>
                      <strong>Requires Attunement:</strong>{" "}
                      {item.requires_attunement}
                    </p>
                  )}
                  {item.desc?.length > 0 && (
                    <p>{item.desc.join(" ")}</p>
                  )}
                  {item.properties?.length > 0 && (
                    <p>
                      <strong>Properties:</strong>{" "}
                      {item.properties.map((p) => p.name).join(", ")}
                    </p>
                  )}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MagicItemList;
