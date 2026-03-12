import React, { useState } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet } from 'react-native';

export default function PacientesListadoScreen({ navigation }) {
  const [pacientes, setPacientes] = useState([
    { id: '1', nombre: 'Juan Pérez', edad: 35, telefono: '123456789' },
    { id: '2', nombre: 'María García', edad: 28, telefono: '987654321' },
  ]);
  const [search, setSearch] = useState('');

  const filteredPacientes = pacientes.filter(p =>
    p.nombre.toLowerCase().includes(search.toLowerCase())
  );

  const renderPaciente = ({ item }) => (
    <TouchableOpacity
      style={styles.pacienteCard}
      onPress={() => navigation.navigate('PacienteFicha', { paciente: item })}
    >
      <View>
        <Text style={styles.pacienteNombre}>{item.nombre}</Text>
        <Text style={styles.pacienteInfo}>Edad: {item.edad} años</Text>
        <Text style={styles.pacienteInfo}>Tel: {item.telefono}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Pacientes</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CrearPaciente')}
        >
          <Text style={styles.addButtonText}>+ Nuevo</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={styles.searchInput}
        placeholder="Buscar paciente..."
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={filteredPacientes}
        keyExtractor={item => item.id}
        renderItem={renderPaciente}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#111827',
  },
  addButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
  },
  addButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 16,
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 20,
  },
  pacienteCard: {
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4F46E5',
  },
  pacienteNombre: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 4,
  },
  pacienteInfo: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 2,
  },
});
