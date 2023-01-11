import React, {useState} from 'react';
import {Outlet} from "react-router-dom";
import SideMenu from "./components/Side Menu/SideMenu";
import {links} from "./mock/Links";
import "./App.css"
import Styles from "./Root.module.css"

function App() {
    const [sideMenuOpen, setSideMenuOpen] = useState(true);
    return (
        <>
            <header>
                <button className={Styles.button} onClick={() => setSideMenuOpen(old => !old)}>DCCS TUZLA</button>
            </header>
            <div style={{display: "flex", gap: "2rem"}}>
                <SideMenu children={links} isOpen={sideMenuOpen}/>
                <main style={{height: "calc(100vh - 3rem)", overflowY: "scroll", flexGrow: "1", paddingTop: "2rem"}}>
                    <Outlet/>
                </main>
            </div>
        </>
    );
}

export default App;