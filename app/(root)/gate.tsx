import Header from "@/components/Header";
import Toast from "react-native-toast-message";
import { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ChevronDown,
  ChevronUp,
  DoorOpen,
  Footprints,
  Lightbulb,
} from "lucide-react-native";
import { useMqtt } from "@/context/MqttContext";
import { gateNotificationTopics, gatePublishTopics } from "@/constants/data";
import { ActionButton } from "@/components/ActionButton";
import { StatusItem } from "@/components/StatusItem";

const UPDATE_INTERVAL = 2000;

export type DeviceStatus = "attivo" | "disattivo" | "sconosciuto";

type GateState =
  | "chiuso"
  | "aperto"
  | "stop"
  | "in apertura"
  | "in chiusura"
  | "sconosciuto";

type GateStatus = {
  stato: GateState;
  fcApertura: DeviceStatus;
  fcChiusura: DeviceStatus;
  fotocellule: DeviceStatus;
  coste: DeviceStatus;
  ricevente: DeviceStatus;
  posizione: string | "sconosciuto";
  consumo: string | "sconosciuto";
};

export default function GatePage() {
  const [showInfo, setShowInfo] = useState<boolean>(false);
  const [gateStatus, setGateStatus] = useState<GateStatus | null>(null);
  const {
    mqttStatus,
    mqttData,
    subscribeToTopic,
    unsubscribeToTopic,
    publishToTopic,
  } = useMqtt();

  useEffect(() => {
    subscribeToTopic(gateNotificationTopics);
    publishToTopic(gatePublishTopics.gateStatus, "on");
    const statusInterval = setInterval(() => {
      publishToTopic(gatePublishTopics.gateStatus, "on");
    }, UPDATE_INTERVAL);

    return () => {
      unsubscribeToTopic(gateNotificationTopics);
      clearInterval(statusInterval);
    };
  }, []);

  useEffect(() => {
    if (mqttData?.message) {
      if (mqttData.topic === "api/notification/gate/status") {
        setGateStatus(mqttData.message);
      }
      if (
        gateNotificationTopics.includes(mqttData.topic) &&
        mqttData.topic !== "api/notification/gate/status"
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

  const isLoading = mqttStatus !== "Connected" || !gateStatus;

  function gateButtonLabel() {
    if (isLoading) return "Caricamento";
    switch (gateStatus.stato) {
      case "in apertura":
        return "Stop";
      case "stop":
      case "aperto":
        return "Chiudi";
      case "in chiusura":
      case "chiuso":
        return "Apri";
      default:
        return "Caricamento";
    }
  }

  return (
    <SafeAreaView className="bg-gray-100 h-full">
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="min-h-full"
      >
        <View className="flex-1 p-8">
          <Header title="Cancello" />
          <View className="bg-white rounded-xl p-4 mt-16">
            <Text className="font-rubik-medium text-black-300 text-4xl text-center mt-5 uppercase">
              {isLoading ? "Caricamento" : gateStatus.stato}
            </Text>
            <Text className="text-black-200 text-sm font-rubik mt-12">
              Posiszione:{" "}
              <Text>{isLoading ? "0" : gateStatus.posizione} %</Text>
            </Text>
            <View className="w-full h-6 bg-primary-100 rounded-lg p-1">
              <View
                className="h-full bg-primary-300 rounded-lg"
                style={{ width: `${isLoading ? 0 : +gateStatus.posizione}%` }}
              ></View>
            </View>
            <TouchableOpacity
              onPress={() => setShowInfo(!showInfo)}
              className="mt-5"
            >
              <View className="flex flex-row items-center gap-1">
                <Text className="text-primary-300 text-sm font-rubik-medium">
                  Info avanzate
                </Text>
                {showInfo ? (
                  <ChevronDown size={18} color="#00a3a4" />
                ) : (
                  <ChevronUp size={18} color="#00a3a4" />
                )}
              </View>
            </TouchableOpacity>
            {showInfo && (
              <View className="mt-4 gap-1.5">
                <StatusItem
                  title="Fc Apertura"
                  status={isLoading ? "sconosciuto" : gateStatus.fcApertura}
                />
                <StatusItem
                  title="Fc Chiusura"
                  status={isLoading ? "sconosciuto" : gateStatus.fcChiusura}
                />
                <StatusItem
                  title="Fotocellule"
                  status={isLoading ? "sconosciuto" : gateStatus.fotocellule}
                />
                <StatusItem
                  title="Coste"
                  status={isLoading ? "sconosciuto" : gateStatus.coste}
                />
                <StatusItem
                  title="Ricevente"
                  status={isLoading ? "sconosciuto" : gateStatus.ricevente}
                />
                <StatusItem title="Consumo">
                  <Text>{isLoading ? "-" : gateStatus.consumo} A</Text>
                </StatusItem>
              </View>
            )}
          </View>
          <View className="flex flex-row items-center gap-4 mt-12">
            <ActionButton
              icon={Lightbulb}
              label={"Luce Box"}
              disabled={isLoading}
              onPress={() => publishToTopic(gatePublishTopics.light, "on")}
            />
            <ActionButton
              icon={Footprints}
              label={"Pedonabile"}
              disabled={isLoading || gateStatus.stato !== "chiuso"}
              onPress={() => publishToTopic(gatePublishTopics.partial, "on")}
            />
          </View>
          <View className="flex flex-row items-center gap-4 mt-5">
            <ActionButton
              icon={Lightbulb}
              label={gateButtonLabel()}
              disabled={isLoading}
              onPress={() => publishToTopic(gatePublishTopics.gate, "on")}
            />
            <ActionButton
              icon={DoorOpen}
              label={"Cancellino"}
              disabled={isLoading}
              onPress={() => publishToTopic(gatePublishTopics.smallGate, "on")}
            />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
