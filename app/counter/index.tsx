import { Text, View, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import * as Device from "expo-device";
import * as Notifications from 'expo-notifications'
import { registerForPushNotificationsAsync } from '../utils/registerForPushnotificationsAsync';
import { theme } from '../../theme';
import { Duration, isBefore, intervalToDuration } from 'date-fns';
import { useEffect, useState } from 'react';

const timestamp = Date.now() + 10 * 1000
type CountdownStatus = {
  isOverdue: boolean;
  distance: Duration
}
export default function CounterScreen() {
  const [status, setStatus] = useState<CountdownStatus>({
    isOverdue: false,
    distance: {}
  });

  console.log(status);
  useEffect(() => {
    const intervalId = setInterval(() => {
      const isOverdue = isBefore(timestamp, Date.now())
      const distance = intervalToDuration(
        isOverdue
          ? { start: timestamp, end: Date.now() }
          : { start: Date.now(), end: timestamp }
      );
      setStatus({ isOverdue, distance })
    }, 1000);
  })

  const scheduleNotificaton = async () => {
    const result = await registerForPushNotificationsAsync();
    if (result === "granted") {
      await Notifications.scheduleNotificationAsync({
        content: {
          title: "I'm a notification from your app 📢"
        },
        trigger: {
          seconds: 5,
          type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL
        }
      });
    }  else {
      if (Device.isDevice) {
        Alert.alert(
          "Unable to schedule notification",
          "Enable the notification permission in settings for Expo Go"
        );
      }
    }
  };
  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.button}
        activeOpacity={0.8}
        onPress={scheduleNotificaton}
      >
        <Text style={styles.buttonText}>Schedule notification</Text>
      </TouchableOpacity>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: theme.colorBlack,
    padding: 12,
    borderRadius: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    textTransform: "uppercase",
    letterSpacing: 1,
  }
})
