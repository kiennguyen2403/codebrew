"use client";
import { createClient } from "@/utils/supabase/client";
import { UserButton, useUser } from "@clerk/nextjs";
import { SignedIn } from "@clerk/nextjs";
import { SignUpButton } from "@clerk/nextjs";
import { SignedOut } from "@clerk/nextjs";
import { SignInButton } from "@clerk/nextjs";
import { Box, Button, Flex, Stack } from "@mantine/core";
import { RealtimeChannel } from "@supabase/supabase-js";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const Navbar = () => {
  const channel = useRef<RealtimeChannel | null>(null);
  const [notifications, setNotifications] = useState<any[]>([]);
  const { user } = useUser();

  const setupNewTime = async () => {
    if (channel.current || !user?.id) return;

    const client = createClient();

    const { data, error } = await client
      .from("users")
      .select("id")
      .eq("clerk_id", user?.id)
      .single();

    if (error) return;

    console.log("data:", data);
    channel.current = client.channel(`notifications:${user.id}`, {
      config: {
        broadcast: {
          self: true,
        },
      },
    });

    channel.current
      .on(
        "postgres_changes",
        {
          event: "INSERT",
          schema: "public",
          table: "notifications",
          filter: `user_id=eq.${data?.id}`,
        },
        (payload) => {
          setNotifications((prev) => [...prev, payload.new]);
        }
      )
      .subscribe((status) => {
        console.log(status);
      });
  };

  useEffect(() => {
    setupNewTime();
  }, [user?.id]);

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
          <Flex direction={"row"} justify={"flex-end"} align={"center"}>
            <Flex px={"lg"} align={"center"} gap={"md"}>
              <SignedOut>
                <SignInButton />
                <SignUpButton />
              </SignedOut>
            </Flex>
            <SignedIn>
              <Button component={Link} href="/feed" h={"100%"} bg={"purple"}>
                {"What's New"}
              </Button>
              <Button component={Link} href="/explore" h={"100%"} bg={"cyan"}>
                {"Explore"}
              </Button>
              <Button component={Link} href="/garden" h={"100%"} bg={"green"}>
                {"My Garden"}
              </Button>
              <Box h={"100%"} px={"lg"} bg={"white"}>
                <Stack
                  justify={"center"}
                  align={"center"}
                  w={"100%"}
                  h={"100%"}
                >
                  <UserButton />
                </Stack>
              </Box>
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
