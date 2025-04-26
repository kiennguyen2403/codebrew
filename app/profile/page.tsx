"use client";

import { Stack } from "@mantine/core";
import UserProfileSection from "@/components/section/Profile";

const UserProfilePage = () => {
  return (
    <Stack w={"100%"} h={"100%"} align={"center"}>
      <UserProfileSection />
    </Stack>
  );
};

export default UserProfilePage;
