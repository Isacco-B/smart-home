import images from "@/constants/images";
import Badge from "./Badge";
import { View, Text, Image } from "react-native";
import { ArrowLeft } from "lucide-react-native";
import { router } from "expo-router";
import { useMqtt } from "@/context/MqttContext";

export default function Header({ title }: { title: string }) {
  const { mqttStatus } = useMqtt();

  return (
    <View className="flex flex-row items-center justify-between">
      <View className="flex flex-row items-center gap-2">
        <ArrowLeft size={24} color="#191D31" onPress={() => router.back()} />
        <View className="flex flex-row items-center">
          <Image source={images.Icon} className="size-12" />
          <Text className="font-rubik-semi-bold text-2xl text-black-300 mt-2">
            {title}
          </Text>
        </View>
      </View>
      {mqttStatus === "Connected" && <Badge type="success" title="Connesso" />}
      {mqttStatus === "Reconnecting" && (
        <Badge type="warning" title="Riconnessione" />
      )}
      {mqttStatus === "Offline" ||
        (mqttStatus === "Disconnected" && (
          <Badge type="error" title="Disconnesso" />
        ))}
    </View>
  );
}
