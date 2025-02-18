import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./App.css";
import Home from "./components/Home";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import Jobs from "./components/Jobs";
import Browse from "./components/Browse";
import { Toaster } from "./components/ui/toaster";

const approuter = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  },
  {
    path: "/job",
    element: <Jobs />,
  },
  {
    path: "/browse",
    element: <Browse />,
  },
]);
function App() {
  return (
    <div>
      <RouterProvider router={approuter} />
      <Toaster />
    </div>
  );
}

export default App;
