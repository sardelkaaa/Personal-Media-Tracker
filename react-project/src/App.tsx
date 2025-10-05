import { MantineProvider } from '@mantine/core';
import { Outlet } from "react-router-dom";

function App() {
  return (
    <>
    <MantineProvider>
      <Outlet />
    </MantineProvider>
    </>
  )
}

export default App
