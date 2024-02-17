import { NavLink } from "react-router-dom";
import { useSelector } from "react-redux";
import ProfileButton from "./ProfileButton";
import { FcHome } from "react-icons/fc";
import './Navigation.css'

function Navigation({ isLoaded }) {
    const sessionUser = useSelector((state) => state.session.user);

    return (
       <ul id="header">
        <li style={{fontSize: "20px"}}>
            <NavLink to="/"><FcHome />Mi Casa Es Su Casa</NavLink>
        </li>
        {isLoaded && (
          <li >
            <ProfileButton user={sessionUser} />
          </li>
        )}
       </ul>
    );
}

export default Navigation;
