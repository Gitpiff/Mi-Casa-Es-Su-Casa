import { useState } from "react";
import * as sessionActions from '../../store/session';
import { useDispatch } from 'react-redux';
import { useModal } from "../../context/Modal";
import './LoginForm.css'

function LoginFormModal() {
    const dispatch = useDispatch();
    const [ credential, setCredential ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ errors, setErrors ] = useState("");
    const { closeModal } = useModal();

    const handleSubmit = (e) => {
        e.preventDefault();

        setErrors({});

    
        return dispatch(sessionActions.login({ credential, password }))
            .then(closeModal)
            .catch(async res => { 
                    setErrors({message: "Invalid credentials"})
            })
    };

    const demoUser = (e) => {
        e.preventDefault();

        return dispatch(
            sessionActions.login(
                {
                    credential: "Demo-Lition",
                    password: "password"
                }
            )
        )
        .then(closeModal)
    }


    return (
        <>
        <div className="login-form">
            <h1>Log In</h1>
            <form onSubmit={handleSubmit}>
                <span>
                    {errors.message && <h4 style={{color: "red"}}>{errors.message}</h4>}
                </span>
                <label>
                    Username or Email
                    <input
                        type="text"
                        value={credential}
                        onChange={(e) => setCredential(e.target.value)}
                        required
                    />
                </label>

                <label>
                    Password
                    <input
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>

                <button 
                    type="submit"
                    disabled={credential.length < 4 || password.length < 6}
                >
                    Log in
                </button>
                <button className="demo-login" type="submit" onClick={demoUser}>Demo User</button>
            </form>

        </div>
        </>
     );
}

export default LoginFormModal;
