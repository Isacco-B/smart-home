export const gateNotificationTopics = [
  "api/notification/small_gate",
  "api/notification/garage/light",
  "api/notification/gate/partial",
  "api/notification/gate",
  "api/notification/gate/status",
];

export const gatePublishTopics = {
  light: "api/garage/light",
  smallGate: "api/small_gate",
  partial: "api/gate/partial",
  gate: "api/gate",
  gateStatus: "api/gate/get_status",
};

export const waterTankNotificationTopics = [
  "api/notification/siren",
  "api/notification/pump",
  "api/notification/water_tank/status",
];

export const waterTankPublishTopics = {
  siren: "api/water_tank/siren",
  pump: "api/water_tank/pump",
  waterTankStatus: "api/water_tank/status",
};

export const irrigationNotificationTopics = ["api/notification/irrigation"];

export const irrigationPublishTopics = {
  zone: "api/irrigation/zone",
  program: "api/irrigation/program",
  irrigationStatus: "api/notification/irrigation/status",
};
