import React, { useState, useContext, useCallback } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { AuthContext } from '../../utils/AuthContext';
import { getTheme } from '../../utils/theme';
import { getAppointments, getNotes, getPatientById } from '../../utils/database';

export default function PacienteFichaScreen({ route, navigation }) {
  const { darkMode } = useContext(AuthContext);
  const theme = getTheme(darkMode);
  const { paciente: pacienteParam } = route.params;
  const [paciente, setPaciente] = useState(pacienteParam);
  const [activeTab, setActiveTab] = useState('info');
  const [citas, setCitas] = useState([]);
  const [notas, setNotas] = useState([]);

  const loadData = useCallback(async () => {
    if (!paciente?.id) {
      return;
    }
    const [patientRows, citasRows, notasRows] = await Promise.all([
      getPatientById(paciente.id),
      getAppointments({ patientId: paciente.id, includeCancelled: true }),
      getNotes({ patientId: paciente.id }),
    ]);

    if (patientRows) {
      setPaciente(patientRows);
    }
    setCitas(citasRows);
    setNotas(notasRows);
  }, [paciente?.id]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const renderInfo = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.title }]}>Información Personal</Text>
      <View style={[styles.infoRow, { borderBottomColor: theme.border }]}>
        <Text style={[styles.label, { color: theme.sub }]}>Nombre:</Text>
        <Text style={[styles.value, { color: theme.text }]}>{paciente.nombre}</Text>
      </View>
      <View style={[styles.infoRow, { borderBottomColor: theme.border }]}>
        <Text style={[styles.label, { color: theme.sub }]}>Edad:</Text>
        <Text style={[styles.value, { color: theme.text }]}>{paciente.edad} años</Text>
      </View>
      <View style={[styles.infoRow, { borderBottomColor: theme.border }]}>
        <Text style={[styles.label, { color: theme.sub }]}>Teléfono:</Text>
        <Text style={[styles.value, { color: theme.text }]}>{paciente.telefono}</Text>
      </View>
      <View style={[styles.infoRow, { borderBottomColor: theme.border }]}>
        <Text style={[styles.label, { color: theme.sub }]}>Foto (URI):</Text>
        <Text style={[styles.value, { color: theme.text }]}>{paciente.fotoUri || 'No registrada'}</Text>
      </View>
      <View style={[styles.infoRow, { borderBottomColor: theme.border }]}>
        <Text style={[styles.label, { color: theme.sub }]}>Especialidad:</Text>
        <Text style={[styles.value, { color: theme.text }]}>{paciente.especialidadPreferida || 'No asignada'}</Text>
      </View>
      <View style={[styles.infoRow, { borderBottomColor: theme.border }]}>
        <Text style={[styles.label, { color: theme.sub }]}>Doctor referente:</Text>
        <Text style={[styles.value, { color: theme.text }]}>{paciente.doctorReferente || 'No asignado'}</Text>
      </View>

      <TouchableOpacity
        style={styles.editButton}
        onPress={() => navigation.navigate('EditarPaciente', { paciente })}
      >
        <Text style={styles.editButtonText}>Editar Información</Text>
      </TouchableOpacity>
    </View>
  );

  const renderCitas = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.title }]}>Citas Médicas</Text>
      {citas.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: theme.sub }]}>No hay citas registradas</Text>
        </View>
      ) : (
        citas.map((cita) => (
          <View key={cita.id} style={{ marginBottom: 12, borderWidth: 1, borderColor: theme.border, borderRadius: 6, padding: 10 }}>
            <Text style={{ color: theme.text, fontWeight: '600' }}>{cita.fecha} {cita.hora}</Text>
            <Text style={{ color: theme.sub }}>{cita.doctor}</Text>
            <Text style={{ color: theme.sub }}>{cita.motivo}</Text>
            <Text style={{ color: theme.sub }}>Estado: {cita.estado}</Text>
          </View>
        ))
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('CrearCita', { patientId: paciente.id, pacienteNombre: paciente.nombre })}
      >
        <Text style={styles.addButtonText}>+ Agendar Cita</Text>
      </TouchableOpacity>
    </View>
  );

  const renderNotas = () => (
    <View style={styles.section}>
      <Text style={[styles.sectionTitle, { color: theme.title }]}>Notas Médicas</Text>
      {notas.length === 0 ? (
        <View style={styles.emptyState}>
          <Text style={[styles.emptyText, { color: theme.sub }]}>Sin notas registradas</Text>
        </View>
      ) : (
        notas.map((nota) => (
          <View key={nota.id} style={{ marginBottom: 12, borderWidth: 1, borderColor: theme.border, borderRadius: 6, padding: 10 }}>
            <Text style={{ color: theme.text, fontWeight: '600' }}>Peso: {nota.peso ?? '-'} kg</Text>
            <Text style={{ color: theme.sub }}>Presion: {nota.presionArterial || '-'}</Text>
            <Text style={{ color: theme.sub }}>Temperatura: {nota.temperatura ?? '-'}</Text>
            <Text style={{ color: theme.sub }}>{nota.notaMedica || 'Sin observaciones'}</Text>
            <Text style={{ color: theme.sub }}>Foto (URI): {nota.fotoUri || 'No registrada'}</Text>
          </View>
        ))
      )}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('Notas', { patientId: paciente.id, pacienteNombre: paciente.nombre })}
      >
        <Text style={styles.addButtonText}>+ Agregar Nota</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={styles.header}>
        <Text style={styles.pacienteName}>{paciente.nombre}</Text>
      </View>

      <View style={[styles.tabs, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'info' && styles.activeTab]}
          onPress={() => setActiveTab('info')}
        >
          <Text style={[styles.tabText, activeTab === 'info' && styles.activeTabText]}>
            Información
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'citas' && styles.activeTab]}
          onPress={() => setActiveTab('citas')}
        >
          <Text style={[styles.tabText, activeTab === 'citas' && styles.activeTabText]}>
            Citas
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, activeTab === 'notas' && styles.activeTab]}
          onPress={() => setActiveTab('notas')}
        >
          <Text style={[styles.tabText, activeTab === 'notas' && styles.activeTabText]}>
            Notas
          </Text>
        </TouchableOpacity>
      </View>

      {activeTab === 'info' && renderInfo()}
      {activeTab === 'citas' && renderCitas()}
      {activeTab === 'notas' && renderNotas()}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    backgroundColor: '#4F46E5',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  pacienteName: {
    fontSize: 24,
    fontWeight: '700',
    color: '#fff',
  },
  tabs: {
    flexDirection: 'row',
    borderBottomWidth: 1,
  },
  tab: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 3,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#4F46E5',
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  activeTabText: {
    color: '#4F46E5',
  },
  section: {
    padding: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
  },
  value: {
    fontSize: 14,
    fontWeight: '500',
  },
  editButton: {
    backgroundColor: '#4F46E5',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 16,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    paddingVertical: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  addButton: {
    backgroundColor: '#10B981',
    paddingVertical: 10,
    borderRadius: 6,
    alignItems: 'center',
    marginTop: 12,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
