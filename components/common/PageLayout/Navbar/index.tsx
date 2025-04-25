import { UserButton } from "@clerk/nextjs";
import { SignedIn } from "@clerk/nextjs";
import { SignUpButton } from "@clerk/nextjs";
import { SignedOut } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import { Box, Button, Flex } from "@mantine/core";
import Image from "next/image";
import Link from "next/link";
import styled from "styled-components";

const Navbar = () => {
  return (
    <NavbarWrapper>
      <Box style={{ zIndex: 1, border: "1px solid black" }}>
        <Flex
          bg={"#ffff"}
          w={"90vw"}
          h={"4em"}
          justify={"space-between"}
          pl={"lg"}
        >
          <LogoContainer href="/">
            <Image
              src="/images/urbanteria_text_logo.png"
              alt="logo"
              width={200}
              height={80}
              objectFit="contain"
            />
          </LogoContainer>
          <Flex
            direction={"row"}
            gap={"md"}
            justify={"flex-end"}
            align={"center"}
            px={"md"}
          >
            <Button component={Link} href="/explore">
              {"Explore"}
            </Button>
            <Button component={Link} href="/garden">
              {"My Garden"}
            </Button>
            <SignedOut>
              <SignInButton />
              <SignUpButton />
            </SignedOut>
            <SignedIn>
              <UserButton />
            </SignedIn>
          </Flex>
        </Flex>
      </Box>
      <OutlineBox />
    </NavbarWrapper>
  );
};

export default Navbar;

const NavbarWrapper = styled.div`
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;

  top: 1em;
  left: 50%;
  transform: translateX(-50%);
  z-index: 100;
`;

const OutlineBox = styled.div`
  position: absolute;

  width: 88vw;
  height: 4em;
  margin-top: 1em;
  z-index: 0;
  background-color: transparent;
  border: 1px solid black;
`;

const LogoContainer = styled.a`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  width: 33%;

  & > img {
    width: 80%;
    height: 75%;
    object-fit: contain;
    object-position: left;
  }
`;
