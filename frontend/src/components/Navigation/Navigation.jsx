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
            <NavLink className="logo" to="/"><FcHome /><span>Mi Casa Es Su Casa</span></NavLink>
        </li>
        {isLoaded && (
          <div className="newSpotContainer">
            <li>
              {sessionUser && <NavLink to='/spots/new' >Create a New Spot</NavLink>}
            </li>
            <li className="profileButton">
              <ProfileButton user={sessionUser} />
            </li>
          </div>
        )}
       </ul>
    );
}

export default Navigation;
