import React, {ReactElement, useState} from 'react';
import Styles from "./IconDropDown.module.css"
interface IconDropDownProps{
    icon: ReactElement;
    actions: {
        label: string;
        action: Function;
    }[];
}
function IconDropDown(props: IconDropDownProps) {
    const [showMenu, setShowMenu] = useState(false);
    return (
        <div className={Styles.wrapper}>
            <span className={Styles.icon} style={{color: showMenu ? "steelblue" : ""}} onClick={() => setShowMenu(!showMenu)}>{props.icon}</span>
            {
                showMenu &&
                <div className={Styles.dropdown}>
                    {props.actions.map((a) => {
                        return <p className={Styles.dropdownItem} onClick={() => {
                            a.action()
                            setShowMenu(false);
                        }}>{a.label}</p>
                    })}
                </div>
            }
        </div>
    );
}

export default IconDropDown;