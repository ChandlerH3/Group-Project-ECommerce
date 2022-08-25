import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/App';
import { Provider } from './components/Context';

ReactDOM.render(
  <React.StrictMode>
    <Provider>
      <App />
    </Provider>
  </React.StrictMode>,
  document.getElementById('root')
);
