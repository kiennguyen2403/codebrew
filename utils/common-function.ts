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

export const calculateRemainingGrowTime = (
  plantedDate: string,
  growTimeinDays: number
) => {
  const plantedDateObj = new Date(plantedDate);
  const currentDate = new Date();
  const timeDiff = currentDate.getTime() - plantedDateObj.getTime();
  const daysDiff = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  console.log(daysDiff);
  return growTimeinDays - daysDiff;
};

export const getRemainingGrowTimeString = (remainingDays: number) => {
  if (remainingDays <= 0) return "Ready to Harvest 🙌";
  if (remainingDays == 7) return "Ready in a week";
  if (remainingDays == 14) return "Ready in two weeks";
  if (remainingDays == 30 || remainingDays == 31) return "Ready in a month";
  return `Ready in ${Math.floor(remainingDays)} days`;
};

export const parseWKTPoint = (wktPoint: string) => {
  // Check if the input string is a valid WKT point
  if (!wktPoint.startsWith("0101000020E6100000")) {
    throw new Error("Invalid WKT point format");
  }

  // Extract the longitude and latitude from the WKT point
  const lonHex = wktPoint.slice(18, 34);
  const latHex = wktPoint.slice(34, 50);

  // Ensure the extracted hex strings are of the correct length
  if (lonHex.length !== 16 || latHex.length !== 16) {
    throw new Error("Invalid WKT point data length");
  }

  // Convert the hexadecimal values to floating-point numbers
  const lon = parseFloat(Buffer.from(lonHex, "hex").readDoubleLE(0).toFixed(6));
  const lat = parseFloat(Buffer.from(latHex, "hex").readDoubleLE(0).toFixed(6));

  return { lon, lat };
};
