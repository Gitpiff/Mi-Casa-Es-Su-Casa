import { useState, useEffect, useRef } from "react";
import { FaUserAstronaut } from "react-icons/fa";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import OpenModalButton from "../OpenModalButton/OpenModalButton";
import SignUpFormModal from "../SignupFormModal/SignUpFormPage";
import LoginFormModal from "../LoginFormModal/LoginFormModal";

function ProfileButton({user}) {
    const dispatch = useDispatch();
    const [ showMenu, setShowMenu ] = useState(false);
    const ulRef = useRef()

    const toggleMenu = (e) => {
        e.stopPropagation(); // Keep click from bubbling up to document and triggering closeMenu
        // if (!showMenu) setShowMenu(true);
        setShowMenu(!showMenu);
      };


    useEffect(() => {
        if (!showMenu) return;

        const closeMenu = (e) => {
            if (!ulRef.current.contains(e.target)) {
                setShowMenu(false)
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener('click', closeMenu);
    }, [showMenu])

    const ulClassName = "profile-dropdown" + (showMenu ? "" : "hidden");

    const logout = (e) => {
        e.preventDefault();

        dispatch(sessionActions.logout());
    };

    return (
       <>
            <button onClick={toggleMenu}>
                <FaUserAstronaut />
            </button>
            <ul className={ulClassName} ref={ulRef}>
                { user ? (
                    <>
                        <li>{user.username}</li>
                        <li>{user.firstName} {user.lastName}</li>
                        <li>{user.email}</li>
                        <li>
                            <button onClick={logout}>
                                Log Out
                            </button>
                        </li>
                    </>
                ) : (
                    <>
                        <li>
                            <OpenModalButton
                                buttonText="Log In"
                                modalComponent={<LoginFormModal />}
                            />
                        </li>
                        <li>
                            <OpenModalButton
                                buttonText="Sign Up"
                                modalComponent={<SignUpFormModal />}
                            />
                        </li>
                    </>
                )
            }
            </ul>
       </>
     );
}

export default ProfileButton;
