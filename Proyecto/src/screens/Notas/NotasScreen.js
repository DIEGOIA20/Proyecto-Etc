import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { AuthContext } from '../../utils/AuthContext';
import { getTheme } from '../../utils/theme';

export default function NotasScreen({ navigation }) {
  const { darkMode } = useContext(AuthContext);
  const theme = getTheme(darkMode);
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
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.form, { backgroundColor: theme.card }]}>
        <Text style={[styles.sectionTitle, { color: theme.title }]}>Información del Paciente</Text>

        <Text style={[styles.label, { color: theme.text }]}>Paciente</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          placeholder="Seleccionar paciente"
          placeholderTextColor={theme.sub}
          value={paciente}
          onChangeText={setPaciente}
        />

        <Text style={[styles.sectionTitle, { color: theme.title }]}>Signos Vitales</Text>

        <Text style={[styles.label, { color: theme.text }]}>Peso (kg)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          placeholder="Ej: 75.5"
          placeholderTextColor={theme.sub}
          value={peso}
          onChangeText={setPeso}
          keyboardType="decimal-pad"
        />

        <Text style={[styles.label, { color: theme.text }]}>Presión Arterial (mmHg)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          placeholder="Ej: 120/80"
          placeholderTextColor={theme.sub}
          value={presionArterial}
          onChangeText={setPresionArterial}
        />

        <Text style={[styles.label, { color: theme.text }]}>Temperatura (°C)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          placeholder="Ej: 37.5"
          placeholderTextColor={theme.sub}
          value={temperatura}
          onChangeText={setTemperatura}
          keyboardType="decimal-pad"
        />

        <Text style={[styles.sectionTitle, { color: theme.title }]}>Nota Médica</Text>

        <TextInput
          style={[styles.input, styles.textarea, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          placeholder="Escribir observaciones médicas..."
          placeholderTextColor={theme.sub}
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
  },
  form: {
    padding: 16,
    margin: 16,
    borderRadius: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginTop: 20,
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderRadius: 6,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
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
