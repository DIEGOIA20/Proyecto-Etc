import React, { useState, useContext, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../../utils/AuthContext';
import { getTheme } from '../../utils/theme';
import { updateAppointment, cancelAppointment, getDoctors } from '../../utils/database';
import { cancelNotification, scheduleAppointmentReminder } from '../../utils/notifications';

export default function EditarCitaScreen({ route, navigation }) {
  const { darkMode, settings } = useContext(AuthContext);
  const theme = getTheme(darkMode);
  const { cita } = route.params;
  const [paciente, setPaciente] = useState(cita?.paciente || '');
  const [doctorOptions, setDoctorOptions] = useState([]);
  const [doctor, setDoctor] = useState(cita?.doctor || '');
  const [fecha, setFecha] = useState(cita?.fecha || '');
  const [hora, setHora] = useState(cita?.hora || '');
  const [motivo, setMotivo] = useState(cita?.motivo || '');

  const query = doctor.trim().toLowerCase();
  const matchedDoctors = doctorOptions.filter((item) => {
    if (!query) {
      return true;
    }
    return (
      item.nombre.toLowerCase().includes(query) ||
      item.especialidad.toLowerCase().includes(query)
    );
  });

  // Si el valor actual no coincide con la nueva lista, mostramos todos para facilitar selección.
  const doctorsToShow = matchedDoctors.length > 0 ? matchedDoctors : doctorOptions;

  useEffect(() => {
    const loadDoctorsData = async () => {
      const doctorsRows = await getDoctors({ onlyActive: true });
      setDoctorOptions(doctorsRows);
    };

    loadDoctorsData();
  }, [cita?.doctor]);

  const handleActualizar = async () => {
    if (!doctor.trim() || !fecha.trim() || !hora.trim() || !motivo.trim()) {
      Alert.alert('Datos incompletos', 'Doctor, fecha, hora y motivo son obligatorios.');
      return;
    }

    try {
      if (cita.notificationId) {
        await cancelNotification(cita.notificationId);
      }

      const notificationId = await scheduleAppointmentReminder(
        {
          paciente,
          doctor,
          fecha,
          hora,
        },
        settings.reminderWindow
      );

      await updateAppointment(cita.id, {
        patientId: cita.patientId,
        doctor: doctor.trim(),
        fecha: fecha.trim(),
        hora: hora.trim(),
        motivo: motivo.trim(),
        estado: cita.estado || 'Programada',
        notificationId,
      });

      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar la cita.');
    }
  };

  const handleCancelar = async () => {
    try {
      await cancelAppointment(cita.id);
      if (cita.notificationId) {
        await cancelNotification(cita.notificationId);
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo cancelar la cita.');
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.form, { backgroundColor: theme.card }]}>
        <Text style={[styles.label, { color: theme.text }]}>Paciente</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          value={paciente}
          onChangeText={setPaciente}
        />

        <Text style={[styles.label, { color: theme.text }]}>Doctor/Especialidad</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          value={doctor}
          onChangeText={setDoctor}
          placeholder="Buscar por doctor o especialidad"
          placeholderTextColor={theme.sub}
        />

        <View style={{ borderWidth: 1, borderColor: theme.border, borderRadius: 6, marginBottom: 8, maxHeight: 220 }}>
          {doctorsToShow
            .slice(0, 8)
            .map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => setDoctor(item.nombre)}
                style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: theme.border }}
              >
                <Text style={{ color: theme.text }}>{item.nombre}</Text>
                <Text style={{ color: theme.sub, fontSize: 12 }}>{item.especialidad}</Text>
              </TouchableOpacity>
            ))}
        </View>

        <Text style={[styles.label, { color: theme.text }]}>Fecha</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          value={fecha}
          onChangeText={setFecha}
        />

        <Text style={[styles.label, { color: theme.text }]}>Hora</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          value={hora}
          onChangeText={setHora}
        />

        <Text style={[styles.label, { color: theme.text }]}>Motivo de la Consulta</Text>
        <TextInput
          style={[styles.input, styles.textarea, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          value={motivo}
          onChangeText={setMotivo}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleActualizar}>
          <Text style={styles.submitButtonText}>Actualizar Cita</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.cancelButton} onPress={handleCancelar}>
          <Text style={styles.cancelButtonText}>Cancelar Cita</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  form: {
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
  },
  textarea: {
    textAlignVertical: 'top',
    paddingTop: 10,
  },
  submitButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 24,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  cancelButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 12,
  },
  cancelButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
