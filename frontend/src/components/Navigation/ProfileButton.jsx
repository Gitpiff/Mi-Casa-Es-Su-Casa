import { useState, useEffect, useRef } from "react";
import { FaUserAstronaut } from "react-icons/fa";
import { useDispatch } from "react-redux";
import * as sessionActions from "../../store/session";
import SignUpFormModal from "../SignupFormModal/SignUpFormPage";
import LoginFormModal from "../LoginFormModal/LoginFormModal";
import OpenModalMenuItem from "./OpenModalMenuItem";
import { useNavigate } from "react-router-dom";

function ProfileButton({user}) {
    const dispatch = useDispatch();
    const navigate = useNavigate();
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
            if (ulRef.current && !ulRef.current.contains(e.target)) {
                setShowMenu(false)
            }
        };

        document.addEventListener('click', closeMenu);

        return () => document.removeEventListener('click', closeMenu);
    }, [showMenu])

    const closeMenu = () => setShowMenu(false);

    const ulClassName = "profile-dropdown" + (showMenu ? "" : "hidden");

    const logout = (e) => {
        e.preventDefault();

        dispatch(sessionActions.logout());
        closeMenu();
        navigate('/');
    };

    const manageSpots = (e) => {
        e.preventDefault();
        closeMenu();
        navigate('/spots/current');
    }

    return (
       <>
            <div className="menu">
                <button className="menuIcon" style={{cursor: "pointer"}} onClick={toggleMenu}>
                    <FaUserAstronaut />
                </button>
            </div>
           
                <div className={ulClassName} ref={ulRef}>
                    { user ? (
                        <>
                            <li>Hello, {user.username}</li>
                            {/* <li>{user.firstName} {user.lastName}</li> */}
                            <li>{user.email}</li>
                            <li style={{cursor: "pointer"}} onClick={manageSpots}>Manage Spots</li>
                            <li>
                                <button onClick={logout}>
                                    Log Out
                                </button>
                            </li>
                        </>
                    ) : (
                        <>
                            <li style={{cursor: "pointer"}}>
                                <OpenModalMenuItem
                                    itemText="Log In"
                                    onButtonClick={closeMenu}
                                    modalComponent={<LoginFormModal />}
                                />
                            </li>
                            <li style={{cursor: "pointer"}}>
                                <OpenModalMenuItem
                                    itemText="Sign Up"
                                    onButtonClick={closeMenu}
                                    modalComponent={<SignUpFormModal />}
                                />
                            </li>
                        </>
                    )
                }

                </div>
        
       </>
     );
}

export default ProfileButton;
