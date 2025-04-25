export interface User {
  id: string;
  name: string;
  location: {
    lon: number;
    lat: number;
  };
  avatar: string;
  gender: string;
  hobbies: string[];
  plantCount: number;
  whatsappNumber: string;
}

export interface Plant {
  id: number;
  name: string;
  description: string;
  image: string;
  weather: string;
  location: string;
  growTime: string;
  seedPrice: string;
}

export interface UserPlant extends Plant {
  plantedDate: string;
}

export interface Garden {
  id: number;
  userId: string;
  plants: Plant[];
}

export interface RegisterUser {
  name: string;
  gender: string;
  whatsappNumber: string;
  location: {
    lon: number;
    lat: number;
  };
  hobbies: string[];
  avatar: string;
}
