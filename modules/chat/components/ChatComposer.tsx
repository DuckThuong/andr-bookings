import { useState } from "react";
import { View, Text, TextInput, Pressable, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface ChatComposerProps {
  onSend: (payload: { content?: string }) => void;
  disabled?: boolean;
  placeholder?: string;
  busy?: boolean;
}

export const ChatComposer = ({
  onSend,
  disabled,
  placeholder = "Nhắn tin...",
  busy,
}: ChatComposerProps) => {
  const [text, setText] = useState("");

  const canSend =
    !disabled && !busy && text.trim().length > 0;

  const send = () => {
    if (!canSend) return;
    onSend({ content: text.trim() });
    setText("");
  };

  return (
    <View className="chat-composer">
      <View className="chat-composer__row">
        <View className="chat-composer__actions-left">
          <Pressable
            className="chat-composer__icon-btn"
            disabled
            hitSlop={6}
          >
            <Ionicons
              name="camera-outline"
              size={20}
              color={disabled || busy ? "#d1d5db" : "#6b7280"}
            />
          </Pressable>
          <Pressable
            className="chat-composer__icon-btn"
            disabled
            hitSlop={6}
          >
            <Ionicons
              name="attach"
              size={20}
              color={disabled || busy ? "#d1d5db" : "#6b7280"}
            />
          </Pressable>
        </View>

        <TextInput
          className="chat-composer__input"
          placeholder={placeholder}
          placeholderTextColor="#9ca3af"
          value={text}
          onChangeText={setText}
          editable={!disabled && !busy}
          multiline
          maxLength={2000}
        />

        <View className="chat-composer__actions-right">
          <Pressable
            className="chat-composer__icon-btn"
            disabled
            hitSlop={6}
          >
            <Ionicons name="mic-outline" size={20} color="#9ca3af" />
          </Pressable>
          <Pressable
            className={`chat-composer__send ${!canSend ? "chat-composer__send--disabled" : ""}`}
            onPress={send}
            disabled={!canSend}
          >
            {busy ? (
              <Ionicons name="sync" size={20} color="#fff" />
            ) : (
              <Ionicons name="send" size={18} color="#fff" />
            )}
          </Pressable>
        </View>
      </View>
    </View>
  );
};
