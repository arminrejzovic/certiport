import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import App from "./App";
import Certificates from "./routes/Certificates/Certificates";
import Suppliers from "./routes/Suppliers";
import Login from "./routes/Login/Login";
import SignUp from "./routes/Sign Up/SignUp";
import OpenCertificate from "./routes/Certificates/OpenCertificate";

const router = createBrowserRouter([
    {
        path: "/",
        element: <App/>,
        errorElement: <div>404: NOT FOUND</div>,
        children: [
            {
                path: "/certificates",
                element: <Certificates/>,
            },

            {
                path: "/certificate",
                element: <OpenCertificate/>,
            },
            {
                path: "/about",
                element: <div>Test</div>,
            },
            {
                path: "/login",
                element: <Login/>,
            },
            {
                path: "/signup",
                element: <SignUp/>,
            },
            {
                path: "/suppliers",
                element: <Suppliers/>,
                errorElement: <div>404: NOT FOUND</div>,
                children: [
                    {
                        path: "suppliers/about",
                        element: <div>Test</div>,
                    }
                ]
            },
        ]
    }
]);

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <RouterProvider router={router}/>
  </React.StrictMode>,
)
