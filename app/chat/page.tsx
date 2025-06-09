"use client";
import {
  getConversations,
  getMessages,
  sendMessages,
} from "@/apis/conversation";
import useUserStore from "@/store/useUserStore";
import {
  Avatar,
  ChatContainer,
  Conversation,
  ConversationHeader,
  ConversationList,
  InfoButton,
  InputToolbox,
  MainContainer,
  Message,
  MessageInput,
  MessageList,
  MessageSeparator,
  TypingIndicator,
  VideoCallButton,
  VoiceCallButton,
} from "@chatscope/chat-ui-kit-react";
import InfiniteScroll from "react-infinite-scroll-component";
import { useMutation, useQuery } from "react-query";
import "@chatscope/chat-ui-kit-styles/dist/default/styles.min.css";
import React, { useCallback, useEffect, useState } from "react";
import type { Conversationtype, MessageType } from "@/types/chatType";
import io from "socket.io-client";
import { User } from "@/types/userType";
import { XIcon } from "lucide-react";
import Image from "next/image";
import "./style.css";
import { useRouter, useSearchParams } from "next/navigation";
let socket: any;
export default function ChatPage() {
  const [text, setText] = useState<string>("");
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const [currentUserChat, setCurrentUserChat] = useState("");
  const [currentConversation, setCurrentConversation] =
    useState<Conversationtype>({} as Conversationtype);
  const [allMessages, setAllMessages] = useState<MessageType[]>([]);
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const searchParams = useSearchParams();
  const conversationId = searchParams.get("id");
  const updateURLWithConversation = useCallback(
    (newConversationId: string) => {
      const currentParams = new URLSearchParams(searchParams.toString());
      currentParams.set("id", newConversationId);
      router.push(`/chat?${currentParams.toString()}`, { scroll: false });
    },
    [router, searchParams]
  );
  const { data: conversations } = useQuery({
    queryKey: ["conversations", user],
    queryFn: () => getConversations(),
  });
  useEffect(() => {
    if (conversationId && conversations?.conversations) {
      const matchedConversation = conversations.conversations.find(
        (conv) => conv._id === conversationId
      );
      if (matchedConversation) {
        setCurrentConversation(matchedConversation);
        setCurrentUserChat(matchedConversation.participants[0]._id);
      }
    }
  }, [conversationId, conversations]);
  useQuery({
    queryKey: ["messages", currentUserChat],
    queryFn: () => getMessages(currentUserChat),
    onSuccess: (data) => {
      setAllMessages(data.slice().reverse());
    },
    enabled: !!currentUserChat,
  });
  const getDateString = (isoString: string) => {
    if (!isoString) return null;
    try {
      return new Date(isoString).toISOString().slice(0, 10);
    } catch (e) {
      console.error("Invalid date string:", isoString, e);
      return null;
    }
  };

  const formatDisplayDate = (isoString: string) => {
    if (!isoString) return "";
    try {
      const date = new Date(isoString);

      return date.toLocaleDateString("vi-VN", {
        weekday: "long", // Thứ
        year: "numeric", // Năm
        month: "long", // Tháng (chữ)
        day: "numeric", // Ngày
      });
    } catch (e) {
      return "Invalid Date";
    }
  };
  const activeConversation = conversations?.conversations.find((conv) =>
    conv.participants.some((p) => p._id === currentUserChat)
  );
  const activeChatParticipant = activeConversation?.participants?.find(
    (p) => p._id === currentUserChat
  );

  const formatSentTime = (isoString: string) => {
    if (!isoString) return "";
    try {
      return new Date(isoString).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch (e) {
      return "";
    }
  };
  const { mutate: sendMessagesFunc } = useMutation({
    mutationFn: sendMessages,
    onSuccess: () => {
      setText("");
      setUploadedFiles([]);
      console.log("Send Messages success:");
    },
    onError: (error: any) => {
      console.error("Error updating user:", error);
    },
  });

  useEffect(() => {
    socket = io("http://localhost:5000");

    socket.on("connect", () => {
      console.log("Connected to Socket.IO server:", socket.id);
      if (user?._id) {
        socket.emit("register", user._id);
        console.log(`Registered user ${user._id} with socket ID ${socket.id}`);
      }
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.IO server");
    });

    socket.on("newMessage", (newMessage: MessageType) => {
      console.log("New message received:", newMessage);
      if (newMessage.conversationId === currentConversation._id) {
        setAllMessages((prevMessages) => [...prevMessages, newMessage]);
      }
    });

    socket.on("getOnlineUsers", (onlineUsers: Array<User>) => {
      console.log("Online users updated:", onlineUsers);
    });

    return () => {
      if (socket) {
        socket.disconnect();
        console.log("Socket.IO connection cleaned up.");
      }
    };
  }, [user?._id, currentConversation._id]);
  // Sử dụng useCallback để tránh việc tái tạo lại hàm
  const handleFileChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const files = event.target.files;
      if (files) {
        setUploadedFiles((prevFiles) => [...prevFiles, ...Array.from(files)]);
      }
    },
    []
  );
  const handleRemoveFile = useCallback((index: number) => {
    setUploadedFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  }, []);
  // Khi người dùng nhập tin nhắn (ví dụ trong MessageInput)
  const handleTyping = (
    innerHtml: string,
    textContent: string,
    innerText: string,
    nodes: NodeList
  ) => {
    setText(textContent);
    const isTyping = textContent.length > 0;
    socket.emit("typing", {
      recipientId: currentUserChat, // ID của người nhận
      senderId: user?._id, // ID của người gửi
      isTyping,
    });
  };
  const [isTyping, setIsTyping] = useState(false);
  useEffect(() => {
    socket.on(
      "typing",
      ({ senderId, isTyping }: { senderId: string; isTyping: boolean }) => {
        console.log("Typing event received:", senderId, isTyping);
        // Nếu senderId trùng với ID của người đang chat cùng
        if (senderId === currentUserChat) {
          setIsTyping(isTyping); // set state hiển thị TypingIndicator
        }
      }
    );

    return () => {
      socket.off("typing");
    };
  }, [socket, currentUserChat]);

  return (
    <div className=" inset-0">
      <MainContainer className="!h-[732x] md:!h-[832px]">
        <ConversationList>
          <InfiniteScroll
            dataLength={conversations?.conversations?.length ?? 0}
            scrollThreshold={-100}
            next={() => {}}
            hasMore={false}
            loader={
              <div
                style={{ textAlign: "center", padding: 12 }}
                className={
                  conversations?.conversations?.length === 0 ? "hidden" : ""
                }
              ></div>
            }
            scrollableTarget="scrollableConversations"
          >
            {conversations?.conversations?.map((conversation) => {
              return (
                <Conversation
                  onClick={() => {
                    if (currentConversation?._id !== conversation._id) {
                      setText("");
                      if (currentConversation?._id) {
                        handleTyping("", "", "", document.createDocumentFragment().childNodes);
                      }
                    }
                    setCurrentUserChat(conversation.participants[0]._id);
                    setCurrentConversation(conversation);
                    updateURLWithConversation(conversation._id);
                  }}
                  className="cursor-pointer"
                  key={conversation._id}
                  name={
                    <div className="flex items-center justify-between">
                      <div className="!text-yy-fs-sm text-neutral-500">
                        {conversation?.participants[0]?.username}
                      </div>
                    </div>
                  }
                  info={[conversation.lastMessage?.text].join(",")}
                  style={{ justifyContent: "start" }}
                >
                  <Avatar
                    className=" size-8"
                    src={
                      conversation.participants[0]?.profilePic ||
                      "https://avatars.githubusercontent.com/u/63188341?s=48&v=4"
                    }
                  />
                </Conversation>
              );
            })}
          </InfiniteScroll>
        </ConversationList>
        {!currentUserChat && (
          <div className="flex p-10 text-center">
            Vui lòng chọn một đoạn chat
          </div>
        )}
        {currentUserChat && (
          <ChatContainer
            style={{
              height: "100%",
            }}
          >
            <ConversationHeader>
              <Avatar
                name={currentConversation.participants[0]?.username || "User"}
                src={
                  currentConversation.participants[0]?.profilePic ||
                  "https://avatars.githubusercontent.com/u/63188341?s=48&v=4"
                }
              />
              <ConversationHeader.Content
                info="Active 10 mins ago"
                userName={
                  currentConversation.participants[0]?.username || "User"
                }
              />
              <ConversationHeader.Actions>
                <VoiceCallButton />
                <VideoCallButton />
                <InfoButton />
              </ConversationHeader.Actions>
            </ConversationHeader>
            <MessageList
              typingIndicator={
                isTyping && (
                  <TypingIndicator content="Người dùng đang nhập tin nhắn" />
                )
              }
            >
              {allMessages?.map((msg, index, arr) => {
                console.log("msg", msg);
                const currentTimestamp = msg?.createdAt || msg?.updatedAt;
                const currentDateStr = getDateString(currentTimestamp ?? ""); // "YYYY-MM-DD" hoặc null

                let showSeparator = false;
                if (currentDateStr) {
                  if (index === 0) {
                    showSeparator = true; // Luôn hiển thị cho tin nhắn đầu tiên
                  } else {
                    const prevTimestamp =
                      arr[index - 1]?.createdAt || arr[index - 1]?.updatedAt;
                    const prevDateStr = getDateString(prevTimestamp);
                    if (prevDateStr && currentDateStr !== prevDateStr) {
                      showSeparator = true;
                    }
                  }
                }
                const isOutgoing = msg?.sender === user?._id;
                const isIncoming = !isOutgoing;
                let showAvatar = false;
                if (isIncoming) {
                  const isLastOverall = index === arr.length - 1;
                  const nextMessage = arr[index + 1];
                  if (
                    isLastOverall ||
                    !nextMessage ||
                    nextMessage.sender !== msg?.sender
                  ) {
                    showAvatar = true;
                  }
                }
                let position: "normal" | "single" | "first" | "last" = "normal";
                const prevMessage = arr[index - 1];
                const nextMessage = arr[index + 1];
                const isFirst =
                  !prevMessage || prevMessage.sender !== msg?.sender;
                const isLast =
                  !nextMessage || nextMessage.sender !== msg?.sender;
                if (isFirst && isLast) position = "single";
                else if (isFirst) position = "first";
                else if (isLast) position = "last";
                return (
                  <React.Fragment key={msg?._id}>
                    {" "}
                    {showSeparator &&
                      currentDateStr && ( // Chỉ render nếu cần và ngày hợp lệ
                        <MessageSeparator
                          key={`sep-${currentDateStr}`} // Key riêng cho separator
                          content={
                            currentTimestamp
                              ? formatDisplayDate(currentTimestamp)
                              : "Invalid Date"
                          } // Định dạng ngày hiển thị
                        />
                      )}
                    {/* Key cho cả nhóm */}
                    <Message
                      type="html"
                      className=""
                      model={{
                        message:
                          msg?.text && msg?.img
                            ? `${msg.text}<br/><img
          alt="message image"
          src="${msg.img}"
          className="imageMess !block object-cover 
          !w-[100px] !h-[100px] !mt-2"
        />`
                            : msg?.text
                              ? msg.text
                              : msg?.img
                                ? `<img
              alt="message image"
              src="${msg.img}"
              className="imageMess !block object-cover 
              !w-[100px] !h-[100px]"
            />`
                                : "",
                        sentTime: currentTimestamp
                          ? formatSentTime(currentTimestamp)
                          : "",
                        sender: isOutgoing
                          ? "You"
                          : activeChatParticipant?.username,
                        direction: isOutgoing ? "outgoing" : "incoming",
                        position,
                      }}
                      avatarSpacer={isIncoming && !showAvatar}
                    >
                      {msg?.img && (
                        <img
                          alt="message image"
                          src={msg?.img}
                          className="imageMess !block object-cover 
                          !w-[100px] !h-[100px]"
                        />
                      )}
                      {showAvatar && (
                        <Avatar
                          src={activeChatParticipant?.profilePic || ""}
                          name={activeChatParticipant?.username}
                        />
                      )}
                    </Message>
                  </React.Fragment>
                );
              })}
            </MessageList>
            <InputToolbox>
              {" "}
              {uploadedFiles.length > 0 && (
                <div className="mt-4">
                  <div className="flex space-x-4">
                    {uploadedFiles.map((file, index) => {
                      console.log("file", file);
                      return (
                        <div key={file.name + index} className="relative">
                          <div
                            className="absolute right-0  top-0 z-10 cursor-pointer"
                            onClick={() => handleRemoveFile(index)}
                          >
                            <XIcon className="m-1 size-5 cursor-pointer rounded-full text-gray-800 transition-all duration-200 ease-in-out hover:bg-gray-200 hover:text-red-500" />
                          </div>
                          {file.type.startsWith("image") ? (
                            <Image
                              height={128}
                              width={128}
                              src={URL.createObjectURL(file)}
                              alt={`uploaded image ${index}`}
                              className="rounded object-cover"
                            />
                          ) : (
                            <video
                              controls
                              className="size-32 rounded object-cover"
                            >
                              <source
                                src={URL.createObjectURL(file)}
                                type={file.type}
                              />
                            </video>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </InputToolbox>
            <MessageInput
              value={text}
              attachButton={true}
              onAttachClick={() =>
                document.getElementById("fileInput")?.click()
              }
              onSend={(content) => {
                console.log("content", content, currentUserChat);
                sendMessagesFunc(
                  {
                    text: content,
                    otherUserId: currentUserChat,
                    image: uploadedFiles,
                  },
                  {
                    onSuccess: (response) => {
                      console.log("Message sent successfully:", response);

                      setUploadedFiles([]);
                    },
                    onError: (error) => {
                      console.error("Error sending message:", error);
                    },
                  }
                );
              }}
              placeholder="Type message here"
              onChange={handleTyping}
            />
          </ChatContainer>
        )}

        <input
          id="fileInput"
          type="file"
          accept="image/*,video/*"
          multiple
          className="hidden"
          onChange={handleFileChange}
        />
      </MainContainer>
    </div>
  );
}
