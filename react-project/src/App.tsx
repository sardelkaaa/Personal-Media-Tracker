import { AppShell, MantineProvider } from "@mantine/core";
import '@mantine/core/styles.css';
import { Outlet } from "react-router-dom";
import { Navigation } from "./components/Navigation/Navigation";
import { AppLayout } from "./components/AppLayout/AppLayout";

function App() {
  return (
    <>
      <MantineProvider>
        <AppLayout />
      </MantineProvider>
    </>
  );
}

export default App;
