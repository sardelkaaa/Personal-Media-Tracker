import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { HomePage } from "../pages/HomePage/HomePage";
import { MoviesCataloguePage } from "../pages/MoviesCataloguePage/MoviesCataloguePage";
import { ProfilePage } from "../pages/ProfilePage/ProfilePage";
import { DashboardPage } from "../pages/DashboardPage/DashboardPage";
import { SeriesCataloguePage } from "../pages/SeriesCataloguePage/SeriesCataloguePage";

export const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      { path: "", element: <HomePage /> },
      { path: "movies_catalogue", element: <MoviesCataloguePage /> },
      { path: "series_catalogue", element: <SeriesCataloguePage /> },
      { path: "profile", element: <ProfilePage /> },
      { path: "dashboard", element: <DashboardPage /> },
    ],
  },
]);
