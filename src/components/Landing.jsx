import React from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'


const Landing = () => {
    const navigate = useNavigate();

    const handleClick = () => {
        navigate()
    }
    
    return (
    <section id="landing">
      <header>
        <div className="header__container">
          <div className="header__description">
          <h1>Hello. Welcome to the Dnd Assist website</h1>
          <h2>Here you can look up spells and Monster types!</h2>
          </div>
        </div>
      </header>
      <main>
        <div className="landing__links">
            <h3>Start Exploring spells</h3>
            <Link to="/spells" className="landing__link">            
            <button onClick={handleClick} className='btn'>Spells List</button>
            </Link>
        </div>
        <div className="landing__links">
            <h3>Start Exploring Monsters</h3>
            <Link to="/monsters" className="landing__link">            
            <button onClick={handleClick} className='btn'>Monster List</button>
            </Link>
        </div>
      </main>
    </section>
  )
}

export default Landing