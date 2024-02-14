import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import * as sessionActions from '../src/store/session';
import Navigation from "./components/Navigation/Navigation";
import SpotsList from "./components/SpotsList/SpotsList";
import SpotDetails from "./components/SpotDetails";

function Layout() {
  const dispatch = useDispatch();
  const [ isLoaded, setIsLoaded ] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true))
  }, [dispatch])

  return (
    <>
      <Navigation isLoaded={isLoaded} />
      {isLoaded && <Outlet />}
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <Layout />,
    children: [
      {
        path: "/",
        element: <SpotsList />
      },
      {
        path: "/spots/:spotId",
        element: <SpotDetails />
      }
    ]
  }
])


function App() {
  return <RouterProvider router={router} />
}

export default App;
