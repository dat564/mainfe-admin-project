import React, { Suspense } from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import reportWebVitals from './reportWebVitals';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import routes from 'configs/routes';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
import { Provider } from 'react-redux';
import store from 'redux/store';
import { Spin } from 'antd';

const routers = createBrowserRouter(routes);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <Provider store={store}>
      <Suspense
        fallback={
          <div className="min-h-[500px] w-full flex justify-center items-center">
            <Spin spinning size="large"></Spin>
          </div>
        }
      >
        <RouterProvider router={routers} />
      </Suspense>
      {/* <div className="flex items-center justify-center">
      <TreeSelectDropDown />
    </div> */}
      <ToastContainer />
    </Provider>
  </React.StrictMode>
);

reportWebVitals();
