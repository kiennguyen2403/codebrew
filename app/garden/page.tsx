"use client";

import UserGarden from "@/components/section/Garden";
import { Stack } from "@mantine/core";

const MyGardenPage = () => {
  return (
    <Stack justify="center" align="center" p={"2em"}>
      <UserGarden />
    </Stack>
  );
};

export default MyGardenPage;
