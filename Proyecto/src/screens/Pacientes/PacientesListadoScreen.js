import React, { useState, useContext, useEffect, useCallback } from 'react';
import { View, Text, FlatList, TouchableOpacity, TextInput, StyleSheet, Alert } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../utils/AuthContext';
import { getTheme } from '../../utils/theme';
import { getPatients } from '../../utils/database';

export default function PacientesListadoScreen({ navigation }) {
  const { darkMode } = useContext(AuthContext);
  const theme = getTheme(darkMode);
  const [pacientes, setPacientes] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const loadPatients = useCallback(async (term = '') => {
    try {
      setLoading(true);
      const rows = await getPatients(term);
      setPacientes(rows);
    } catch (error) {
      Alert.alert('Error', 'No se pudo cargar la lista de pacientes.');
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadPatients(search);
    }, [loadPatients, search])
  );

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadPatients(search);
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [search, loadPatients]);

  const renderPaciente = ({ item }) => (
    <TouchableOpacity
      style={[styles.pacienteCard, { backgroundColor: theme.card }]}
      onPress={() => navigation.navigate('PacienteFicha', { paciente: item })}
    >
      <View>
        <Text style={[styles.pacienteNombre, { color: theme.text }]}>{item.nombre}</Text>
        <Text style={[styles.pacienteInfo, { color: theme.sub }]}>Edad: {item.edad} años</Text>
        <Text style={[styles.pacienteInfo, { color: theme.sub }]}>Tel: {item.telefono}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.title }]}>Pacientes</Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => navigation.navigate('CrearPaciente')}
        >
          <Text style={styles.addButtonText}>+ Nuevo</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={[styles.searchInput, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
        placeholder="Buscar paciente..."
        placeholderTextColor={theme.sub}
        value={search}
        onChangeText={setSearch}
      />

      <FlatList
        data={pacientes}
        keyExtractor={item => String(item.id)}
        renderItem={renderPaciente}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={{ color: theme.sub, textAlign: 'center', marginTop: 24 }}>
            {loading ? 'Cargando pacientes...' : 'No hay pacientes registrados.'}
          </Text>
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    paddingTop: 12,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  title: {
    fontSize: 28,
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
  searchInput: {
    borderWidth: 1,
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
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4F46E5',
  },
  pacienteNombre: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  pacienteInfo: {
    fontSize: 12,
    marginBottom: 2,
  },
});
