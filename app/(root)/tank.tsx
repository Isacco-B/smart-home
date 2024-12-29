import Header from "@/components/Header";
import Toast from "react-native-toast-message";
import { ActionButton } from "@/components/ActionButton";
import { StatusItem } from "@/components/StatusItem";
import {
  waterTankNotificationTopics,
  waterTankPublishTopics,
} from "@/constants/data";
import { useMqtt } from "@/context/MqttContext";
import {
  Bell,
  Loader,
  Power,
  PowerOff,
  Volume2,
  VolumeOff,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, Switch } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAlertDialog } from "@/hooks/useAlertDialog";
import { DeviceStatus } from "./gate";

const UPDATE_INTERVAL = 2000;

type TankStatus = {
  siren_relay_status: DeviceStatus;
  siren_aux_relay: DeviceStatus;
  pump_relay_status: DeviceStatus;
  pump_aux_relay: DeviceStatus;
  current: string | "sconosciuto";
};

export default function TankPage() {
  const { showConfirmation } = useAlertDialog();
  const {
    subscribeToTopic,
    unsubscribeToTopic,
    publishToTopic,
    mqttData,
    mqttStatus,
  } = useMqtt();
  const [tankStatus, setTankStatus] = useState<TankStatus | null>(null);
  const [isNotificationEnabled, setIsNotificationEnabled] =
    useState<boolean>(true);

  useEffect(() => {
    subscribeToTopic(waterTankNotificationTopics);
    publishToTopic(waterTankPublishTopics.waterTankStatus, "on");
    const statusInterval = setInterval(() => {
      publishToTopic(waterTankPublishTopics.waterTankStatus, "on");
    }, UPDATE_INTERVAL);

    return () => {
      unsubscribeToTopic(waterTankNotificationTopics);
      clearInterval(statusInterval);
    };
  }, []);

  useEffect(() => {
    if (mqttData?.message) {
      if (mqttData.topic === "api/notification/water_tank/status") {
        setTankStatus(mqttData.message);
      }
      if (
        waterTankNotificationTopics.includes(mqttData.topic) &&
        mqttData.topic !== "api/notification/water_tank/status"
      ) {
        const message = mqttData.message?.data.split(":");
        Toast.show({
          type: "success",
          text1: message[0] || "Comando eseguito",
          text2: message[1] || "",
        });
      }
    }
  }, [mqttData]);

  const isLoading = mqttStatus !== "Connected" || !tankStatus;

  const handleNotification = () => {
    if (isNotificationEnabled) {
      showConfirmation(
        "Disattivare le notifiche?",
        "Se disattivi le notifiche, non verrai allertato in caso di allarme. Sei sicuro di voler procedere?",
        () => setIsNotificationEnabled(false)
      );
      return;
    }
    setIsNotificationEnabled(true);
  };

  const handlePumpToggle = () => {
    if (!tankStatus) return;
    if (tankStatus.pump_relay_status === "disattivo") {
      showConfirmation(
        "Attenzione!",
        "Assicurati di non lasciare la pompa accessa in mancaza d'acqua. Sei sicuro di voler procedere?",
        () => publishToTopic(waterTankPublishTopics.pump, "on")
      );
      return;
    }
    publishToTopic(waterTankPublishTopics.pump, "off");
  };

  function handleSirenToggle() {
    if (!tankStatus) return;
    if (tankStatus.siren_aux_relay === "disattivo") {
      showConfirmation(
        "Attenzione!",
        "Se disattivi la sirena non verrai allertato in caso di allarme. Sei sicuro di voler procedere?",
        () => publishToTopic(waterTankPublishTopics.siren, "off")
      );
      return;
    }
    publishToTopic(waterTankPublishTopics.siren, "on");
  }

  return (
    <SafeAreaView className="bg-gray-100 h-full">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="min-h-full"
      >
        <View className="flex-1 p-8">
          <Header title="Cisterna" />
          <View className="flex flex-row items-center justify-between bg-white rounded-xl py-2 px-4 mt-16">
            <View className="flex flex-row items-center gap-2">
              <Bell size={18} color="#191D31" />
              <Text className="font-rubik text-base text-black-300">
                Notifiche allarme cisterna
              </Text>
            </View>
            <Switch
              trackColor={{ false: "#191D31", true: "#00a3a4" }}
              thumbColor={isNotificationEnabled ? "#FBFBFD" : "#f4f3f4"}
              onValueChange={handleNotification}
              value={isNotificationEnabled}
            />
          </View>
          <View className="bg-white rounded-xl p-4 mt-12">
            <Text className="font-rubik-medium text-black-300 text-4xl text-center mt-5 uppercase">
              {isLoading
                ? "Caricamento"
                : tankStatus?.siren_relay_status === "attivo"
                ? "In allarme"
                : "In funzione"}
            </Text>
            <View className="flex flex-col gap-2 mt-5">
              <StatusItem
                title="Sirena"
                status={isLoading ? "sconosciuto" : tankStatus.siren_aux_relay}
              />
              <StatusItem
                title="Pompa"
                status={
                  isLoading ? "sconosciuto" : tankStatus.pump_relay_status
                }
              />
              <StatusItem title="Consumo">
                <Text>{isLoading ? "-" : tankStatus.current} A</Text>
              </StatusItem>
            </View>
          </View>
          <View className="flex flex-row items-center gap-4 mt-12">
            <ActionButton
              disabled={isLoading}
              icon={
                isLoading
                  ? Loader
                  : tankStatus.pump_aux_relay === "attivo"
                  ? PowerOff
                  : Power
              }
              label={
                isLoading
                  ? "Caricamento"
                  : tankStatus.pump_aux_relay === "attivo"
                  ? "Spegni Pompa"
                  : "Accendi Pompa"
              }
              onPress={() => handlePumpToggle()}
            />
            <ActionButton
              disabled={isLoading}
              icon={
                isLoading
                  ? Loader
                  : tankStatus.siren_aux_relay === "attivo"
                  ? VolumeOff
                  : Volume2
              }
              label={
                isLoading
                  ? "Caricamento"
                  : tankStatus.siren_aux_relay === "attivo"
                  ? "Abilita Sirena"
                  : "Disabilita Sirena"
              }
              onPress={() => handleSirenToggle()}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
