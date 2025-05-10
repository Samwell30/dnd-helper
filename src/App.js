import { BrowserRouter, Route, Routes } from "react-router-dom";
import Landing from "./components/Landing";
import SpellsList from "./pages/Spells";
import Monsters from "./pages/Monsters";
import Nav from "./components/Nav";
import About from "./pages/About";
import SpellDetails from "./pages/SpellDetails";
import MonsterDetail from "./pages/MonsterDetail";


function App() {
  return (
    <BrowserRouter>
    <div id="app">
      <Nav/>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/about" element={<About />} />
        <Route path="/spells" element={<SpellsList />} />
        <Route path="/spells/:spellIndex" element={<SpellDetails />} />
        <Route path="/monsters" element={<Monsters />} />
        <Route path="/monsters/:monsterIndex" element={<MonsterDetail />} />
      </Routes>
    </div>
    </BrowserRouter>
  );
}

export default App;
