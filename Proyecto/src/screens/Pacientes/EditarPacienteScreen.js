import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

export default function EditarPacienteScreen({ route, navigation }) {
  const { paciente } = route.params;
  const [nombre, setNombre] = useState(paciente?.nombre || '');
  const [edad, setEdad] = useState(paciente?.edad?.toString() || '');
  const [telefono, setTelefono] = useState(paciente?.telefono || '');
  const [email, setEmail] = useState('');
  const [alergias, setAlergias] = useState('');

  const handleActualizar = () => {
    // Aquí iría la lógica para actualizar en BD local
    navigation.goBack();
  };

  const handleEliminar = () => {
    // Aquí iría la lógica para eliminar de BD local
    navigation.goBack();
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Nombre Completo</Text>
        <TextInput
          style={styles.input}
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={styles.label}>Edad</Text>
        <TextInput
          style={styles.input}
          value={edad}
          onChangeText={setEdad}
          keyboardType="numeric"
        />

        <Text style={styles.label}>Teléfono</Text>
        <TextInput
          style={styles.input}
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
        />

        <Text style={styles.label}>Correo Electrónico</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Text style={styles.label}>Alergias</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={alergias}
          onChangeText={setAlergias}
          multiline
          numberOfLines={4}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleActualizar}>
          <Text style={styles.submitButtonText}>Actualizar Paciente</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.deleteButton} onPress={handleEliminar}>
          <Text style={styles.deleteButtonText}>Eliminar Paciente</Text>
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
  deleteButton: {
    backgroundColor: '#EF4444',
    paddingVertical: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 12,
  },
  deleteButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
