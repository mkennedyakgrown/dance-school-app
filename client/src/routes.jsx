import App from "./App.jsx";
import Admin from "./pages/Admin.jsx";
import Courses from "./pages/Courses.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import Emails from "./pages/Emails.jsx";
import Instructors from "./pages/Instructors.jsx";
import Login from "./pages/Login.jsx";
import Placements from "./pages/Placements.jsx";
import Profile from "./pages/Profile.jsx";
import Reports from "./pages/Reports.jsx";
import Students from "./pages/Students.jsx";
import Suggestions from "./pages/Suggestions.jsx";
import ErrorPage from "./pages/ErrorPage.jsx";

const routes = [
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,
    children: [
      { path: "/", element: <Dashboard /> },
      { path: "/login", element: <Login /> },
      { path: "/admin", element: <Admin /> },
      { path: "/courses", element: <Courses /> },
      { path: "/emails", element: <Emails /> },
      { path: "/instructors", element: <Instructors /> },
      { path: "/placements", element: <Placements /> },
      { path: "/profile", element: <Profile /> },
      { path: "/reports", element: <Reports /> },
      { path: "/students", element: <Students /> },
      { path: "/suggestions", element: <Suggestions /> },
    ],
  },
];

export default routes;
