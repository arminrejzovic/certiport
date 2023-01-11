import React from 'react';
import Styles from "./Input.module.css"
interface InputProps extends React.InputHTMLAttributes<HTMLInputElement>{
    label?: string;
    iconStart?: JSX.Element;
    iconEnd?: JSX.Element;
}

const Input = React.forwardRef<HTMLInputElement, InputProps>((props, ref) => {
    return (
        <div className={Styles.input} style={props.style}>
            {props.label && <label className={Styles.label}>{props.label}</label>}
            {props.iconStart}
            <input required={props.required} type={props.type} ref={ref} placeholder={props.placeholder} onChange={props.onChange}/>
            {props.iconEnd}
        </div>
    );
});

export default Input;