import * as TaskManager from "expo-task-manager";
// import * as Notifications from "expo-notifications";
import * as Location from "expo-location";

const LOCATION_TASK_NAME = "background-location-task";

export const requestPermissions = async () => {
  const { status: foregroundStatus } =
    await Location.requestForegroundPermissionsAsync();

  if (foregroundStatus === "granted") {
    const { status: backgroundStatus } =
      await Location.requestBackgroundPermissionsAsync();

    if (backgroundStatus === "granted") {
      await Location.startLocationUpdatesAsync(LOCATION_TASK_NAME, {
        accuracy: Location.Accuracy.Balanced,
      });
    }
  }
};

// TaskManager.defineTask(LOCATION_TASK_NAME, ({ data, error }) => {
//   if (error) {
//     console.log("error defining task ", error);
//     return;
//   }
//   if (data) {
//     console.log("The data retrieved is ", data);
//   }
// });
