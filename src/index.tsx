import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

document.addEventListener('touchmove', function (e) {
    // e.preventDefault();
}, {passive: false});

document.addEventListener('touchstart', () => false);
document.addEventListener('selectstart', () => false);
document.addEventListener('contextmenu', function (e) {
    e.preventDefault();
});

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
