import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { HomePage } from "../pages/HomePage/HomePage";
import { MoviesCataloguePage } from "../pages/MoviesCataloguePage/MoviesCataloguePage";
import { ProfilePage } from "../pages/ProfilePage/ProfilePage";
import { DashboardPage } from "../pages/DashboardPage/DashboardPage";
import { TvSeriesCataloguePage } from "../pages/TvSeriesCataloguePage/TvSeriesCataloguePage";
import { LoginPage } from "../pages/LoginPage/LoginPage";
import { RegisterPage } from "../pages/RegisterPage/RegisterPage";

import { ProtectedRoute } from "../routes/ProtectedRoute/ProtectedRoute";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "movies_catalogue", element: <MoviesCataloguePage /> },
      { path: "tvseries_catalogue", element: <TvSeriesCataloguePage /> },
      { path: "login", element: <LoginPage /> },
      { path: "register", element: <RegisterPage /> },

      {
        element: <ProtectedRoute />,
        children: [
          { path: "profile", element: <ProfilePage /> },
          { path: "dashboard", element: <DashboardPage /> },
        ],
      },
    ],
  },
]);
