import React, { useState } from 'react';

export function TaskInput({ addTask }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    addTask(input);
    setInput('');
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter a fallacy..."
      />
      <button type="submit">Add Fallacy</button>
    </form>
  );
}

export function TaskList({ tasks, incrementCounter }) {
  return (
    <ul>
      {tasks.map((task, index) => (
        <li key={index}>
          {task.text}: {task.count}
          <button onClick={() => incrementCounter(index)}>^</button>
        </li>
      ))}
    </ul>
  );
}
