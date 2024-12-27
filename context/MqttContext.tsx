import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from "react";
import useAppStateBackground from "../hooks/useAppStateReconnect";
import useMqttConnection, {
  MqttData,
  MqttError,
  MqttStatus,
} from "../hooks/useMqttConnection";
import { emitStateError } from "../services/errorHandler";
import { MqttClient } from "mqtt/*";

type SubscribeToTopic = (
  topics: string[],
  options?: { qos?: 0 | 1 | 2 }
) => void;

const MqttContext = createContext<{
  mqttClient: MqttClient | null;
  mqttData: MqttData;
  mqttStatus: MqttStatus;
  mqttError: MqttError;
  subscribeToTopic: SubscribeToTopic;
  setDoMqttConnection: Dispatch<SetStateAction<boolean>>;
} | null>(null);

export const MqttProvider = ({ children }: { children: ReactNode }) => {
  const [doMqttConnection, setDoMqttConnection] = useState<boolean>(true);
  const {
    mqttClient,
    mqttData,
    mqttStatus,
    mqttError,
    setMqttError,
    setMqttStatus,
  } = useMqttConnection(doMqttConnection);


  useAppStateBackground(mqttClient);

  const subscribeToTopic: SubscribeToTopic = (topics, { qos = 1 } = {}) => {
    if (!mqttClient) {
      console.warn("MQTT client is not connected");
      return;
    }

    topics.forEach((topic) => {
      mqttClient.subscribe(topic, { qos }, (error) => {
        if (error) {
          setMqttStatus("Error");
          emitStateError(setMqttError, "MqttTopic", error);
        }
      });
    });
  };

  return (
    <MqttContext.Provider
      value={{
        mqttClient,
        mqttData,
        mqttStatus,
        mqttError,
        subscribeToTopic,
        setDoMqttConnection,
      }}
    >
      {children}
    </MqttContext.Provider>
  );
};

export const useMqtt = () => {
  const context = useContext(MqttContext);
  if (!context) {
    throw new Error("useMqtt must be used within an MqttProvider");
  }
  return context;
};
