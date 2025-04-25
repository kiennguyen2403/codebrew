import Image from "next/image";
import styled from "styled-components";

const Decoration = () => {
  return (
    <DecorationWrapper className="decoration">
      <Image
        src="/images/assets/decor.png"
        alt="decoration"
        width={1440}
        height={560}
        className="decor"
      />
    </DecorationWrapper>
  );
};

export default Decoration;

const DecorationWrapper = styled.div`
  width: 100vw;
  height: auto;
  aspect-ratio: 1440/560;
  position: absolute;
  bottom: 0;
  overflow: hidden;
  z-index: 0;

  & > img {
    position: absolute;
    top: 2em;
    width: 100%;
    aspect-ratio: 1440/560;
    height: auto;
  }
`;
