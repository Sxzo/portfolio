import { Link, useNavigate } from 'react-router-dom'
import { FaArrowLeft, FaKeyboard, FaPuzzlePiece, FaBrain } from 'react-icons/fa'
import './Minigames.css'
import { useState, useEffect } from 'react'
import { pantryService } from '../services/pantry'

interface Record {
  wpm: number;
  accuracy: number;
  name: string;
  timestamp: number;
}

function Minigames() {
  const navigate = useNavigate();
  const [highestWPM, setHighestWPM] = useState<number | null>(null);

  useEffect(() => {
    const fetchHighScore = async () => {
      const allRecords = await pantryService.getAllRecords();
      if (allRecords && allRecords.length > 0) {
        const wpms = allRecords.map(record => record.wpm).filter(wpm => !isNaN(wpm));
        if (wpms.length > 0) {
          const highest = Math.max(...wpms);
          setHighestWPM(highest);
        }
      }
    };

    fetchHighScore();
  }, []);

  return (
    <div className="minigames-container">
      <nav className="minigames-nav">
        <Link to="/" className="back-button">
          <FaArrowLeft className="back-icon" />
          <span>Back to Portfolio</span>
        </Link>
      </nav>
      
      <h1 className="minigames-title">Mini Games</h1>
      <p className="minigames-subtitle">A collection of fun browser games to test your skills, made by me!</p>
      
      <div className="games-grid">
        <div className="game-card">
          <div className="game-icon">
            <FaKeyboard />
          </div>
          <h2>TypeRacer</h2>
          <p>Test your typing speed and accuracy against others in real-time!</p>
          <div className="game-stats">
            {highestWPM && (
              <span className="stat">🏆 High Score: {highestWPM} WPM</span>
            )}
            <span className="stat">👥 Multiplayer</span>
          </div>
          <button className="play-button" onClick={() => navigate('/minigames/typeracer')}>Play</button>
        </div>

        <div className="game-card">
          <div className="game-icon">
            <FaPuzzlePiece />
          </div>
          <h2>Memory Match</h2>
          <p>Challenge your memory by matching pairs of cards in this classic game.</p>
          <div className="game-stats">
            <span className="stat">⏱️ Best Time: Coming Soon</span>
            <span className="stat">🎮 Single Player</span>
          </div>
          <button className="play-button">Coming Soon</button>
        </div>

        <div className="game-card">
          <div className="game-icon">
            <FaBrain />
          </div>
          <h2>Word Puzzle</h2>
          <p>Solve word puzzles and expand your vocabulary in this brain teaser.</p>
          <div className="game-stats">
            <span className="stat">📚 Words: Coming Soon</span>
            <span className="stat">🎮 Single Player</span>
          </div>
          <button className="play-button">Coming Soon</button>
        </div>
      </div>
    </div>
  )
}

export default Minigames 