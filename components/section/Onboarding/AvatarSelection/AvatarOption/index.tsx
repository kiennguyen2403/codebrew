import Image from "next/image";
import styled from "styled-components";

interface AvatarOptionProps {
  src: string;
  alt: string;
  selected: boolean;
  setAvatar: (avatar: string) => void;
}

const AvatarOption = ({ src, alt, selected, setAvatar }: AvatarOptionProps) => {
  return (
    <AvatarOptionContainer selected={selected.toString()}>
      <Image
        src={src}
        alt={alt}
        width={120}
        height={240}
        onClick={() => setAvatar(src)}
      />
    </AvatarOptionContainer>
  );
};

export default AvatarOption;

const AvatarOptionContainer = styled.div<{ selected: string }>`
  width: 16vw;
  height: auto;
  aspect-ratio: 1/2;
  overflow: hidden;

  &:hover {
    transform: translateY(-8px);
    cursor: pointer;
  }

  border: ${({ selected }) =>
    selected === "true" ? "8px solid var(--mantine-color-primary-6)" : "none"};

  & > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
