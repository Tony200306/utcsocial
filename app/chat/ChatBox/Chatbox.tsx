/* eslint-disable react/no-unknown-property */
import {
  Avatar,
  ChatContainer,
  ConversationHeader,
  Message,
  MessageInput,
  MessageList,
  MessageSeparator,
} from "@chatscope/chat-ui-kit-react";
import { FC, useMemo, useState } from "react";
// import { useTranslation } from "react-i18next";
import avatarImage from "~/assets/images/avatar.png";
// import { EmptyWithI18n } from "~/components/EmptyWithI18n/EmptyWithI18n";
// import { IconRecoveryConvert } from "~/components/Icons/IconRecoveryConvert";
// import {
//   FacebookConversation,
//   FacebookMessage,
// } from "~/models/FacebookMessage";
// import { getMessageError } from "~/services/_shared/utils/getMessageError";
// import { notification, Spin, Tag } from "~/shared/ReactComponent";
// import { dayjs } from "~/shared/Utilities";
import "./styles.css";
import { Conversationtype, MessageType } from "@/types/chatType";

export interface MessageValue {
  text: string;
}
const defaultMessageValue: MessageValue = {
  text: "",
};

interface Props {
  conversation: Conversationtype | null;
  messages: MessageType[];
  isLoading?: boolean;
  onViewChangelog?: () => void;
  onSendMessage: (value: MessageValue) => Promise<void>;
  hasMore: boolean;
  isLoadingMore: boolean;
  onLoadmore: () => void;
}

export const Chatbox: FC<Props> = ({
  conversation,
  messages,
  isLoading,
  onViewChangelog,
  onSendMessage,
  hasMore,
  isLoadingMore,
  onLoadmore,
}) => {
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [messageValue, setMessageValue] =
    useState<MessageValue>(defaultMessageValue);

  const handleSendMessage = async () => {
    setIsSendingMessage(true);
    try {
      await onSendMessage(messageValue);
      setMessageValue(defaultMessageValue);
    } catch (error) {
    } finally {
      setIsSendingMessage(false);
    }
  };

  const grouppedMessages = useMemo(() => {
    type GroupedMessages = {
      date: string;
      messages: MessageType[];
    }[];
    const groups: GroupedMessages = [];

    for (const msg of messages) {
      const msgDate = dayjs(msg.createdAt);
      const dateLabel = msgDate.format("D MMMM");

      const lastGroup = groups[groups.length - 1];
      if (
        lastGroup &&
        dayjs(lastGroup.messages[0].createdAt).isSame(msgDate, "day")
      ) {
        lastGroup.messages.push(msg);
      } else {
        groups.push({ date: dateLabel, messages: [msg] });
      }
    }

    return groups;
  }, [messages]);

  if (!conversation) {
    return;
  }
  console.log(conversation, "conversation");

  return (
    <ChatContainer>
      <ConversationHeader className="CurrentConversationUserInfo__container">
        <Avatar src={conversation.participants[0].profilePic} />
        <ConversationHeader.Content
          userName={conversation.participants[0].name}
          info={<div className="flex items-center gap-1"></div>}
        />
      </ConversationHeader>
      <MessageList
        loadingMore={isLoadingMore}
        onYReachStart={() => {
          if (hasMore) {
            onLoadmore?.();
          }
        }}
        className="CurrentConversationListMessages__container"
      >
        <div>
          {grouppedMessages.map((group) => {
            return (
              <>
                <MessageSeparator key={group.date} content={group.date} />
                {group.messages.map((msg, index) => {
                  const isMe = msg.sender === "sender-001";
                  const nextMsg = group.messages[index + 1];
                  const isSameSender = nextMsg && nextMsg.sender === msg.sender;
                  return (
                    <Message
                      key={msg._id}
                      model={{
                        message: msg.text,
                        direction: isMe ? "outgoing" : "incoming",
                        position: "single",
                      }}
                      avatarSpacer={!isMe && isSameSender}
                    >
                      {isMe || isSameSender ? null : (
                        <Avatar src={avatarImage.src} />
                      )}
                    </Message>
                  );
                })}
              </>
            );
          })}
        </div>
      </MessageList>
      {/* @ts-ignore */}
      <div className="Sender__container" as="MessageInput">
        <div className="flex flex-wrap items-center gap-1"></div>
        <MessageInput
          sendButton={false}
          attachButton={false}
          value={messageValue.text}
          onChange={(value) => {
            if (isSendingMessage) {
              return;
            }
            setMessageValue({ text: value });
          }}
          onSend={handleSendMessage}
        />
        {/* FIXME: UI các nút */}
      </div>
    </ChatContainer>
  );
};
