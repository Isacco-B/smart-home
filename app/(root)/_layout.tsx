import { useAuth } from "@/context/AuthContext";
import { MqttProvider } from "@/context/MqttContext";
import { Redirect, Slot } from "expo-router";

export default function AppLayout() {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) return <Redirect href="/sign-in" />;

  return (
    <MqttProvider>
      <Slot />
    </MqttProvider>
  );
}
