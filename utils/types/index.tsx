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
  season: string;
  location: string;
  growTime: number;
  seedPrice: string;
}

export interface UserPlant extends Plant {
  plantedDate: string;
  quantity: number;
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

export interface PostData {
  id: number;
  userId: string;
  content: string;
  image_url?: string;
  is_question?: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreatePostData {
  content: string;
  image_url?: string;
  is_question?: boolean;
}

export interface Achievement {
  id: number;
  title: string;
  description: string;
  unlockedAt?: string;
  unlocked: boolean;
}
