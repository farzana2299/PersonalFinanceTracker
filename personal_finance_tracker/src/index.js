import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter } from 'react-router-dom';
import 'react-toastify/dist/ReactToastify.css';
import 'antd/dist/reset.css';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import { store } from './service/store';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <>
      <Provider store={store}> <App /></Provider>
        <ToastContainer />
      </>
    </BrowserRouter>
  </React.StrictMode>
);
