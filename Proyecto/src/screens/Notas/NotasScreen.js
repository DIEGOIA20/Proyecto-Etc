import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../../utils/AuthContext';
import { getTheme } from '../../utils/theme';
import { createNote, getPatients } from '../../utils/database';
import { useFocusEffect } from '@react-navigation/native';
import { useCallback } from 'react';

export default function NotasScreen({ navigation, route }) {
  const { darkMode } = useContext(AuthContext);
  const theme = getTheme(darkMode);
  const routePatientId = route.params?.patientId || null;
  const routePatientName = route.params?.pacienteNombre || '';

  const [paciente, setPaciente] = useState(routePatientName);
  const [patientId, setPatientId] = useState(routePatientId);
  const [patientOptions, setPatientOptions] = useState([]);
  const [peso, setPeso] = useState('');
  const [presionArterial, setPresionArterial] = useState('');
  const [temperatura, setTemperatura] = useState('');
  const [notaMedica, setNotaMedica] = useState('');
  const [fotoUri, setFotoUri] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useFocusEffect(
    useCallback(() => {
      const loadPatients = async () => {
        const rows = await getPatients('');
        setPatientOptions(rows);
      };
      loadPatients();
    }, [])
  );

  const handleSelectPatient = (item) => {
    setPatientId(item.id);
    setPaciente(item.nombre);
  };

  const handleGuardar = async () => {
    if (!patientId) {
      Alert.alert('Dato requerido', 'Selecciona un paciente para registrar la nota.');
      return;
    }

    try {
      setSubmitting(true);
      await createNote({
        patientId,
        peso,
        presionArterial,
        temperatura,
        notaMedica,
        fotoUri,
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo guardar la nota médica.');
    } finally {
      setSubmitting(false);
    }
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
          onChangeText={(value) => {
            setPaciente(value);
            setPatientId(null);
          }}
        />

        {patientId === null && paciente.length > 0 && (
          <View style={{ borderWidth: 1, borderColor: theme.border, borderRadius: 6, marginBottom: 12 }}>
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

        <Text style={[styles.label, { color: theme.text }]}>Foto/archivo (URI opcional)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          placeholder="Ej: file://... o https://..."
          placeholderTextColor={theme.sub}
          value={fotoUri}
          onChangeText={setFotoUri}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleGuardar} disabled={submitting}>
          <Text style={styles.submitButtonText}>{submitting ? 'Guardando...' : 'Guardar Nota'}</Text>
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
