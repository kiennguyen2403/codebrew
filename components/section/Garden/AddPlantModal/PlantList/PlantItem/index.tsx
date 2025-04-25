import styled from "styled-components";
import Image from "next/image";

interface PlantItemProps {
  id: number;
  image: string;
  name: string;
  selected: boolean;
  handleSelect: (id: number) => void;
}

const PlantItem = ({
  id,
  image,
  name,
  selected,
  handleSelect,
}: PlantItemProps) => {
  return (
    <PlantItemContainer
      selected={selected.toString()}
      onClick={() => handleSelect(id)}
    >
      <Image src={image} alt={name} width={120} height={120} />
    </PlantItemContainer>
  );
};

export default PlantItem;

const PlantItemContainer = styled.div<{ selected: string }>`
  display: flex;
  justify-content: center;
  align-items: center;

  width: 4em;
  height: 4em;

  & > img {
    width: 90%;
    height: 90%;
  }

  transition: ease-in-out 0.2s;

  background-color: ${({ selected }) =>
    selected === "true" ? "white" : "#3333333d"};

  opacity: 0.85;

  &:hover {
    opacity: 1;
    cursor: pointer;
  }
`;
