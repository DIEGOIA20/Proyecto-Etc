import React, { useCallback, useContext, useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Switch, Alert, TextInput } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../utils/AuthContext';
import { getTheme } from '../../utils/theme';
import { getDoctors, updateDoctorStatus } from '../../utils/database';

export default function DoctoresListadoScreen({ navigation }) {
  const { darkMode } = useContext(AuthContext);
  const theme = getTheme(darkMode);

  const [doctores, setDoctores] = useState([]);
  const [soloActivos, setSoloActivos] = useState(false);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(false);

  const loadDoctors = useCallback(async () => {
    try {
      setLoading(true);
      const rows = await getDoctors({ onlyActive: soloActivos });
      setDoctores(rows);
    } catch (_error) {
      Alert.alert('Error', 'No se pudo cargar la lista de doctores.');
    } finally {
      setLoading(false);
    }
  }, [soloActivos]);

  useFocusEffect(
    useCallback(() => {
      loadDoctors();
    }, [loadDoctors])
  );

  const toggleActivo = async (item) => {
    try {
      await updateDoctorStatus(item.id, !item.activo);
      await loadDoctors();
    } catch (_error) {
      Alert.alert('Error', 'No se pudo actualizar el estado del doctor.');
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      loadDoctors();
    }, 250);

    return () => clearTimeout(timeoutId);
  }, [search, soloActivos, loadDoctors]);

  const filteredDoctors = doctores.filter((item) => {
    const q = search.trim().toLowerCase();
    if (!q) {
      return true;
    }

    return (
      item.nombre?.toLowerCase().includes(q) ||
      item.especialidad?.toLowerCase().includes(q) ||
      item.email?.toLowerCase().includes(q)
    );
  });

  const renderItem = ({ item }) => (
    <View style={[styles.card, { backgroundColor: theme.card }]}>
      <View style={styles.rowBetween}>
        <View style={{ flex: 1, paddingRight: 8 }}>
          <Text style={[styles.name, { color: theme.title }]}>{item.nombre}</Text>
          <Text style={[styles.meta, { color: theme.sub }]}>Especialidad: {item.especialidad}</Text>
          <Text style={[styles.meta, { color: theme.sub }]}>Tel: {item.telefono || 'No registrado'}</Text>
          <Text style={[styles.meta, { color: theme.sub }]}>{item.email || 'Sin email'}</Text>
        </View>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ color: theme.sub, marginBottom: 4, fontSize: 12 }}>Activo</Text>
          <Switch value={!!item.activo} onValueChange={() => toggleActivo(item)} />
        </View>
      </View>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.title }]}>Doctores</Text>
        <TouchableOpacity style={styles.addButton} onPress={() => navigation.navigate('CrearDoctor')}>
          <Text style={styles.addButtonText}>+ Nuevo</Text>
        </TouchableOpacity>
      </View>

      <TextInput
        style={[styles.searchInput, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
        placeholder="Buscar doctor o especialidad..."
        placeholderTextColor={theme.sub}
        value={search}
        onChangeText={setSearch}
      />

      <View style={[styles.rowBetween, { marginBottom: 12 }]}> 
        <Text style={{ color: theme.sub }}>Mostrar solo activos</Text>
        <Switch value={soloActivos} onValueChange={setSoloActivos} />
      </View>

      <FlatList
        data={filteredDoctors}
        keyExtractor={(item) => String(item.id)}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <Text style={{ color: theme.sub, textAlign: 'center', marginTop: 24 }}>
            {loading ? 'Cargando doctores...' : 'No hay doctores registrados.'}
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
  card: {
    borderRadius: 8,
    padding: 14,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#4F46E5',
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  name: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  meta: {
    fontSize: 12,
    marginBottom: 2,
  },
  listContent: {
    paddingBottom: 20,
  },
});
