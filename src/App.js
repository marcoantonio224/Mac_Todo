import React from 'react';
import TodoEngine from './components/Todo';
import './App.css';

function App() {
  return (
    <div className="App">
      <header>
        <h2>Mac's Todo App</h2>
      </header>
        <TodoEngine />
    </div>
  );
}

export default App;
