import Image from "next/image";
import styled from "styled-components";

interface GardenCanvasProps {
  children: React.ReactNode;
}

const SCENERY_NOON =
  "https://fljnffgnpjpfnzqnewxj.supabase.co/storage/v1/object/public/images//background_afternoon.png";

const GardenCanvas = ({ children }: GardenCanvasProps) => {
  return (
    <GardenCanvasContainer>
      {children}
      <GardenBackgroundImage>
        <Image
          src={SCENERY_NOON}
          alt="garden background"
          width={1440}
          height={900}
          objectFit="cover"
        />
      </GardenBackgroundImage>
    </GardenCanvasContainer>
  );
};

export default GardenCanvas;

const GardenCanvasContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  border: 20px solid ${({ theme }) => theme.colors.secondary};
  width: 90%;
  height: 85vh;
  position: relative;
  overflow: hidden;
  background-color: ${({ theme }) => theme.colors.primary};

  @media (max-width: 768px) {
    height: 100vh;
  }
`;

const GardenBackgroundImage = styled.div`
  z-index: 0;
  position: absolute;
  width: 100%;
  height: 100%;
  opacity: 0.33;
  filter: blur(4px);

  & > img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
