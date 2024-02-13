import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import * as sessionActions from '../src/store/session';
import Navigation from "./components/Navigation/Navigation";
import SpotsList from "./components/SpotsList/SpotsList";

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
      }
    ]
  }
])


function App() {
  return <RouterProvider router={router} />
}

export default App;
