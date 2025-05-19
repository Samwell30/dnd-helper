import QuickSearch from "./QuickSeach";

function Landing() {
  return (
      <div id="landing">
        <div className="hero">
  <h1 className="hero__title">Welcome to the D<span className="red">&</span>D Helper</h1>
  <p className="hero__subtitle">
    Search for a spell or monster to get started.
  </p>
  <QuickSearch />
</div>
      </div>
  );
}

export default Landing;