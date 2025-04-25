import styled from "styled-components";
import ExploreCanvas from "./ExploreCanvas";

const Explore = () => {
  return (
    <ExploreContainer>
      <ExploreCanvas />
    </ExploreContainer>
  );
};

export default Explore;

const ExploreContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 100%;
  height: 100%;
  padding: 1em;
`;
