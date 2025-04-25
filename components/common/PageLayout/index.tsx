"use client";

import { Box } from "@mantine/core";
import ProjectProvider from "./Provider";
import Navbar from "./Navbar";
import styled from "styled-components";

const PageLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <ProjectProvider>
      <Box bg={"bg.0"} mih={"100vh"} w={"100vw"} pos={"relative"}>
        <Navbar />
        <Container>{children}</Container>
      </Box>
    </ProjectProvider>
  );
};

export default PageLayout;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 8em;
  height: 100%;
  width: 100%;
`;
