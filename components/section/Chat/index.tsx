"use client";
import { createClient } from "@/utils/supabase/client";
import { RealtimeChannel } from "@supabase/supabase-js";
import React, { useEffect, useRef, useState } from "react";
import styled from "styled-components";

const ChatInterface = ({ id }: { id: string }) => {
  const [messages, setMessages] = useState<string[]>([]);
  const [inputValue, setInputValue] = useState("");
  const channel = useRef<RealtimeChannel | null>(null);

  useEffect(() => {
    if (channel.current || id) return;
    const client = createClient();
    channel.current = client.channel(`conversation ${id}`, {
      config: {
        broadcast: {
          self: true,
        },
      },
    });

    channel.current.on(
      "postgres_changes",
      {
        event: "INSERT",
        schema: "public",
        table: "messages",
        filter: `conversation_id=eq.${id}`,
      },
      (payload) => {
        setMessages([...messages, payload.new.content]);
      }
    );

    return () => {
      if (channel.current) {
        channel.current.unsubscribe();
        channel.current = null;
      }
    };
  }, []);

  const handleSendMessage = () => {
    if (inputValue.trim()) {
      setMessages([...messages, inputValue]);
      setInputValue("");
    }
  };

  return (
    <ChatContainer>
      <ChatHistory>
        {messages.map((message, index) => (
          <Message key={index}>{message}</Message>
        ))}
      </ChatHistory>
      <ChatInputContainer>
        <ChatInput
          type="text"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          placeholder="Type your message..."
        />
        <SendButton onClick={handleSendMessage}>Send</SendButton>
      </ChatInputContainer>
    </ChatContainer>
  );
};

export default ChatInterface;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  width: 100%;
`;

const ChatHistory = styled.div`
  flex: 1;
  max-height: 80vh;
  overflow-y: scroll;
  padding: 1em;
  border-bottom: 1px solid #ccc;
`;

const Message = styled.div`
  margin-bottom: 0.5em;
  padding: 0.5em;
  background-color: #f1f1f1;
  border-radius: 5px;
`;

const ChatInputContainer = styled.div`
  display: flex;
  padding: 1em;
  border-top: 1px solid #ccc;
`;

const ChatInput = styled.input`
  flex: 1;
  padding: 0.5em;
  border: 1px solid #ccc;
  border-radius: 5px;
  margin-right: 0.5em;
`;

const SendButton = styled.button`
  padding: 0.5em 1em;
  background-color: #007bff;
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;
