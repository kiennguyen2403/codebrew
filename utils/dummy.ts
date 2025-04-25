import { User } from "@/utils/types";

const DUMMY_USER: User = {
  id: "1",
  name: "John Doe",
  avatar: "/images/assets/avatar.png",
  gender: "male",
  location: {
    lon: 10,
    lat: 10,
  },
  hobbies: ["reading", "traveling", "cooking"],
  whatsappNumber: "1234567890",
  plantCount: 10,
};

export default DUMMY_USER;
