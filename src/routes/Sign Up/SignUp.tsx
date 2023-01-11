import React, {FormEvent, useRef} from 'react';
import Styles from "./Signup.module.css";
import Input from "../../components/Utils/Input/Input";

function SignUp(props: any) {
    const nameRef = useRef<HTMLInputElement>(null);
    const surnameRef = useRef<HTMLInputElement>(null);
    const plantRef = useRef<HTMLInputElement>(null);
    const deptRef = useRef<HTMLInputElement>(null);

    const emailRef = useRef<HTMLInputElement>(null);
    const passwordRef = useRef<HTMLInputElement>(null);
    const repPasswordRef = useRef<HTMLInputElement>(null);

    function handleSubmit(e: FormEvent<HTMLFormElement>) {
        e.preventDefault();
        console.table({
            name: nameRef.current?.value,
            surname: surnameRef.current?.value,
            plant: plantRef.current?.value,
            dept: deptRef.current?.value,
            email: emailRef.current?.value,
            password: passwordRef.current?.value,
            repeatedPassword: repPasswordRef.current?.value
        });
    }

    return (
        <div className={Styles.card}>
            <h2>Sign up</h2>
            <p className={Styles.par}>Welcome to DCCS Certapp. Please fill in all the required fields to create a new user account.</p>
            <form onSubmit={handleSubmit}>
                <fieldset className={Styles.fieldset}>
                    <legend>Personal information</legend>
                    <Input
                        type={"text"}
                        ref={nameRef}
                        placeholder={"First name"}
                        label={"First name"}
                        required
                    />

                    <Input
                        type={"text"}
                        ref={surnameRef}
                        placeholder={"Last name"}
                        label={"Last name"}
                        required
                    />

                    <Input
                        type={"text"}
                        ref={plantRef}
                        placeholder={"Plant name"}
                        label={"Plant name"}
                        required
                    />

                    <Input
                        type={"text"}
                        ref={deptRef}
                        placeholder={"Department name"}
                        label={"Department name"}
                        required
                    />
                </fieldset>

                <fieldset className={Styles.fieldset}>
                    <legend>Account information</legend>

                    <Input
                        type={"email"}
                        ref={emailRef}
                        placeholder={"Email"}
                        label={"Email"}
                        style={{gridColumn: "1/3"}}
                        required
                    />

                    <Input
                        type={"password"}
                        ref={passwordRef}
                        placeholder={"Password"}
                        label={"Password"}
                        required
                    />

                    <Input
                        type={"password"}
                        ref={repPasswordRef}
                        placeholder={"Repeat password"}
                        label={"Repeat password"}
                        required
                    />

                </fieldset>

                <input className={Styles.submit} type={"submit"} value={"SIGN UP"}/>
            </form>
        </div>
    );
}

export default SignUp;