import styled from "styled-components";
import ExploreCanvas from "./ExploreCanvas";
import { AppDispatch, RootState } from "@/store";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { getLocationName } from "@/store/slices/locationSlice";
const Explore = () => {
  const dispatch: AppDispatch = useDispatch();
  const { lat, lon } = useSelector((state: RootState) => state.location);

  useEffect(() => {
    if (lat && lon) {
      dispatch(getLocationName(lat, lon));
    }
  }, [dispatch, lat, lon]);

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
