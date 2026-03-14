import React, { useState, useContext } from 'react';
import { View, Text, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import { AuthContext } from '../../utils/AuthContext';
import { getTheme } from '../../utils/theme';

export default function CitasListadoScreen({ navigation }) {
  const { darkMode } = useContext(AuthContext);
  const theme = getTheme(darkMode);
  const [citas, setCitas] = useState([
    {
      id: '1',
      paciente: 'Juan Pérez',
      doctor: 'Dr. Carlos García',
      fecha: '2024-03-15',
      hora: '10:00',
      motivo: 'Revisión general',
      estado: 'Programada',
    },
    {
      id: '2',
      paciente: 'María García',
      doctor: 'Dra. Ana López',
      fecha: '2024-03-16',
      hora: '14:30',
      motivo: 'Seguimiento',
      estado: 'Confirmada',
    },
  ]);

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Programada':
        return '#FBBF24';
      case 'Confirmada':
        return '#10B981';
      case 'Cancelada':
        return '#EF4444';
      default:
        return '#6B7280';
    }
  };

  const renderCita = ({ item }) => (
    <TouchableOpacity
      style={[styles.citaCard, { backgroundColor: theme.card }]}
      onPress={() => navigation.navigate('EditarCita', { cita: item })}
    >
      <View style={styles.citaHeader}>
        <Text style={[styles.pacienteName, { color: theme.text }]}>{item.paciente}</Text>
        <View style={[styles.estado, { backgroundColor: getEstadoColor(item.estado) }]}>
          <Text style={styles.estadoText}>{item.estado}</Text>
        </View>
      </View>
      <Text style={styles.doctor}>{item.doctor}</Text>
      <View style={[styles.citaDetails, { backgroundColor: theme.detailBg }]}>
        <Text style={[styles.detail, { color: theme.sub }]}>📅 {item.fecha}</Text>
        <Text style={[styles.detail, { color: theme.sub }]}>🕙 {item.hora}</Text>
        <Text style={[styles.detail, { color: theme.sub }]}>📝 {item.motivo}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.title }]}>Citas Médicas</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CrearCita')}
        >
          <Text style={styles.addButtonText}>+ Nueva</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={citas}
        keyExtractor={item => item.id}
        renderItem={renderCita}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
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
  listContent: {
    paddingBottom: 20,
  },
  citaCard: {
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
  },
  citaHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  pacienteName: {
    fontSize: 16,
    fontWeight: '600',
  },
  estado: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  estadoText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#fff',
  },
  doctor: {
    fontSize: 13,
    color: '#4F46E5',
    marginBottom: 8,
    fontWeight: '500',
  },
  citaDetails: {
    borderRadius: 6,
    padding: 10,
  },
  detail: {
    fontSize: 12,
    marginBottom: 4,
  },
});
