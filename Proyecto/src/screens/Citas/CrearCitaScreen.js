import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

export default function CrearCitaScreen({ navigation }) {
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
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Paciente</Text>
        <TextInput
          style={styles.input}
          placeholder="Seleccionar o escribir nombre"
          value={paciente}
          onChangeText={setPaciente}
        />

        <Text style={styles.label}>Doctor/Especialista</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: Dr. Juan García"
          value={doctor}
          onChangeText={setDoctor}
        />

        <Text style={styles.label}>Fecha</Text>
        <TextInput
          style={styles.input}
          placeholder="DD/MM/YYYY"
          value={fecha}
          onChangeText={setFecha}
        />

        <Text style={styles.label}>Hora</Text>
        <TextInput
          style={styles.input}
          placeholder="HH:MM"
          value={hora}
          onChangeText={setHora}
        />

        <Text style={styles.label}>Motivo de la Consulta</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Describa el motivo de la cita"
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
    backgroundColor: '#F9FAFB',
  },
  form: {
    padding: 16,
    backgroundColor: '#fff',
    margin: 16,
    borderRadius: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginTop: 16,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#111827',
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
