import { Pressable, Text, View } from "react-native";

type StateBlockProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onActionPress?: () => void;
};

export function StateBlock({
  title,
  description,
  actionLabel,
  onActionPress,
}: StateBlockProps) {
  return (
    <View className="items-center rounded-[28px] bg-white_color px-5 py-8">
      <Text className="text-center font-semibold text-lg text-primary_color">
        {title}
      </Text>
      <Text className="mt-2 text-center text-sm leading-5 text-text_color_4">
        {description}
      </Text>
      {actionLabel && onActionPress ? (
        <Pressable className="mt-4 rounded-full bg-background_color px-4 py-2" onPress={onActionPress}>
          <Text className="font-medium text-sm text-secondary_color">
            {actionLabel}
          </Text>
        </Pressable>
      ) : null}
    </View>
  );
}
