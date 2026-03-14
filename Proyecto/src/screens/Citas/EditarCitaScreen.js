import React, { useState, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';
import { AuthContext } from '../../utils/AuthContext';
import { getTheme } from '../../utils/theme';

export default function EditarCitaScreen({ route, navigation }) {
  const { darkMode } = useContext(AuthContext);
  const theme = getTheme(darkMode);
  const { cita } = route.params;
  const [paciente, setPaciente] = useState(cita?.paciente || '');
  const [doctor, setDoctor] = useState(cita?.doctor || '');
  const [fecha, setFecha] = useState(cita?.fecha || '');
  const [hora, setHora] = useState(cita?.hora || '');
  const [motivo, setMotivo] = useState(cita?.motivo || '');

  const handleActualizar = () => {
    // Aquí iría la lógica para actualizar en BD local
    navigation.goBack();
  };

  const handleCancelar = () => {
    // Aquí iría la lógica para cancelar la cita
    navigation.goBack();
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

        <Text style={[styles.label, { color: theme.text }]}>Doctor/Especialista</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          value={doctor}
          onChangeText={setDoctor}
        />

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
