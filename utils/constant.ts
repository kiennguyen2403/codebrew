import { Achievement } from "./types";

export const PLACEHOLDER_AVATAR = "/images/assets/avatar.png";
export const PLACEHOLDER_PLANT =
  "https://fljnffgnpjpfnzqnewxj.supabase.co/storage/v1/object/public/images/plants%20/Turnip.png";

export const AVATAR_IMAGES = [
  "https://fljnffgnpjpfnzqnewxj.supabase.co/storage/v1/object/public/images/avatars/Frame%201.png",
  "https://fljnffgnpjpfnzqnewxj.supabase.co/storage/v1/object/public/images/avatars/Frame%202.png",
  "https://fljnffgnpjpfnzqnewxj.supabase.co/storage/v1/object/public/images/avatars/Frame%203.png",
  "https://fljnffgnpjpfnzqnewxj.supabase.co/storage/v1/object/public/images/avatars/Frame%204.png",
  "https://fljnffgnpjpfnzqnewxj.supabase.co/storage/v1/object/public/images/avatars/Frame%205.png",
  "https://fljnffgnpjpfnzqnewxj.supabase.co/storage/v1/object/public/images/avatars/Frame%206.png",
  "https://fljnffgnpjpfnzqnewxj.supabase.co/storage/v1/object/public/images/avatars/Frame%207.png",
  "https://fljnffgnpjpfnzqnewxj.supabase.co/storage/v1/object/public/images/avatars/Frame%208.png",
];

export const HOBBIES = [
  "Gardening",
  "Cooking",
  "Reading",
  "Writing",
  "Painting",
  "Traveling",
  "Photography",
  "Drawing",
  "Knitting",
  "Cycling",
  "Hiking",
  "Fishing",
  "Swimming",
  "Running",
  "Yoga",
  "Dancing",
  "Singing",
  "Playing Musical Instruments",
  "Bird Watching",
  "Collecting",
  "Baking",
  "Woodworking",
  "Pottery",
  "Scrapbooking",
  "Meditation",
  "Chess",
  "Video Gaming",
  "Blogging",
  "Volunteering",
  "Astronomy",
];

export const ACHIEVEMENT_1_KEY = "urbanteria_achievement_1";
export const ACHIEVEMENT_2_KEY = "urbanteria_achievement_2";

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: 1,
    title: "First Tomato Planting",
    description: "Planted first tomato seeds and excited to see them grow.",
    unlockedAt: "2025-10-10",
    unlocked: true,
  },
  {
    id: 2,
    title: "Aphid Management Inquiry",
    description: "Asked for advice on dealing with aphids on roses.",
    unlocked: false,
  },
  {
    id: 3,
    title: "Carrot Harvest",
    description: "Harvested a bunch of carrots, fresh and sweet.",
    unlocked: false,
  },
  {
    id: 4,
    title: "Tulip Bulb Planting Time",
    description: "Inquired about the best time to plant tulip bulbs.",
    unlocked: false,
  },
  {
    id: 5,
    title: "Sunflower Bloom",
    description: "Sunflowers are finally blooming and they're tall.",
    unlocked: false,
  },
  {
    id: 6,
    title: "Organic Fertilizer Recommendation",
    description: "Requested recommendations for a good organic fertilizer.",
    unlocked: false,
  },
  {
    id: 7,
    title: "Raised Bed Construction",
    description: "Built a new raised bed for veggies, ready to plant.",
    unlocked: false,
  },
  {
    id: 8,
    title: "Squirrel Deterrent Inquiry",
    description: "Asked how to keep squirrels away from the garden.",
    unlocked: false,
  },
  {
    id: 9,
    title: "Strawberry Harvest",
    description: "Picked the first batch of strawberries, delicious.",
    unlocked: false,
  },
];

export const NEIGHBOUR_ACHIEVEMENTS: Achievement[] = [
  {
    id: 1,
    title: "First Tomato Planting",
    description: "Planted first tomato seeds and excited to see them grow.",
    unlockedAt: "2025-10-10",
    unlocked: true,
  },
  {
    id: 2,
    title: "Aphid Management Inquiry",
    description: "Asked for advice on dealing with aphids on roses.",
    unlocked: true,
    unlockedAt: "2025-10-10",
  },
  {
    id: 3,
    title: "Carrot Harvest",
    description: "Harvested a bunch of carrots, fresh and sweet.",
    unlocked: true,
    unlockedAt: "2025-10-10",
  },
  {
    id: 4,
    title: "Tulip Bulb Planting Time",
    description: "Inquired about the best time to plant tulip bulbs.",
    unlocked: true,
    unlockedAt: "2025-10-10",
  },
  {
    id: 5,
    title: "Sunflower Bloom",
    description: "Sunflowers are finally blooming and they're tall.",
    unlocked: true,
    unlockedAt: "2025-10-10",
  },
  {
    id: 6,
    title: "Organic Fertilizer Recommendation",
    description: "Requested recommendations for a good organic fertilizer.",
    unlocked: false,
  },
  {
    id: 7,
    title: "Raised Bed Construction",
    description: "Built a new raised bed for veggies, ready to plant.",
    unlocked: false,
  },
  {
    id: 8,
    title: "Squirrel Deterrent Inquiry",
    description: "Asked how to keep squirrels away from the garden.",
    unlocked: false,
  },
  {
    id: 9,
    title: "Strawberry Harvest",
    description: "Picked the first batch of strawberries, delicious.",
    unlocked: false,
  },
];
