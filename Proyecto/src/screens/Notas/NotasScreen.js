import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

export default function NotasScreen({ navigation }) {
  const [paciente, setPaciente] = useState('');
  const [peso, setPeso] = useState('');
  const [presionArterial, setPresionArterial] = useState('');
  const [temperatura, setTemperatura] = useState('');
  const [notaMedica, setNotaMedica] = useState('');

  const handleGuardar = () => {
    // Aquí iría la lógica para guardar notas y signos vitales en BD local
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.sectionTitle}>Información del Paciente</Text>

        <Text style={styles.label}>Paciente</Text>
        <TextInput
          style={styles.input}
          placeholder="Seleccionar paciente"
          value={paciente}
          onChangeText={setPaciente}
        />

        <Text style={styles.sectionTitle}>Signos Vitales</Text>

        <Text style={styles.label}>Peso (kg)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 75.5"
          value={peso}
          onChangeText={setPeso}
          keyboardType="decimal-pad"
        />

        <Text style={styles.label}>Presión Arterial (mmHg)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 120/80"
          value={presionArterial}
          onChangeText={setPresionArterial}
        />

        <Text style={styles.label}>Temperatura (°C)</Text>
        <TextInput
          style={styles.input}
          placeholder="Ej: 37.5"
          value={temperatura}
          onChangeText={setTemperatura}
          keyboardType="decimal-pad"
        />

        <Text style={styles.sectionTitle}>Nota Médica</Text>

        <TextInput
          style={[styles.input, styles.textarea]}
          placeholder="Escribir observaciones médicas..."
          value={notaMedica}
          onChangeText={setNotaMedica}
          multiline
          numberOfLines={6}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleGuardar}>
          <Text style={styles.submitButtonText}>Guardar Nota</Text>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginTop: 20,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
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
    marginBottom: 12,
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
