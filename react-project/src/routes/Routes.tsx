import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { HomePage } from "../pages/HomePage/HomePage";
import { CataloguePage } from "../pages/CataloguePage/CataloguePage";
import { ProfilePage } from "../pages/ProfilePage/ProfilePage";
import { DashboardPage } from "../pages/DashboardPage/DashboardPage";

export const router = createBrowserRouter([
    {
        path: "/",
        element: <App />,
        children: [
            { path: "", element: <HomePage /> },
            { path: "catalogue", element: <CataloguePage /> },
            { path: "profile", element: <ProfilePage />},
            { path: "dashboard", element: <DashboardPage />},
        ]
    }
])