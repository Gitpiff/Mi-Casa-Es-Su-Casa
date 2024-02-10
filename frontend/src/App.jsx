import { Outlet, RouterProvider, createBrowserRouter } from "react-router-dom";
import LoginFormPage from "./components/LoginFormPage";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import * as sessionActions from '../src/store/session';
import SignUpFormPage from "./components/SignupFormPage";

function Layout() {
  const dispatch = useDispatch();
  const [ isLoaded, setIsLoaded ] = useState(false);

  useEffect(() => {
    dispatch(sessionActions.restoreUser()).then(() => setIsLoaded(true))
  }, [dispatch])

  return (
    <>
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
        element: <h1>Welcome!</h1>
      },
      {
        path: "/login",
        element: <LoginFormPage />
      },
      {
        path: "/signup",
        element: <SignUpFormPage />
      }
    ]
  }
])


function App() {
  return <RouterProvider router={router} />
}

export default App;
