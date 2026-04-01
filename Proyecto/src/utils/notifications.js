import { Alert, Platform } from 'react-native';

const reminderToMinutes = {
  '15m': 15,
  '1h': 60,
  '24h': 1440,
  '48h': 2880,
};

const shownInAppReminderKeys = new Set();

function getNotificationsModule() {
  try {
    if (Platform.OS === 'web') {
      return null;
    }

    const Constants = require('expo-constants').default;
    const isExpoGo = Constants?.executionEnvironment === 'storeClient';
    if (isExpoGo) {
      // En Expo Go no usamos expo-notifications para evitar errores de runtime.
      return null;
    }

    return require('expo-notifications');
  } catch (_error) {
    return null;
  }
}

function toDate(fecha, hora) {
  try {
    const normalizedFecha = (fecha || '').trim();
    let year;
    let month;
    let day;

    if (normalizedFecha.includes('-')) {
      [year, month, day] = normalizedFecha.split('-').map(Number);
    } else if (normalizedFecha.includes('/')) {
      const [dd, mm, yyyy] = normalizedFecha.split('/').map(Number);
      year = yyyy;
      month = mm;
      day = dd;
    }

    const [hours, minutes] = (hora || '').split(':').map(Number);

    if (!year || !month || !day) {
      return null;
    }

    return new Date(year, month - 1, day, hours || 0, minutes || 0, 0, 0);
  } catch (_error) {
    return null;
  }
}

export async function requestNotificationPermissions() {
  const Notifications = getNotificationsModule();
  if (!Notifications) {
    return false;
  }

  const settings = await Notifications.getPermissionsAsync();
  if (settings.granted) {
    return true;
  }

  const asked = await Notifications.requestPermissionsAsync();
  return asked.granted;
}

export async function scheduleAppointmentReminder(cita, reminderWindow = '24h') {
  const Notifications = getNotificationsModule();
  if (!Notifications) {
    return null;
  }

  const hasPermission = await requestNotificationPermissions();
  if (!hasPermission) {
    return null;
  }

  const minutesBefore = reminderToMinutes[reminderWindow] || reminderToMinutes['24h'];
  const appointmentDate = toDate(cita.fecha, cita.hora);
  if (!appointmentDate) {
    return null;
  }

  const triggerDate = new Date(appointmentDate.getTime() - minutesBefore * 60 * 1000);
  if (triggerDate <= new Date()) {
    return null;
  }

  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Recordatorio de cita',
      body: `${cita.paciente} - ${cita.fecha} ${cita.hora} con ${cita.doctor}`,
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: triggerDate,
    },
  });
}

export async function cancelNotification(notificationId) {
  const Notifications = getNotificationsModule();
  if (!Notifications || !notificationId) {
    return;
  }

  await Notifications.cancelScheduledNotificationAsync(notificationId);
}

export function notifyUpcomingAppointmentsInApp(appointments, reminderWindow = '24h') {
  if (!Array.isArray(appointments) || appointments.length === 0) {
    return;
  }

  const minutesBefore = reminderToMinutes[reminderWindow] || reminderToMinutes['24h'];
  const now = new Date();

  const due = appointments.filter((item) => {
    if (!item || item.estado === 'Cancelada') {
      return false;
    }

    const appointmentDate = toDate(item.fecha, item.hora);
    if (!appointmentDate) {
      return false;
    }

    const diffMinutes = (appointmentDate.getTime() - now.getTime()) / 60000;
    if (diffMinutes < 0 || diffMinutes > minutesBefore) {
      return false;
    }

    const reminderKey = `${item.id}-${item.fecha}-${item.hora}-${reminderWindow}`;
    if (shownInAppReminderKeys.has(reminderKey)) {
      return false;
    }

    shownInAppReminderKeys.add(reminderKey);
    return true;
  });

  if (due.length === 0) {
    return;
  }

  const preview = due.slice(0, 3).map((item) => `• ${item.paciente} (${item.fecha} ${item.hora})`).join('\n');
  const extra = due.length > 3 ? `\n...y ${due.length - 3} más` : '';

  Alert.alert('Citas próximas', `${preview}${extra}`);
}

