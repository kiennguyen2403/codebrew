import { Plant, User, UserPlant } from "@/utils/types";
import { AVATAR_IMAGES } from "./constant";

export const DUMMY_USERS: User[] = [
  {
    id: "1",
    name: "John Doe",
    avatar: AVATAR_IMAGES[0],
    gender: "male",
    location: {
      lon: 10,
      lat: 10,
    },
    hobbies: ["reading", "traveling", "cooking"],
    whatsappNumber: "1234567890",
    plantCount: 10,
  },
  {
    id: "2",
    name: "Jane Smith",
    avatar: AVATAR_IMAGES[1],
    gender: "female",
    location: {
      lon: 20,
      lat: 20,
    },
    hobbies: ["painting", "hiking", "swimming"],
    whatsappNumber: "0987654321",
    plantCount: 15,
  },
  {
    id: "3",
    name: "Alice Johnson",
    avatar: AVATAR_IMAGES[2],
    gender: "female",
    location: {
      lon: 30,
      lat: 30,
    },
    hobbies: ["gardening", "photography", "yoga"],
    whatsappNumber: "1122334455",
    plantCount: 8,
  },
  {
    id: "4",
    name: "Lebron James",
    avatar: AVATAR_IMAGES[3],
    gender: "male",
    location: {
      lon: 40,
      lat: 40,
    },
    hobbies: ["cycling", "gaming", "fishing"],
    whatsappNumber: "2233445566",
    plantCount: 12,
  },
  {
    id: "5",
    name: "Charlie Davis",
    avatar: AVATAR_IMAGES[4],
    gender: "male",
    location: {
      lon: 50,
      lat: 50,
    },
    hobbies: ["running", "cooking", "reading"],
    whatsappNumber: "3344556677",
    plantCount: 5,
  },
  {
    id: "6",
    name: "Diana Evans",
    avatar: AVATAR_IMAGES[5],
    gender: "female",
    location: {
      lon: 60,
      lat: 60,
    },
    hobbies: ["dancing", "writing", "traveling"],
    whatsappNumber: "4455667788",
    plantCount: 20,
  },
];

export const DUMMY_RECOMMENDED_PLANTS: Plant[] = [
  {
    id: 1,
    name: "Lettuce",
    description: "A leafy green vegetable, perfect for salads",
    image:
      "https://fljnffgnpjpfnzqnewxj.supabase.co/storage/v1/object/public/images/plants%20/Lettuce.png",
    season: "Temperate",
    location: "Garden",
    growTime: 30,
    seedPrice: "$2.50",
  },
  {
    id: 2,
    name: "Spinach",
    description: "A nutrient-rich leafy green, ideal for healthy meals",
    image:
      "https://fljnffgnpjpfnzqnewxj.supabase.co/storage/v1/object/public/images/plants%20/Spinach.png",
    season: "Cool",
    location: "Field",
    growTime: 30,
    seedPrice: "$1.75",
  },
  {
    id: 3,
    name: "Eggplant",
    description: "A versatile vegetable with a rich, meaty texture",
    image:
      "https://fljnffgnpjpfnzqnewxj.supabase.co/storage/v1/object/public/images/plants%20/Eggplant.png",
    season: "Warm",
    location: "Farm",
    growTime: 30,
    seedPrice: "$3.00",
  },
  {
    id: 4,
    name: "Kale",
    description: "A hardy leafy green, packed with vitamins and minerals",
    image:
      "https://fljnffgnpjpfnzqnewxj.supabase.co/storage/v1/object/public/images/plants%20/Kale.png",
    season: "Tropical",
    location: "Greenhouse",
    growTime: 30,
    seedPrice: "$5.00",
  },
  {
    id: 5,
    name: "Broccoli",
    description: "A cruciferous vegetable known for its health benefits",
    image:
      "https://fljnffgnpjpfnzqnewxj.supabase.co/storage/v1/object/public/images/plants%20/Broccoli.png",
    season: "Arid",
    location: "Desert",
    growTime: 30,
    seedPrice: "$4.00",
  },
];

export const DUMMY_NEIGHBOR_PLANTS: UserPlant[] = [
  {
    id: 5,
    name: "Broccoli",
    description: "A cruciferous vegetable known for its health benefits",
    image:
      "https://fljnffgnpjpfnzqnewxj.supabase.co/storage/v1/object/public/images/plants%20/Broccoli.png",
    season: "Arid",
    location: "Desert",
    growTime: 30,
    seedPrice: "$4.00",
    plantedDate: new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .split("T")[0],
    quantity: 10,
  },
  {
    id: 1,
    name: "Lettuce",
    description: "A leafy green vegetable, perfect for salads",
    image:
      "https://fljnffgnpjpfnzqnewxj.supabase.co/storage/v1/object/public/images/plants%20/Lettuce.png",
    season: "Temperate",
    location: "Garden",
    growTime: 30,
    seedPrice: "$2.50",
    plantedDate: new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .split("T")[0],
    quantity: 10,
  },
  {
    id: 2,
    name: "Spinach",
    description: "A nutrient-rich leafy green, ideal for healthy meals",
    image:
      "https://fljnffgnpjpfnzqnewxj.supabase.co/storage/v1/object/public/images/plants%20/Spinach.png",
    season: "Cool",
    location: "Field",
    growTime: 30,
    seedPrice: "$1.75",
    plantedDate: new Date().toISOString().split("T")[0],
    quantity: 10,
  },
];

export const DUMMY_USER_PLANTS: UserPlant[] = [
  {
    id: 1,
    name: "Lettuce",
    description: "A leafy green vegetable, perfect for salads",
    image:
      "https://fljnffgnpjpfnzqnewxj.supabase.co/storage/v1/object/public/images/plants%20/Lettuce.png",
    season: "Temperate",
    location: "Garden",
    growTime: 30,
    seedPrice: "$2.50",
    plantedDate: new Date(new Date().setMonth(new Date().getMonth() - 1))
      .toISOString()
      .split("T")[0],
    quantity: 10,
  },
  {
    id: 2,
    name: "Spinach",
    description: "A nutrient-rich leafy green, ideal for healthy meals",
    image:
      "https://fljnffgnpjpfnzqnewxj.supabase.co/storage/v1/object/public/images/plants%20/Spinach.png",
    season: "Cool",
    location: "Field",
    growTime: 30,
    seedPrice: "$1.75",
    plantedDate: new Date().toISOString().split("T")[0],
    quantity: 10,
  },
  {
    id: 3,
    name: "Eggplant",
    description: "A versatile vegetable with a rich, meaty texture",
    image:
      "https://fljnffgnpjpfnzqnewxj.supabase.co/storage/v1/object/public/images/plants%20/Eggplant.png",
    season: "Warm",
    location: "Farm",
    growTime: 30,
    seedPrice: "$3.00",
    plantedDate: new Date().toISOString().split("T")[0],
    quantity: 10,
  },
];
