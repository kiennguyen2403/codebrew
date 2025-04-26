import { parseWKTPoint } from "@/utils/common-function";
import { User } from "@/utils/types";
import { Stack, Image, Text, Box } from "@mantine/core";
import styled from "styled-components";
import { useRef, useEffect } from "react";

interface ProfileDataProps {
  profile: User;
}

const ProfileData = ({ profile }: ProfileDataProps) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { left, top, width, height } = card.getBoundingClientRect();
      const x = e.clientX - left;
      const y = e.clientY - top;

      const centerX = width / 2;
      const centerY = height / 2;

      const rotateX = ((y - centerY) / centerY) * -10; // Max 10 degree rotation
      const rotateY = ((x - centerX) / centerX) * 10;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    };

    const handleMouseLeave = () => {
      card.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    };

    card.addEventListener("mousemove", handleMouseMove);
    card.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      card.removeEventListener("mousemove", handleMouseMove);
      card.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <ProfileDataContainer ref={cardRef}>
      <Box
        bg={"bg.2"}
        p={"lg"}
        style={{
          border: "8px dashed #efefef",
        }}
      >
        <Stack align={"center"}>
          <Image src={profile.url} alt="Profile" w={120} h={24} />
          <Text fw={700} fz={"lg"}>
            {profile.username}
          </Text>
          <Text>{profile.hobbies.join(", ")}</Text>
          <Text>{profile.whatsapp}</Text>
          <Text>
            {parseWKTPoint(profile.location).lon},
            {parseWKTPoint(profile.location).lat}
          </Text>
        </Stack>
      </Box>
    </ProfileDataContainer>
  );
};

export default ProfileData;

const ProfileDataContainer = styled.div`
  position: relative;
  transition: all 0.3s ease;
  transform-style: preserve-3d;
  transform: perspective(1000px);
  will-change: transform;

  &::after {
    content: "";
    position: absolute;
    inset: 0;
    z-index: -1;
    background: inherit;
    filter: blur(15px);
    opacity: 0;
    transition: opacity 0.3s ease;
  }

  &:hover::after {
    opacity: 0.7;
  }
`;
