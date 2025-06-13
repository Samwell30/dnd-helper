import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./components/Landing";
import SpellsList from "./pages/Spells";
import Monsters from "./pages/Monsters";
import Nav from "./components/Nav";
import SpellDetails from "./pages/SpellDetails";
import MonsterDetail from "./pages/MonsterDetail";
import Footer from "./components/Footer";
import Equipment from "./pages/Equipment";
import MagicItemList from "./pages/MagicItems";
import Classes from "./pages/Classes";
import ClassDetail from "./pages/ClassDetail";
import Rules from "./pages/Rules";
import RuleDetail from "./pages/RuleDetail";
import ClassSpells from "./pages/ClassSpells";
import Traits from "./pages/Traits";


function App() {
  return (
    <BrowserRouter>
      <div id="app">
        <Nav />
        <Routes>
          <Route path="/spells" element={<SpellsList />} />
          <Route path="/spells/:spellIndex" element={<SpellDetails />} />
          <Route path="/monsters" element={<Monsters />} />
          <Route path="/monsters/:monsterIndex" element={<MonsterDetail />} />
          <Route path="/equipment" element={<Equipment />} />
          <Route path="/magicItems" element={<MagicItemList />} />
          <Route path="/classes" element={<Classes />} />
          <Route path="/classes/:classIndex" element={<ClassDetail />} />
          <Route path="/classes/:classIndex/spells" element={<ClassSpells />} />
          <Route path="/rules" element={<Rules />} />
          <Route path="/rules/:index" element={<RuleDetail />} />
          <Route path="/traits" element={<Traits />} />
          <Route path="*" element={<Landing />} />
        </Routes>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
export default App;
