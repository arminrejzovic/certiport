import React, {useState} from 'react';
import Style from "./SideMenu.module.css"
import SideMenuItem from "./SideMenuItem";

export interface MenuItem {
    text: string;
    route: string;
    icon?: JSX.Element;
    children?: MenuItem[];
}

interface SideMenuProps {
    children: MenuItem[];
    isOpen: boolean;
    onClose?: () => void;
}

/**
 *
 * @param children - List of MenuItems to be shown
 * @param isOpen  - Defines whether the SideMenu is expanded or not
 * @param onClose - Use this function to close SideMenu, or pass empty function to make SideMenu persistent
 *
 */
function SideMenu({children, isOpen, onClose}: SideMenuProps) {

    return (
        <aside className={isOpen ? Style.expanded : Style.collapsed}>
            <nav className={Style.links}>
                {
                    children.map(child => {
                        return <SideMenuItem item={child} level={1}/>
                    })
                }
            </nav>
        </aside>
    );
}

export default SideMenu;