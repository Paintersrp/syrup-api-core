// import React from 'react';
import ReactDOM from 'react-dom';
import App from './App.tsx';
import './index.css';

// ReactDOM.createRoot(document.getElementById('root')!).render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );

ReactDOM.hydrate(<App />, document.getElementById('root'));