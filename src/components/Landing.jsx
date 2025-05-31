import QuickSearch from "./QuickSeach";

function Landing() {
  return (
      <div id="landing">
        <div className="hero">
  <h1 className="hero__title">Welcome to the D<span className="red">&</span>D Helper</h1>
  <p className="hero__subtitle">
    Welcome to DnD Helper! This website is designed to assist players 
    and Dungeon Masters in their Dungeons & Dragons adventures. 
    Here, you can explore spells, monsters, and other resources to 
    enhance your gameplay experience.
  </p>
  <p className="hero__subtitle">
    Search for a spell or monster to get started.
  </p>
  <QuickSearch />
</div>
      </div>
  );
}

export default Landing;