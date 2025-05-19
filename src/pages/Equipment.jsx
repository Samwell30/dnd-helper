import React, { useEffect, useState } from "react";
import axios from "axios";

const EquipmentList = () => {
  const [equipment, setEquipment] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

  useEffect(() => {
    const savedEquipment = localStorage.getItem("equipmentList");

    if (savedEquipment) {
      setEquipment(JSON.parse(savedEquipment));
      setIsLoading(false);
    } else {
      fetchEquipmentList();
    }
  }, []);

  async function fetchEquipmentList() {
    setIsLoading(true);
    try {
      const { data } = await axios.get(
        "https://www.dnd5eapi.co/api/2014/equipment"
      );
      setEquipment(data.results);
      localStorage.setItem("equipmentList", JSON.stringify(data.results));
    } catch (error) {
      console.error("Error fetching equipment list:", error);
    }
    setIsLoading(false);
  }

  async function fetchEquipmentDetail(index) {
    if (expandedIndex === index) {
      setExpandedIndex(null);
      setSelectedEquipment(null);
      return;
    }

    try {
      const { data } = await axios.get(
        `https://www.dnd5eapi.co/api/2014/equipment/${index}`
      );
      setSelectedEquipment(data);
      setExpandedIndex(index);
    } catch (error) {
      console.error("Error fetching equipment detail:", error);
    }
  }

  const filteredEquipment = equipment.filter((item) =>
    item.name.toLowerCase().includes(searchItem.toLowerCase())
  );
  return (
    <div className="section">
      <h1>Equipment List</h1>
      <p>Click an item to view more details below.</p>
      <div className="input__container">
        <input
          type="text"
          placeholder="Search equipment..."
          value={searchItem}
          onChange={(e) => setSearchItem(e.target.value)}
        />
      </div>
      {isLoading ? (
        <p>Loading equipment...</p>
      ) : (
        <ul className="list__items">
          {filteredEquipment.map((item) => (
            <li
              className="list__item"
              key={item.index}
              onClick={() => fetchEquipmentDetail(item.index)}
              style={{ cursor: "pointer" }}
            >
              {item.name}
              {expandedIndex === item.index && selectedEquipment && (
                <div
                  className="equipment-detail"
                  style={{ marginTop: "10px", fontSize: "0.9rem", color: "red" }}
                >
                  <p>
                    <strong>Category:</strong>{" "}
                    {selectedEquipment.equipment_category.name}
                  </p>
                  {selectedEquipment.armor_category && (
                    <p>
                      <strong>Armor Category:</strong>{" "}
                      {selectedEquipment.armor_category}
                    </p>
                  )}

                  {selectedEquipment.armor_class?.base && (
                    <p>
                      <strong>Armor Class:</strong>{" "}
                      {selectedEquipment.armor_class.base}
                      {selectedEquipment.armor_class.dex_bonus
                        ? " + Dex modifier"
                        : ""}
                      {selectedEquipment.armor_class.max_bonus !== undefined &&
                        ` (max +${selectedEquipment.armor_class.max_bonus})`}
                    </p>
                  )}
                  {selectedEquipment.damage?.damage_dice && (
                    <p>
                      <strong>Damage:</strong>{" "}
                      {selectedEquipment.damage.damage_dice}
                    </p>
                  )}
                  {selectedEquipment.weapon_range && (
                    <p>
                      <strong>Weapon Type:</strong>{" "}
                      {selectedEquipment.weapon_range}
                    </p>
                  )}
                  {selectedEquipment.range?.normal && (
                    <p>
                      <strong>Range:</strong> {selectedEquipment.range.normal}{" "}
                      ft
                      {selectedEquipment.range.long &&
                        ` / ${selectedEquipment.range.long} ft (long)`}
                    </p>
                  )}
                  {selectedEquipment.desc?.length > 0 && (
                    <p>
                      <strong>Description:</strong>{" "}
                      {selectedEquipment.desc.join(" ")}
                    </p>
                  )}
                  {selectedEquipment.cost && (
                    <p>
                      <strong>Cost:</strong> {selectedEquipment.cost.quantity}{" "}
                      {selectedEquipment.cost.unit}
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

export default EquipmentList;
