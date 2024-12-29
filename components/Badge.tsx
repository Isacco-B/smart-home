import { View, Text } from "react-native";

type BadgeProps = {
  type: "success" | "warning" | "error" | "info";
  title: string;
};

const VARIANTS = {
  success: {
    backgroud: "bg-primary-100",
    text: "text-primary-300",
  },
  warning: {
    backgroud: "bg-yellow-100",
    text: "text-orange-300",
  },
  error: {
    backgroud: "bg-red-100",
    text: "text-red-300",
  },
  info: {
    backgroud: "bg-sky-100",
    text: "text-sky-300",
  },
};

export default function Badge({ type, title }: BadgeProps) {
  return (
    <View className={`${VARIANTS[type].backgroud} px-2 py-0.5 rounded-full`}>
      <Text className={`${VARIANTS[type].text} text-sm font-rubik`}>
        {title}
      </Text>
    </View>
  );
}
