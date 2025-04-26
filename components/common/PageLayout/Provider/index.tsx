import StyledComponentsRegistry from "@/lib/styled-components/registry";
import { store } from "@/store";
import { mantineTheme, styledTheme } from "@/styles/theme";
import { MantineProvider } from "@mantine/core";
import { Notifications } from "@mantine/notifications";
import { Provider } from "react-redux";
import { ThemeProvider } from "styled-components";
import "@mantine/core/styles.css";
import "@mantine/notifications/styles.css";
import "@mantine/dates/styles.css";

const ProjectProvider = ({ children }: { children: React.ReactNode }) => {
  return (
    <Provider store={store}>
      <MantineProvider defaultColorScheme="light" theme={mantineTheme}>
        <Notifications position="top-left" />
        <ThemeProvider theme={styledTheme}>
          <StyledComponentsRegistry>{children}</StyledComponentsRegistry>
        </ThemeProvider>
      </MantineProvider>
    </Provider>
  );
};

export default ProjectProvider;
