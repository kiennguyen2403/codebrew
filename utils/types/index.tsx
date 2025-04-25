interface User {
  id: string;
  name: string;
  location: string;
  avatar: string;
  gender: string;
  hobbies: string[];
  plantCount: number;
}

interface Plant {
  id: number;
  name: string;
  description: string;
  image: string;
  weather: string;
  location: string;
  growTime: string;
  seedPrice: string;
}

interface UserPlant extends Plant {
  plantedDate: string;
}

interface Garden {
  id: number;
  userId: string;
  plants: Plant[];
}
