import React from 'react';
import {MenuItem} from "./SideMenu";
import {NavLink} from "react-router-dom";
import Styles from "./SideMenuItem.module.css"

interface SideMenuItemProps{
    item: MenuItem;
    level: number;
}

function SideMenuItem({item, level}: SideMenuItemProps) {
    return (
        <div style={{marginBottom: "0.5rem"}}>
                <NavLink
                    style={{display: "flex", width: "100%", overflow: "hidden", alignItems: "center", whiteSpace: "nowrap", gap: "1ch"}}
                    to={item.route}
                    className={({ isActive}) =>
                        isActive
                            ? Styles.active
                            : Styles.link
                    }
                >
                    {item.icon}
                    {item.text}
                </NavLink>
            <div style={{paddingLeft: `${level}rem`}}>
            {
                item.children && item.children.map(child => <SideMenuItem item={child} level={level + 1}/>)
            }
            </div>
        </div>
    );
}

export default SideMenuItem;