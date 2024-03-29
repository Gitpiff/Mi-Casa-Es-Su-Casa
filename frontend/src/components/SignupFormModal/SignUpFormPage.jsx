import { useState } from "react";
import { useDispatch } from "react-redux";
import * as sessionActions from '../../store/session';
import './SignUpForm.css'
import { useModal } from "../../context/Modal";

function SignUpFormModal() {
    const dispatch = useDispatch();
    const [ username, setUsername ] = useState("");
    const [ firstName, setFirstName ] = useState("");
    const [ lastName, setLastName ] = useState("");
    const [ email, setEmail ] = useState("");
    const [ password, setPassword ] = useState("");
    const [ confirmPassword, setConfirmPassword ] = useState("");
    const [ errors, setErrors ] = useState({});
    const { closeModal } = useModal();


    const handleSubmit = (e) => {
        e.preventDefault();

        setErrors({});

        if(password !== confirmPassword) {
            return setErrors({
                confirmPassword: "Confirm Password field must be the same as the Password field"
            })
        }

        return dispatch(sessionActions.signUp(
            {
                username,
                firstName,
                lastName,
                email,
                password
            }
        ))
            .then(closeModal)
            .catch(
            async (res) => {
                const data = await res.json();
                if(data?.errors) setErrors(data.errors)
            }
        )
    }

    return (
        <>
            <h1>Sign Up</h1>
            <form onSubmit={handleSubmit}>
                <label htmlFor="">
                    Email
                    <input
                        type="text"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </label>
                {errors.email && <p>{errors.email}</p>}

                <label htmlFor="">
                    Username
                    <input
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                </label>
                {errors.username && <p>{errors.username}</p>}

                <label htmlFor="">
                    FirstName
                    <input
                        type="text"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                </label>
                {errors.firstName && <p>{errors.firstName}</p>}

                <label htmlFor="">
                    LastName
                    <input
                        type="text"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                </label>
                {errors.lastname && <p>{errors.lastname}</p>}

                <label htmlFor="">
                    Password
                    <input
                        type="text"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </label>
                {errors.password && <p>{errors.password}</p>}

                <label htmlFor="">
                    Confirm Password
                    <input
                        type="text"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                    />
                </label>
                {errors.confirmPassword && <p>{errors.confirmPassword}</p>}

                <button type="submit">Sign up</button>
            </form>
        </>
    );
}

export default SignUpFormModal;
