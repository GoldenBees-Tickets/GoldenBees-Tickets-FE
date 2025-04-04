
// import { StrictMode } from "react";
import ReactDOM from "react-dom/client";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 

import "./index.css"; 
import App from "./App.jsx"; 
import store from "./store/store.js"; 
import { Provider } from "react-redux"; 
import WebSocketComponent from "./components/WebSocketComponent"; 

ReactDOM.createRoot(document.getElementById("root")).render(
    <Provider store={store}>
      <App />
      <WebSocketComponent /> 
      <ToastContainer /> 
    </Provider>
);
