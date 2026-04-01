import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../../utils/AuthContext';
import { getTheme } from '../../utils/theme';
import { createAppointment, getPatients, updateAppointment, getDoctors } from '../../utils/database';
import { scheduleAppointmentReminder } from '../../utils/notifications';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function CrearCitaScreen({ navigation, route }) {
  const { darkMode, settings } = useContext(AuthContext);
  const theme = getTheme(darkMode);
  const routePatientId = route.params?.patientId || null;
  const routePatientName = route.params?.pacienteNombre || '';

  const [paciente, setPaciente] = useState(routePatientName);
  const [patientId, setPatientId] = useState(routePatientId);
  const [patientOptions, setPatientOptions] = useState([]);
  const [doctorOptions, setDoctorOptions] = useState([]);
  const [doctor, setDoctor] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [motivo, setMotivo] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadPatients = async () => {
        const [rows, doctorsRows] = await Promise.all([
          getPatients(''),
          getDoctors({ onlyActive: true }),
        ]);
        setPatientOptions(rows);
        setDoctorOptions(doctorsRows);
      };
      loadPatients();
    }, [])
  );

  const handleSelectPatient = (item) => {
    setPatientId(item.id);
    setPaciente(item.nombre);
  };

  const handleCrear = async () => {
    if (!patientId) {
      Alert.alert('Dato requerido', 'Selecciona un paciente para la cita.');
      return;
    }
    if (!doctor.trim() || !fecha.trim() || !hora.trim() || !motivo.trim()) {
      Alert.alert('Datos incompletos', 'Doctor, fecha, hora y motivo son obligatorios.');
      return;
    }

    try {
      setSubmitting(true);
      const created = await createAppointment({
        patientId,
        doctor: doctor.trim(),
        fecha: fecha.trim(),
        hora: hora.trim(),
        motivo: motivo.trim(),
        estado: 'Programada',
      });

      const notificationId = await scheduleAppointmentReminder(
        {
          ...created,
          paciente,
        },
        settings.reminderWindow
      );

      if (notificationId) {
        await updateAppointment(created.id, {
          patientId,
          doctor: doctor.trim(),
          fecha: fecha.trim(),
          hora: hora.trim(),
          motivo: motivo.trim(),
          estado: 'Programada',
          notificationId,
        });
      }

      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo agendar la cita. Revisa el formato de fecha (YYYY-MM-DD).');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.form, { backgroundColor: theme.card }]}>
        <Text style={[styles.label, { color: theme.text }]}>Paciente</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          placeholder="Seleccionar o escribir nombre"
          placeholderTextColor={theme.sub}
          value={paciente}
          onChangeText={(value) => {
            setPaciente(value);
            setPatientId(null);
          }}
        />

        {patientId === null && paciente.length > 0 && (
          <View style={{ borderWidth: 1, borderColor: theme.border, borderRadius: 6, marginBottom: 8 }}>
            {patientOptions
              .filter((item) => item.nombre.toLowerCase().includes(paciente.toLowerCase()))
              .slice(0, 4)
              .map((item) => (
                <TouchableOpacity
                  key={item.id}
                  onPress={() => handleSelectPatient(item)}
                  style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: theme.border }}
                >
                  <Text style={{ color: theme.text }}>{item.nombre}</Text>
                </TouchableOpacity>
              ))}
          </View>
        )}

        <Text style={[styles.label, { color: theme.text }]}>Doctor/Especialidad</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          placeholder="Buscar por doctor o especialidad"
          placeholderTextColor={theme.sub}
          value={doctor}
          onChangeText={setDoctor}
        />

        <View style={{ borderWidth: 1, borderColor: theme.border, borderRadius: 6, marginBottom: 8 }}>
          {doctorOptions
            .filter((item) => {
              const q = doctor.trim().toLowerCase();
              if (!q) {
                return true;
              }
              return (
                item.nombre.toLowerCase().includes(q) ||
                item.especialidad.toLowerCase().includes(q)
              );
            })
            .slice(0, 6)
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
          placeholder="DD/MM/YYYY"
          placeholderTextColor={theme.sub}
          value={fecha}
          onChangeText={setFecha}
        />

        <Text style={[styles.label, { color: theme.text }]}>Hora</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          placeholder="HH:MM"
          placeholderTextColor={theme.sub}
          value={hora}
          onChangeText={setHora}
        />

        <Text style={[styles.label, { color: theme.text }]}>Motivo de la Consulta</Text>
        <TextInput
          style={[styles.input, styles.textarea, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          placeholder="Describa el motivo de la cita"
          placeholderTextColor={theme.sub}
          value={motivo}
          onChangeText={setMotivo}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleCrear} disabled={submitting}>
          <Text style={styles.submitButtonText}>{submitting ? 'Guardando...' : 'Agendar Cita'}</Text>
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
});
