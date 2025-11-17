import { MantineProvider } from "@mantine/core";
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
import '@mantine/notifications/styles.css';
import { AppLayout } from "./components/AppLayout/AppLayout";
import { Notifications } from "@mantine/notifications";

function App() {
  return (
    <>
      <MantineProvider>
        <Notifications />
        <AppLayout />
      </MantineProvider>
    </>
  );
}

export default App;
