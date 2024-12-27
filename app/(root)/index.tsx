import { useAuth } from "@/context/AuthContext";
import { router } from "expo-router";
import { ArrowRight, LogOut } from "lucide-react-native";
import {
  Alert,
  Image,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import images from "@/constants/images";

type NavigationButtonProps = {
  title: string;
  subtitle: string;
  imageSource: any;
  onPress: () => void;
};

function NavigationButton({
  title,
  subtitle,
  imageSource,
  onPress,
}: NavigationButtonProps) {
  return (
    <TouchableOpacity
      className="flex flex-col gap-2 bg-white w-full rounded-xl p-4"
      onPress={onPress}
    >
      <View className="flex flex-row items-center justify-between">
        <Image source={imageSource} className="size-8" />
        <View>
          <Text className="font-rubik-medium text-lg text-black-300">
            {title}
          </Text>
          <Text
            className="font-rubik text-sm text-black-100 max-w-[80%]"
            numberOfLines={2}
          >
            {subtitle}
          </Text>
        </View>

        <View className="bg-primary-100 p-2 rounded-full">
          <ArrowRight size={18} color="#00a3a4" />
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function HomePage() {
  const { logout } = useAuth();

  function handleLogout() {
    Alert.alert(
      "Sei sicuro di volerti disconnettere?",
      "Una volta disconnesso dovrai inserire nuovamente le tue credenziali di accesso",
      [
        {
          text: "Annulla",
          style: "cancel",
        },
        { text: "Conferma", onPress: () => logout() },
      ]
    );
  }

  return (
    <SafeAreaView className="bg-gray-100 h-full">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="h-full"
      >
        <View className="h-full px-8 py-6">
          <View className="flex flex-row items-center justify-center">
            <Image source={images.Icon} className="size-14" />
            <Text className="font-rubik-bold text-3xl text-black-300 mt-2">
              Smart Home
            </Text>
          </View>
          <Text className="font-rubik text-base max-w-[80%] self-center text-center text-black-200 mt-2">
            Benvenuto in Smart Home, seleziona un servizio.
          </Text>
          <View className="flex-1">
            <View className="flex flex-col gap-8 mt-20">
              <NavigationButton
                title="Cancello"
                subtitle="Controlla e monitora il cancello"
                imageSource={images.Fence}
                onPress={() => router.push("/gate")}
              />
              <NavigationButton
                title="Irrigazione"
                subtitle="Pianifica e monitora l'irrigazione"
                imageSource={images.Plant}
                onPress={() => router.push("/irrigation")}
              />
              <NavigationButton
                title="Cisterna"
                subtitle="Controlla e monitora la cisterna"
                imageSource={images.Water}
                onPress={() => router.push("/tank")}
              />
            </View>
          </View>
          <TouchableOpacity
            onPress={handleLogout}
            className="bg-white w-full rounded-xl p-4"
          >
            <View className="flex flex-row items-center justify-between">
              <Text className="font-rubik-medium text-lg text-black-300">
                Disconnettiti
              </Text>
              <LogOut size={18} color="#F75555" />
            </View>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
