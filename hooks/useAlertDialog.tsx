import { Alert } from "react-native";

type AlertOptions = {
  title: string;
  message: string;
  cancelText?: string;
  confirmText?: string;
  cancelStyle?: "default" | "cancel" | "destructive";
  onCancel?: () => void;
};

export function useAlertDialog() {
  const showAlert = (
    {
      title,
      message,
      cancelText = "Annulla",
      confirmText = "Conferma",
      cancelStyle = "cancel",
      onCancel,
    }: AlertOptions,
    onConfirm: () => void
  ) => {
    Alert.alert(title, message, [
      {
        text: cancelText,
        style: cancelStyle,
        onPress: onCancel,
      },
      {
        text: confirmText,
        onPress: onConfirm,
      },
    ]);
  };

  const showConfirmation = (
    title: string,
    message: string,
    onConfirm: () => void
  ) => {
    showAlert({ title, message }, onConfirm);
  };

  const showDestructiveAlert = (
    title: string,
    message: string,
    onConfirm: () => void
  ) => {
    showAlert(
      {
        title,
        message,
        confirmText: "Elimina",
        cancelStyle: "destructive",
      },
      onConfirm
    );
  };

  return {
    showAlert,
    showConfirmation,
    showDestructiveAlert,
  };
}
