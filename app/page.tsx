"use client";

import Decoration from "@/components/common/Decoration";
import { SignIn, SignInButton, SignUp, SignUpButton } from "@clerk/nextjs";
import { Button, Flex, Stack, Text, Title } from "@mantine/core";
import Image from "next/image";
import styled from "styled-components";

export default function Home() {
  return (
    <HomeContainer>
      <Stack
        h={"100%"}
        w={"100%"}
        gap={"md"}
        align="center"
        ta={"center"}
        style={{
          zIndex: 1,
        }}
      >
        <LogoImage>
          <Image
            src="/images/logo.png"
            alt="logo"
            width={720}
            height={320}
            objectFit="contain"
          />
        </LogoImage>

        <Stack gap={"0"} ta={"center"}>
          {/* <Title c={"primary"} my={0}>
            {"Growing Roots, Together"}
          </Title> */}
          <Text>
            {"We’re a digital community platform that gamifies urban farming."}
          </Text>
        </Stack>
        <Flex justify={"center"} align={"center"} gap={"md"}>
          <SignInButton />
          <SignUpButton />
        </Flex>
      </Stack>
      <Decoration />
    </HomeContainer>
  );
}

const HomeContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  position: relative;
  height: 100vh;
  overflow: hidden;
`;

const LogoImage = styled.div`
  width: 720px;
  height: 320px;

  & > img {
    width: 100%;
    height: 100%;
    object-fit: contain;
  }
`;
