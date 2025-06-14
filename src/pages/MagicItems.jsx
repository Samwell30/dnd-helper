import React, { useEffect, useState } from "react";
import axios from "axios";

const MagicItemList = () => {
  const [magicItems, setMagicItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(null);
  const [error, setError] = useState(null);
  const [usingMockData, setUsingMockData] = useState(false);

  useEffect(() => {
    async function loadMagicItems() {
      setIsLoading(true);
      setError(null);
      try {
        const { data } = await axios.get(
          "https://www.dnd5eapi.co/api/2014/magic-items"
        );
        setMagicItems(data.results); 
        setUsingMockData(false);
      } catch (error) {
        setMagicItems([
          {
            index: "mock-item-1",
            name: "Mock Magic Sword",
            rarity: { name: "Rare" },
            equipment_category: { name: "Weapon" },
            variant: false,
            requires_attunement: "Yes",
            desc: ["A magical sword with mysterious powers."],
            properties: [{ name: "Sharp" }],
          },
          {
            index: "mock-item-2",
            name: "Mock Cloak of Invisibility",
            rarity: { name: "Legendary" },
            equipment_category: { name: "Wondrous Item" },
            variant: false,
            requires_attunement: "Yes",
            desc: ["This cloak renders the wearer invisible."],
            properties: [{ name: "Invisible" }],
          },
        ]);
        setUsingMockData(true);
        setError(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadMagicItems();
  }, []);

  const [itemDetails, setItemDetails] = useState({});
  const handleExpand = async (item) => {
    if (expandedIndex === item.index) {
      setExpandedIndex(null);
      return;
    }
    setExpandedIndex(item.index);
    if (!itemDetails[item.index]) {
      try {
        const { data } = await axios.get(
          `https://www.dnd5eapi.co/api/2014/magic-items/${item.index}`
        );
        setItemDetails((prev) => ({ ...prev, [item.index]: data }));
      } catch (err) {
        setItemDetails((prev) => ({
          ...prev,
          [item.index]: { error: "Failed to load details." },
        }));
      }
    }
  };

  const filteredItems = magicItems.filter((item) => {
    return item.name.toLowerCase().includes(searchTerm.toLowerCase());
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
      {!usingMockData && error && <p style={{ color: "red" }}>{error}</p>}
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
          </div>
          <ul className="list__items">
            {filteredItems.map((item, idx) => (
              <React.Fragment key={item.index}>
                <li
                  role="button"
                  className="list__item"
                  onClick={() => handleExpand(item)}>
                  {item.name}
                </li>
                {expandedIndex === item.index && (
                  <li style={{ background: '#f9f9f9', padding: '8px 16px', borderLeft: '4px solid #bdbdbd' }}>
                    <div className="inline-detail">
                      {itemDetails[item.index] ? (
                        itemDetails[item.index].error ? (
                          <p style={{ color: "red" }}>{itemDetails[item.index].error}</p>
                        ) : (
                          <>
                            {itemDetails[item.index].rarity?.name && (
                              <p>
                                <strong>Rarity:</strong> {itemDetails[item.index].rarity.name}
                              </p>
                            )}
                            {itemDetails[item.index].equipment_category?.name && (
                              <p>
                                <strong>Category:</strong>{" "}
                                {itemDetails[item.index].equipment_category.name}
                              </p>
                            )}
                            {itemDetails[item.index].variant && (
                              <p>
                                <em>This is a variant magic item.</em>
                              </p>
                            )}
                            {itemDetails[item.index].requires_attunement && (
                              <p>
                                <strong>Requires Attunement:</strong>{" "}
                                {itemDetails[item.index].requires_attunement}
                              </p>
                            )}
                            {itemDetails[item.index].desc?.length > 0 &&
                              itemDetails[item.index].desc.map((paragraph, i) => (
                                <p key={i}>{paragraph}</p>
                              ))}
                            {itemDetails[item.index].properties?.length > 0 && (
                              <p>
                                <strong>Properties:</strong>{" "}
                                {itemDetails[item.index].properties.map((p) => p.name).join(", ")}
                              </p>
                            )}
                          </>
                        )
                      ) : (
                        <p>Loading details…</p>
                      )}
                    </div>
                  </li>
                )}
              </React.Fragment>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default MagicItemList;
