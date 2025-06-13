import React, { useEffect, useState } from 'react';

const Traits = () => {
  const [traits, setTraits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTrait, setSelectedTrait] = useState(null);
  const [traitDetail, setTraitDetail] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);
  const [detailError, setDetailError] = useState(null);

  useEffect(() => {
    fetch('https://www.dnd5eapi.co/api/traits')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch traits');
        return res.json();
      })
      .then((data) => {
        setTraits(data.results || []);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleTraitClick = (trait) => {
    setSelectedTrait(trait);
    setTraitDetail(null);
    setDetailError(null);
    setDetailLoading(true);
    fetch(`https://www.dnd5eapi.co${trait.url}`)
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch trait detail');
        return res.json();
      })
      .then((data) => {
        setTraitDetail(data);
        setDetailLoading(false);
      })
      .catch((err) => {
        setDetailError(err.message);
        setDetailLoading(false);
      });
  };

  if (loading) return <div>Loading traits...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='section'>
      <h1>Traits</h1>
      <ul className='list__items'>
        {traits.map((trait) => (
          <React.Fragment key={trait.index}>
            <li
              className="list__item"
              style={{ cursor: 'pointer', fontWeight: selectedTrait && selectedTrait.index === trait.index ? 'bold' : 'normal' }}
              onClick={() => handleTraitClick(trait)}
            >
              {trait.name}
            </li>
            {selectedTrait && selectedTrait.index === trait.index && (
              <div className="trait-detail-inline" style={{ marginLeft: 20, marginBottom: 10, background: '#f9f9f9', borderRadius: 6, padding: 12, border: '1px solid #ddd' }}>
                {detailLoading && <div>Loading detail...</div>}
                {detailError && <div>Error: {detailError}</div>}
                {traitDetail && (
                  <div>
                    {traitDetail.desc && traitDetail.desc.length > 0 && (
                      <div>
                        {traitDetail.desc.map((d, i) => (
                          <p key={i}>{d}</p>
                        ))}
                      </div>
                    )}
                    {traitDetail.races && traitDetail.races.length > 0 && (
                      <div>
                        <strong>Races:</strong>
                        <ul>
                          {traitDetail.races.map((race) => (
                            <li key={race.index}>{race.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {traitDetail.subraces && traitDetail.subraces.length > 0 && (
                      <div>
                        <strong>Subraces:</strong>
                        <ul>
                          {traitDetail.subraces.map((subrace) => (
                            <li key={subrace.index}>{subrace.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                    {traitDetail.proficiencies && traitDetail.proficiencies.length > 0 && (
                      <div>
                        <strong>Proficiencies:</strong>
                        <ul>
                          {traitDetail.proficiencies.map((prof) => (
                            <li key={prof.index}>{prof.name}</li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </React.Fragment>
        ))}
      </ul>
    </div>
  );
};

export default Traits;