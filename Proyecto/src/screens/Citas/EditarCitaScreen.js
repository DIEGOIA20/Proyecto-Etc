import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

export default function EditarCitaScreen({ route, navigation }) {
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
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Paciente</Text>
        <TextInput
          style={styles.input}
          value={paciente}
          onChangeText={setPaciente}
        />

        <Text style={styles.label}>Doctor/Especialista</Text>
        <TextInput
          style={styles.input}
          value={doctor}
          onChangeText={setDoctor}
        />

        <Text style={styles.label}>Fecha</Text>
        <TextInput
          style={styles.input}
          value={fecha}
          onChangeText={setFecha}
        />

        <Text style={styles.label}>Hora</Text>
        <TextInput
          style={styles.input}
          value={hora}
          onChangeText={setHora}
        />

        <Text style={styles.label}>Motivo de la Consulta</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
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
