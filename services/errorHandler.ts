import { MqttError } from "@/hooks/useMqttConnection";

type ErrorType = "MqttTopic" | "MqttGeneral";

const processError = (error: Error) => {
  return `Name: ${error?.name} || Message: ${error?.message}}`;
};

const logError = (type: ErrorType, error: Error) => {
  const errorMsg = processError(error);
  console.log(`${"[Error:" + type + "]"} || ${errorMsg}`);
};

const emitStateError = (
  callback: (value: MqttError) => void,
  type: ErrorType,
  error: Error
) => {
  const errorMsg = processError(error).replace(/ \|\|{0,2} /g, "\n");

  callback({
    type: "[Error:" + type + "]",
    msg: errorMsg,
  });
};

export { logError, emitStateError };
