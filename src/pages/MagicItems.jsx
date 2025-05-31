import React, { useEffect, useState } from "react";
import axios from "axios";

const MagicItemList = () => {
  const [magicItems, setMagicItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [rarityFilter, setRarityFilter] = useState("");
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  async function fetchMagicItems() {
    setIsLoading(true);
    setError(null);
    try {
      const { data } = await axios.get(
        "https://www.dnd5eapi.co/api/magic-items"
      );

      const detailPromises = data.results.map((item) =>
        axios.get(`https://www.dnd5eapi.co/api/magic-items/${item.index}`)
      );

      const responses = await Promise.all(detailPromises);
      const detailedItems = responses.map((res) => res.data);

      setMagicItems(detailedItems);
    } catch (error) {
      setError("Error fetching magic items. Please try again later.");
      console.error("Error fetching magic items:", error);
      throw error; // So useEffect's catch runs
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    async function loadMagicItems() {
      setIsLoading(true);
      setError(null);
      try {
        await fetchMagicItems();
        setUsingMockData(false);
      } catch (error) {
        // If API fails, use mock data
        setMagicItems([
          {
            index: "mock-item-1",
            name: "Mock Magic Sword",
            rarity: { name: "Rare" },
            equipment_category: { name: "Weapon" },
            variant: false,
            requires_attunement: "Yes",
            desc: ["A magical sword with mysterious powers."],
            properties: [{ name: "Sharp" }]
          },
          {
            index: "mock-item-2",
            name: "Mock Cloak of Invisibility",
            rarity: { name: "Legendary" },
            equipment_category: { name: "Wondrous Item" },
            variant: false,
            requires_attunement: "Yes",
            desc: ["This cloak renders the wearer invisible."],
            properties: [{ name: "Invisible" }]
          }
        ]);
        setUsingMockData(true);
        setError(null); // Don't show the red error if using mock data
      }
      setIsLoading(false);
    }

    loadMagicItems();
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
      {usingMockData && (
        <p style={{ color: "#ec1111" }}>
          The D&D 5e API is currently unavailable. Showing mock data.
        </p>
      )}
      {!usingMockData && error && (
        <p style={{ color: "red" }}>{error}</p>
      )}
      {isLoading ? (
        <p>Loading magic items…</p>
      ) : (
        <>
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
        </>
      )}
    </div>
  );
};

export default MagicItemList;