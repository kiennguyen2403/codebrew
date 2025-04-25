export const getRandomNumber = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const getTitleFromPlantCount = (plantCount: number) => {
  if (plantCount <= 1) return "Pea Shoot";
  if (plantCount >= 4 && plantCount < 8) return "Sapling";
  if (plantCount >= 8 && plantCount < 12) return "Urban Planter";
  if (plantCount >= 12 && plantCount < 16) return "Pocket Forest";
  if (plantCount >= 16) return "Eco Champ";
  return "Pea Shoot"; // Default case for plantCount 2 or 3
};
