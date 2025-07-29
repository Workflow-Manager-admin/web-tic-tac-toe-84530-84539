import React, { useState, useEffect } from 'react';
import './App.css';

/**
 * Color variables for the theme. These map to palette provided.
 * --primary: #1976d2
 * --secondary: #388e3c
 * --accent: #e53935
 */

// Square component for the tic tac toe board.
function Square({ value, onClick, highlight }) {
  return (
    <button
      className={`ttt-square${highlight ? ' highlight' : ''}`}
      onClick={onClick}
      aria-label={value ? `Cell with ${value}` : "Empty board cell"}
    >
      {value}
    </button>
  );
}

// Calculate if there's a winner or draw and return result object.
function calculateGameStatus(squares) {
  const lines = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
    [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
    [0, 4, 8], [2, 4, 6]             // diagonals
  ];
  for (let l of lines) {
    const [a, b, c] = l;
    if (
      squares[a] &&
      squares[a] === squares[b] &&
      squares[a] === squares[c]
    ) {
      return { winner: squares[a], winLine: l, draw: false };
    }
  }
  const draw = squares.every(Boolean);
  if (draw) return { winner: null, winLine: null, draw: true };
  return { winner: null, winLine: null, draw: false };
}


// PUBLIC_INTERFACE
function App() {
  // Game state: board squares, current player, result
  const [squares, setSquares] = useState(Array(9).fill(null));
  const [xIsNext, setXIsNext] = useState(true);
  const [result, setResult] = useState({ winner: null, winLine: null, draw: false });
  const [score, setScore] = useState({ X: 0, O: 0 });
  const [theme] = useState("light"); // Static light theme

  // Center board: handle resizing, but simple for now
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Check for game end whenever squares change
  useEffect(() => {
    const res = calculateGameStatus(squares);
    setResult(res);
    // Update score if win
    if (res.winner) {
      setScore(s => ({
        ...s,
        [res.winner]: s[res.winner] + 1
      }));
    }
    // eslint-disable-next-line
  }, [squares]);

  // PUBLIC_INTERFACE
  const handleSquareClick = idx => {
    if (squares[idx] || result.winner || result.draw) return;
    const nextSquares = squares.slice();
    nextSquares[idx] = xIsNext ? 'X' : 'O';
    setSquares(nextSquares);
    setXIsNext(x => !x);
  };

  // PUBLIC_INTERFACE
  const handleRestart = () => {
    setSquares(Array(9).fill(null));
    setResult({ winner: null, winLine: null, draw: false });
    setXIsNext(r => (result.winner === 'O' ? false : true)); // Loser starts
  };

  // Label for the status area
  let statusMessage;
  if (result.winner) {
    statusMessage = (
      <span style={{ color: 'var(--accent)' }}>
        Player <b>{result.winner}</b> wins!
      </span>
    );
  } else if (result.draw) {
    statusMessage = (
      <span style={{ color: 'var(--secondary)' }}>
        Draw!
      </span>
    );
  } else {
    statusMessage = (
      <span>
        Next: <b style={{ color: xIsNext ? 'var(--primary)' : 'var(--accent)' }}>{xIsNext ? 'X' : 'O'}</b>
      </span>
    );
  }

  return (
    <div className="ttt-app-root">
      <div className="ttt-container">
        <h1 className="ttt-title">Tic Tac Toe</h1>
        <div className="ttt-scoreboard">
          <span className="ttt-score ttt-x">X: {score.X}</span>
          <span className="ttt-score ttt-o">O: {score.O}</span>
        </div>
        <div className="ttt-status">{statusMessage}</div>
        <div className="ttt-board">
          {Array(3).fill(0).map((_, row) => (
            <div className="ttt-board-row" key={row}>
              {Array(3).fill(0).map((_, col) => {
                const idx = row * 3 + col;
                const highlight = result.winLine && result.winLine.includes(idx);
                return (
                  <Square
                    key={idx}
                    value={squares[idx]}
                    onClick={() => handleSquareClick(idx)}
                    highlight={highlight}
                  />
                );
              })}
            </div>
          ))}
        </div>
        <button className="ttt-btn ttt-restart-btn" onClick={handleRestart}>
          Restart
        </button>
      </div>
      <footer className="ttt-footer">
        <span>Modern light UI &bull; <b style={{ color: 'var(--primary)' }}>Primary</b> <span style={{ color: 'var(--accent)' }}>• Accent</span> <span style={{ color: 'var(--secondary)' }}>• Secondary</span></span>
      </footer>
    </div>
  );
}

export default App;
