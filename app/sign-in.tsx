import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  Image,
} from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { LoginType, useAuth } from "@/context/AuthContext";
import { Eye, EyeOff, KeyRound, LogIn, User } from "lucide-react-native";
import images from "@/constants/images";

export default function SignIn() {
  const { login } = useAuth();
  const [showPassword, setShowPassowrd] = useState<boolean>(false);
  const [formData, setFormData] = useState<LoginType>({
    username: "",
    password: "",
  });

  function handleChange(field: keyof LoginType, value: string) {
    setFormData((prevState) => ({
      ...prevState,
      [field]: value,
    }));
  }

  const isValid =
    formData.username.trim() !== "" && formData.password.trim() !== "";

  return (
    <SafeAreaView className="bg-white h-full">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="min-h-full"
      >
        <KeyboardAvoidingView
          className="h-full p-8"
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          <Text className="font-rubik-semi-bold text-2xl uppercase text-black-300">
            login
          </Text>
          <Image source={images.Icon} className="size-44 self-center mt-8" />
          <Text className="font-rubik-bold text-3xl text-center text-black-300 mt-2">
            Smart Home
          </Text>
          <Text className="font-rubik text-sm text-center text-black-200 mt-2">
            Effettua il login per accedere a Smart Home
          </Text>

          <View className="flex flex-row items-center justify-between w-full border-b border-gray-200 mt-12">
            <View className="flex-1 flex flex-row items-center justify-start">
              <User size={18} color="#8C8E98" />
              <TextInput
                value={formData.username}
                onChangeText={(text) => handleChange("username", text)}
                placeholder="Username"
                className="text-sm font-rubik text-black-300 ml-2 w-full h-12"
              />
            </View>
          </View>

          <View className="flex flex-row items-center justify-between w-full border-b border-gray-200 mt-8">
            <View className="flex-1 flex flex-row items-center justify-start">
              <KeyRound size={18} color="#8C8E98" />
              <TextInput
                value={formData.password}
                onChangeText={(text) => handleChange("password", text)}
                placeholder="Password"
                secureTextEntry={!showPassword}
                className="text-sm font-rubik text-black-300 ml-2 flex-1"
              />
            </View>
            <TouchableOpacity onPress={() => setShowPassowrd(!showPassword)}>
              {showPassword ? (
                <Eye size={18} color="#8C8E98" />
              ) : (
                <EyeOff size={18} color="#8C8E98" />
              )}
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            disabled={!isValid}
            onPress={() => login(formData)}
            className={`rounded-lg w-full py-2 mt-8 ${
              isValid ? "bg-primary-300 " : "bg-primary-200 "
            }`}
          >
            <View className="flex flex-row items-center justify-center gap-2">
              <Text className="text-lg font-rubik-semi-bold text-white">
                Accedi
              </Text>
              <LogIn size={22} color="white" />
            </View>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </ScrollView>
    </SafeAreaView>
  );
}
