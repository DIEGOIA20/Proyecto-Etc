import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { AuthContext } from '../../utils/AuthContext';
import { getTheme } from '../../utils/theme';

export default function CrearCitaScreen({ navigation }) {
  const { darkMode } = useContext(AuthContext);
  const theme = getTheme(darkMode);
  const [paciente, setPaciente] = useState('');
  const [doctor, setDoctor] = useState('');
  const [fecha, setFecha] = useState('');
  const [hora, setHora] = useState('');
  const [motivo, setMotivo] = useState('');

  const handleCrear = () => {
    // Aquí iría la lógica para guardar la cita en BD local y configurar notificación
    navigation.goBack();
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
          onChangeText={setPaciente}
        />

        <Text style={[styles.label, { color: theme.text }]}>Doctor/Especialista</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          placeholder="Ej: Dr. Juan García"
          placeholderTextColor={theme.sub}
          value={doctor}
          onChangeText={setDoctor}
        />

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

        <TouchableOpacity style={styles.submitButton} onPress={handleCrear}>
          <Text style={styles.submitButtonText}>Agendar Cita</Text>
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
