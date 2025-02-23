import { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { FaArrowLeft, FaKeyboard, FaRandom, FaPlay, FaRedo, FaSave } from 'react-icons/fa';
import { pantryService } from '../../../services/pantry';
import './TypeRacer.css';

interface LeaderboardEntry {
  name: string;
  wpm: number;
  accuracy: number;
}

interface Quote {
  text: string;
  movie: string;
  year: number;
}

const SAMPLE_TEXTS: Quote[] = [
  {
    text: "My mom always said life was like a box of chocolates. You never know what you're gonna get. Those shoes... I bet if I think about it real hard, I can remember my first pair of shoes. Mama said they'd take me anywhere. She was right. I have worn lots of shoes. I bet if I think about it real hard, I can remember my first pair of shoes.",
    movie: "Forrest Gump",
    year: 1994
  },
  {
    text: "You cannot say 'no' to the people you love, not often. That's the secret. And then when you do, it has to sound like a 'yes' or you have to make them say 'no.' You have to take time and trouble. But when you do, it has to be final.",
    movie: "The Godfather",
    year: 1972
  },
  {
    text: "I guess it comes down to a simple choice, really. Get busy living or get busy dying. That's goddamn right. I find I'm so excited I can barely sit still or hold a thought in my head. I think it's the excitement only a free man can feel, a free man at the start of a long journey whose conclusion is uncertain.",
    movie: "The Shawshank Redemption",
    year: 1994
  },
  {
    text: "So if I asked you about art, you'd probably give me the skinny on every art book ever written. Michelangelo? You know a lot about him. Life's work, political aspirations, him and the Pope, sexual orientation, the whole works, right? But I bet you can't tell me what it smells like in the Sistine Chapel. You've never actually stood there and looked up at that beautiful ceiling. Seen that.",
    movie: "Good Will Hunting",
    year: 1997
  },
  {
    text: "You see, madness, as you know, is like gravity. All it takes is a little push. You didn't think I'd risk losing the battle for Gotham's soul in a fistfight with you? No, you need an ace in the hole. Mine's Harvey. I took Gotham's white knight and brought him down to our level. It wasn't hard. You see, madness, as you know, is like gravity. All it takes is a little push.",
    movie: "The Dark Knight",
    year: 2008
  },
  {
    text: "I got here the same way the coin did. You know what date is on this coin? Nineteen fifty-eight. It's been traveling twenty-two years to get here. And now it's here. And it's either heads or tails. And you have to say. Call it. This coin's been traveling its whole life to get here. And now it's here. And it's either heads or tails.",
    movie: "No Country for Old Men",
    year: 2007
  },
  {
    text: "You take the blue pill... the story ends, you wake up in your bed and believe whatever you want to believe. You take the red pill… you stay in Wonderland, and I show you how deep the rabbit hole goes. Remember, all I'm offering is the truth. Nothing more.",
    movie: "The Matrix",
    year: 1999
  }
];

function TypeRacer() {
  const [text, setText] = useState('');
  const [userInput, setUserInput] = useState('');
  const [startTime, setStartTime] = useState<number | null>(null);
  const [endTime, setEndTime] = useState<number | null>(null);
  const [wpm, setWpm] = useState<number | null>(null);
  const [accuracy, setAccuracy] = useState<number | null>(null);
  const [gameState, setGameState] = useState<'ready' | 'playing' | 'finished'>('ready');
  const [elapsedTime, setElapsedTime] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const timerRef = useRef<NodeJS.Timeout>();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [currentQuote, setCurrentQuote] = useState<Quote>(SAMPLE_TEXTS[0]);
  const [playerName, setPlayerName] = useState<string>('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [nameError, setNameError] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const getPassageId = (quote: Quote) => {
    return `${quote.movie}-${quote.year}`.toLowerCase().replace(/\s+/g, '-');
  };

  useEffect(() => {
    const randomQuote = SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
    setCurrentQuote(randomQuote);
    setText(randomQuote.text);
    
    pantryService.getLeaderboard(getPassageId(randomQuote))
      .then(setLeaderboard);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startGame = () => {
    setGameState('playing');
    setStartTime(Date.now());
    setUserInput('');
    setWpm(null);
    setAccuracy(null);
    setElapsedTime(0);
    if (inputRef.current) inputRef.current.focus();

    timerRef.current = setInterval(() => {
      setElapsedTime(prev => prev + 1);
    }, 1000);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const calculateResults = () => {
    if (!startTime) return;
    
    const endTime = Date.now();
    const timeInMinutes = (endTime - startTime) / 60000;
    const wordsTyped = userInput.trim().split(' ').length;
    const calculatedWpm = Math.round(wordsTyped / timeInMinutes);
    
    const correctChars = userInput.split('').filter((char, i) => char === text[i]).length;
    const calculatedAccuracy = Math.round((correctChars / text.length) * 100);

    setWpm(calculatedWpm);
    setAccuracy(calculatedAccuracy);
    setEndTime(endTime);
    setGameState('finished');
    setShowNameInput(true);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newInput = e.target.value;
    setUserInput(newInput);

    if (newInput.length === text.length) {
      calculateResults();
    }
  };

  const getRandomQuote = () => {
    const randomQuote = SAMPLE_TEXTS[Math.floor(Math.random() * SAMPLE_TEXTS.length)];
    setCurrentQuote(randomQuote);
    setText(randomQuote.text);
    setUserInput('');
    
    pantryService.getLeaderboard(getPassageId(randomQuote))
      .then(setLeaderboard);
  };

  const submitScore = async () => {
    if (!wpm || !accuracy || isSubmitting) return;
    
    if (!playerName.trim()) {
      setNameError('Please enter a name');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const success = await pantryService.submitScore(getPassageId(currentQuote), {
        name: playerName.trim(),
        wpm,
        accuracy,
      });

      if (!success) {
        setNameError('This name is already taken or score already submitted');
        return;
      }

      setNameError('');
      const updatedLeaderboard = await pantryService.getLeaderboard(getPassageId(currentQuote));
      setLeaderboard(updatedLeaderboard);
      setShowNameInput(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="game-page">
      <nav className="minigames-nav">
        <Link to="/minigames" className="back-button">
          <FaArrowLeft className="back-icon" />
          <span>Back to Games</span>
        </Link>
      </nav>

      <div className="type-racer">
        <div className="type-racer-header">
          <h2><FaKeyboard className="header-icon" /> TypeRacer</h2>
          <div className="timer">{formatTime(elapsedTime)}</div>
        </div>
        
        {gameState === 'ready' && (
          <>
            <div className="quote-source">
              <div className="quote-info">
                <span className="movie-title">{currentQuote.movie}</span>
                <span className="movie-year">({currentQuote.year})</span>
              </div>
              <button 
                className="shuffle-button" 
                onClick={getRandomQuote}
                title="Get new quote"
              >
                <FaRandom />
              </button>
            </div>
            <div className="leaderboard">
              <h3>Leaderboard</h3>
              {leaderboard.map((entry, index) => (
                <div key={index} className="leaderboard-entry">
                  <span className="rank">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                  </span>
                  <span className="name">{entry.name}</span>
                  <span className="stats">
                    {entry.wpm} WPM • {entry.accuracy}% Accuracy
                  </span>
                </div>
              ))}
            </div>
            <button className="start-button" onClick={startGame}>
              Start Typing
            </button>
          </>
        )}

        {gameState === 'playing' && (
          <div className="game-container">

            <div className="text-display">
              {text.split('').map((char, index) => (
                <span 
                  key={index}
                  className={
                    userInput[index] === undefined
                      ? ''
                      : userInput[index] === char
                      ? 'correct'
                      : 'incorrect'
                  }
                >
                  {char}
                </span>
              ))}
            </div>
            <div className="quote-source">
              <span className="movie-title">{currentQuote.movie}</span>
              <span className="movie-year">({currentQuote.year})</span>
            </div>
            <input
              ref={inputRef}
              type="text"
              value={userInput}
              onChange={handleInputChange}
              className="type-input"
              placeholder="Start typing..."
            />
          </div>
        )}

        {gameState === 'finished' && (
          <div className="results">
            <h3>Results</h3>
            <div className="results-stats">
              <div className="stat-card">
                <span className="stat-label">Speed ⚡</span>
                <div>
                  <span className="stat-value">{wpm}</span>
                  <span className="stat-unit"> WPM</span>
                </div>
              </div>
              <div className="stat-card">
                <span className="stat-label">Accuracy 🎯</span>
                <div>
                  <span className="stat-value">{accuracy}</span>
                  <span className="stat-unit">%</span>
                </div>
              </div>
            </div>
            
            {showNameInput ? (
              <div className="name-input-container">
                <div className="name-input-wrapper">
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => {
                      setPlayerName(e.target.value);
                      setNameError('');
                    }}
                    placeholder="Enter your name"
                    maxLength={20}
                    className="name-input"
                  />
                  {nameError && <span className="name-error">{nameError}</span>}
                </div>
                <button 
                  onClick={submitScore} 
                  className="submit-score-button"
                  disabled={isSubmitting}
                >
                  <FaSave /> {isSubmitting ? 'Submitting...' : 'Submit Score'}
                </button>
              </div>
            ) : (
              <div className="action-buttons">
                <button onClick={startGame} className="try-again-button">
                  <FaRedo /> Try Again
                </button>
                <button 
                  onClick={() => {
                    getRandomQuote();
                    startGame();
                  }} 
                  className="new-passage-button"
                >
                  <FaPlay /> New Passage
                </button>
              </div>
            )}

            <div className="leaderboard">
              <h3>Leaderboard for {currentQuote.movie}</h3>
              {leaderboard.map((entry, index) => (
                <div key={index} className="leaderboard-entry">
                  <span className="rank">
                    {index === 0 ? "🥇" : index === 1 ? "🥈" : "🥉"}
                  </span>
                  <span className="name">{entry.name}</span>
                  <span className="stats">
                    {entry.wpm} WPM • {entry.accuracy}% Accuracy
                  </span>
                </div>
              ))}
              {leaderboard.length === 0 && (
                <div className="no-scores">No scores yet. Be the first!</div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TypeRacer; 