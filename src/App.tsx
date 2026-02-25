import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { RouterProvider } from "react-router";
import router from "./routes/routes";
import ModalContextProvider from "./stores/ModalContext";
import theme from "./themes/theme";

function App() {
  return (
    <MantineProvider theme={theme} forceColorScheme="light">
      <ModalContextProvider>
        <RouterProvider router={router} />
      </ModalContextProvider>
      <Notifications />
    </MantineProvider>
  );
}

export default App;
