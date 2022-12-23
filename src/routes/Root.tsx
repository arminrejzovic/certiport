import React, {useState} from 'react';
import {Outlet} from "react-router-dom";
import SideMenu from "../components/SideMenu";
import {links} from "../mock/Links";
import "../App.css"
import Styles from "./Root.module.css"

function Root() {
    const [sideMenuOpen, setSideMenuOpen] = useState(true);
    return (
        <>
            <header>
                <button className={Styles.button} onClick={() => setSideMenuOpen(old => !old)}>DCCS TUZLA</button>
            </header>
            <div style={{display: "flex", gap: "2rem"}}>
                <SideMenu children={links} isOpen={sideMenuOpen}/>
                <Outlet/>
            </div>
        </>
    );
}

export default Root;