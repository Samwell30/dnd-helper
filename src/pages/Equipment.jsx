import React, { useEffect, useState } from "react";
import axios from "axios";

const EquipmentList = () => {
  const [equipment, setEquipment] = useState([]);
  const [categories, setCategories] = useState(["All"]);
  const [searchItem, setSearchItem] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [isLoading, setIsLoading] = useState(true);
  const [selectedEquipment, setSelectedEquipment] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(null);

  // Fetch categories on mount
  useEffect(() => {
    fetchCategories();
    fetchEquipmentList();
  }, []);

  // Refetch equipment when category changes
  useEffect(() => {
    if (selectedCategory === "All") {
      fetchEquipmentList();
    } else {
      fetchEquipmentByCategory(selectedCategory);
    }
  }, [selectedCategory]);

  async function fetchCategories() {
    try {
      const { data } = await axios.get("https://www.dnd5eapi.co/api/equipment-categories");
      const categoryNames = data.results.map((cat) => cat.name);
      setCategories(["All", ...categoryNames]);
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  }

  async function fetchEquipmentList() {
    setIsLoading(true);
    try {
      const { data } = await axios.get("https://www.dnd5eapi.co/api/2014/equipment");
      setEquipment(data.results);
    } catch (error) {
      console.error("Error fetching equipment list:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchEquipmentByCategory(categoryName) {
    setIsLoading(true);
    try {
      const { data: catList } = await axios.get("https://www.dnd5eapi.co/api/equipment-categories");
      const matchedCategory = catList.results.find((c) => c.name === categoryName);

      if (matchedCategory) {
        const { data: categoryData } = await axios.get(`https://www.dnd5eapi.co${matchedCategory.url}`);
        setEquipment(categoryData.equipment);
      }
    } catch (error) {
      console.error("Error fetching category equipment:", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchEquipmentDetail(index) {
    if (expandedIndex === index) {
      setExpandedIndex(null);
      setSelectedEquipment(null);
      return;
    }

    try {
      const { data } = await axios.get(`https://www.dnd5eapi.co/api/2014/equipment/${index}`);
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

      <div className="input__container" style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="Search equipment..."
          value={searchItem}
          onChange={(e) => setSearchItem(e.target.value)}
        />
        <select value={selectedCategory} onChange={(e) => setSelectedCategory(e.target.value)}>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {isLoading ? (
        <p>Loading equipment...</p>
      ) : filteredEquipment.length === 0 ? (
        <p>No equipment found.</p>
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
                <div className="equipment-detail" style={{ marginTop: "10px", fontSize: "0.9rem" }}>
                  <p>
                    <strong>Category:</strong> {selectedEquipment.equipment_category?.name}
                  </p>
                  {selectedEquipment.armor_category && (
                    <p>
                      <strong>Armor Category:</strong> {selectedEquipment.armor_category}
                    </p>
                  )}
                  {selectedEquipment.armor_class?.base && (
                    <p>
                      <strong>Armor Class:</strong> {selectedEquipment.armor_class.base}
                      {selectedEquipment.armor_class.dex_bonus ? " + Dex modifier" : ""}
                      {selectedEquipment.armor_class.max_bonus !== undefined &&
                        ` (max +${selectedEquipment.armor_class.max_bonus})`}
                    </p>
                  )}
                  {selectedEquipment.damage?.damage_dice && (
                    <p>
                      <strong>Damage:</strong> {selectedEquipment.damage.damage_dice}
                    </p>
                  )}
                  {selectedEquipment.weapon_range && (
                    <p>
                      <strong>Weapon Type:</strong> {selectedEquipment.weapon_range}
                    </p>
                  )}
                  {selectedEquipment.range?.normal && (
                    <p>
                      <strong>Range:</strong> {selectedEquipment.range.normal} ft
                      {selectedEquipment.range.long && ` / ${selectedEquipment.range.long} ft (long)`}
                    </p>
                  )}
                  {selectedEquipment.desc?.length > 0 && (
                    <p>
                      <strong>Description:</strong> {selectedEquipment.desc.join(" ")}
                    </p>
                  )}
                  {selectedEquipment.cost && (
                    <p>
                      <strong>Cost:</strong> {selectedEquipment.cost.quantity} {selectedEquipment.cost.unit}
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
