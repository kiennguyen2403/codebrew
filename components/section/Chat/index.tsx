"use client";
import { createClient } from "@/utils/supabase/client";
import { Text } from "@mantine/core";
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

    channel.current
      .on(
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
      )
      .subscribe((status) => {
        console.log(status);
      });

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
    <ChatWrapper>
      <ChatContainer>
        <ChatContact>
          <Text>Chatting with @Lebron James</Text>
        </ChatContact>
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
    </ChatWrapper>
  );
};

export default ChatInterface;

const ChatWrapper = styled.div`
  display: flex;
  justify-content: center;
  height: 100vh;
  width: 100%;
`;

const ChatContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 80vh;
  width: 80%;
  border: 4px solid ${({ theme }) => theme.colors.secondary};
  position: relative;
`;

const ChatContact = styled.div`
  position: absolute;
  top: 2em;
  left: 0em;
  width: fit-content;
  height: fit-content;
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  padding: 0.5em 1em;
  box-shadow: 0 0 10px 0 rgba(0, 0, 0, 0.1);
  outline: 4px solid ${({ theme }) => theme.colors.secondary};
`;

const ChatHistory = styled.div`
  flex: 1;
  max-height: 80vh;
  overflow-y: scroll;
  padding: 1em;
  border-bottom: 1px solid #ccc;
  padding-top: 5em;
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
  background-color: ${({ theme }) => theme.colors.primary};
  color: white;
  border: none;
  border-radius: 5px;
  cursor: pointer;

  &:hover {
    background-color: ${({ theme }) => theme.colors.primary};
    filter: brightness(0.95);
  }
`;
