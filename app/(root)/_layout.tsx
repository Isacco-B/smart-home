import Toast, { BaseToast } from "react-native-toast-message";
import { useAuth } from "@/context/AuthContext";
import { MqttProvider } from "@/context/MqttContext";
import { Redirect, Slot } from "expo-router";


const toastConfig = {
  success: (props: any) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: "#00a3a4" }}
      contentContainerStyle={{ paddingHorizontal: 15 }}
      text1Style={{
        fontSize: 15,
        fontWeight: "400",
      }}
    />
  ),
};

export default function AppLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Redirect href="/sign-in" />;

  return (
    <MqttProvider>
      <Slot />
      <Toast config={toastConfig}/>
    </MqttProvider>
  );
}
