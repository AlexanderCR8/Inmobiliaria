import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import Firebase, { FirebaseContext } from './server'
import { initialState } from './sesion/initialState'
import { StateProvider } from './sesion/store'
//import sesionReducer from './sesion/reducers/sesionReducer'

import {mainReducer} from './sesion/reducers'


ReactDOM.render(
  <FirebaseContext.Provider value={new Firebase()}>
    <StateProvider initialState={initialState} reducer={mainReducer}>
      <App />
    </StateProvider>

  </FirebaseContext.Provider>,

  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
