import { MqttClient } from "mqtt/*";
import { useEffect, useRef } from "react";
import { AppState, AppStateStatus } from "react-native";

function useAppStateBackground(mqttClient: MqttClient | null) {
  const appState = useRef<AppStateStatus>(AppState.currentState);

  useEffect(() => {
    if (!mqttClient) {
      console.warn("MQTT client is not initialized");
      return;
    }

    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === "active"
      ) {
        console.log("App is active, reconnecting MQTT...");
        mqttClient.reconnect();
      } else if (nextAppState.match(/inactive|background/)) {
        console.log("App is in background, ending MQTT connection...");
        mqttClient.end();
      }

      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange
    );

    return () => {
      subscription.remove();
    };
  }, [mqttClient]);

  return appState.current;
}

export default useAppStateBackground;
