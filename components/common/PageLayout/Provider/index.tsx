import StyledComponentsRegistry from "@/lib/styled-components/registry";
import { store } from "@/store";
import { mantineTheme, styledTheme } from "@/styles/theme";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";

const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <MantineProvider defaultColorScheme="light" theme={mantineTheme}>
        <Notifications />
        <ThemeProvider theme={styledTheme}>
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </ThemeProvider>
      </MantineProvider>
    </Provider>
  );
};

export default ProjectProvider;
