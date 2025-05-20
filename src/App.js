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


function App() {
  return (
    <BrowserRouter>
    <div id="app">
      <Nav/>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/spells" element={<SpellsList />} />
        <Route path="/spells/:spellIndex" element={<SpellDetails />} />
        <Route path="/monsters" element={<Monsters />} />
        <Route path="/monsters/:monsterIndex" element={<MonsterDetail />} />
        <Route path="/equipment" element={<Equipment /> } />
        <Route path="/magicItems" element={<MagicItemList /> } />
      </Routes>
      <Footer />
    </div>
    </BrowserRouter>
  );
}

export default App;
