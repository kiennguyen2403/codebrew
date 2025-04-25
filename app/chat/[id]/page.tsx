"use client";
import ChatInterface from "@/components/section/Chat";
import { useParams } from "next/navigation";

const ChatNeighbourPage = () => {
  const { id } = useParams();
  return <ChatInterface id={id?.toString() || ""} />;
};

export default ChatNeighbourPage;
