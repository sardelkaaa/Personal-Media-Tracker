import { MantineProvider } from "@mantine/core";
import '@mantine/core/styles.css';
import '@mantine/carousel/styles.css';
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
