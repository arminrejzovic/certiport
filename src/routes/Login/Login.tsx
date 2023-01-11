import React, {FormEvent, useRef, useState} from 'react';
import {faAt, faLock, faEye, faEyeSlash} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {NavLink} from "react-router-dom";
import Styles from "./Login.module.css"
import Input from "../../components/Utils/Input/Input";

function Login(props: any) {
    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const [showPassword, setShowPassword] = useState(false);

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.log({email: emailRef.current?.value, password: passwordRef.current?.value});
    }

    return (
        <div className={Styles.login}>
            <h2>Log in</h2>
            <p className={Styles.par}>Welcome back to DCCS Certapp. Please log in with your email and password</p>
            <form onSubmit={handleSubmit}>
                <Input
                    type={"email"}
                    ref={emailRef}
                    placeholder={"Email"}
                    iconStart={<FontAwesomeIcon icon={faAt} style={{paddingLeft: "0.5rem"}}/>}
                />

                <Input
                    type={showPassword ? "text" : "password"}
                    ref={passwordRef}
                    placeholder={"Password"}
                    iconStart={<FontAwesomeIcon icon={faLock} style={{paddingLeft: "0.5rem"}}/>}
                    iconEnd={
                        <FontAwesomeIcon
                            icon={showPassword ? faEye : faEyeSlash}
                            onClick={() => setShowPassword(!showPassword)}
                            style={{paddingRight: "0.5rem"}}
                        />
                    }
                />

                <input className={Styles.submit} type={"submit"} value={"LOGIN"}/>
            </form>
            <div>
                <p className={Styles.par}>Don't have an account yet?</p>
                <NavLink className={Styles.link} to={"/signup"}>Sign up</NavLink>
            </div>
        </div>
    );
}

export default Login;