import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchProfile } from "@/store/slices/profileSlice";
import { AppDispatch, RootState } from "@/store";
import { Stack, Button, Loader, Text } from "@mantine/core";
import { useRouter } from "next/navigation";
import ProfileData from "./ProfileData";
import Link from "next/link";

const UserProfileSection = () => {
  const dispatch: AppDispatch = useDispatch();
  const { profile, loading, error } = useSelector(
    (state: RootState) => state.profile
  );
  const router = useRouter();

  useEffect(() => {
    dispatch(fetchProfile(() => router.push("/onboarding")));
  }, []);

  useEffect(() => {
    if (profile) {
      if (!profile.username) {
        router.push("/onboarding");
      }
    }
  }, [profile]);

  if (loading) {
    return <Loader />;
  }

  return (
    <Stack w={"100%"} h={"100%"} align={"center"}>
      <>
        {profile && <ProfileData profile={profile} />}
        <Button color={"primary"} component={Link} href="/garden" w={"20em"}>
          My Garden
        </Button>
        <Button
          color={"yellow"}
          component={Link}
          href="/achievement"
          w={"20em"}
        >
          Achievements
        </Button>
      </>
    </Stack>
  );
};

export default UserProfileSection;
