import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, ScrollView, StyleSheet, Alert } from 'react-native';
import { AuthContext } from '../../utils/AuthContext';
import { getTheme } from '../../utils/theme';
import { updatePatient, deletePatient, getPatientById, getDoctors, getDoctorSpecialties } from '../../utils/database';

export default function EditarPacienteScreen({ route, navigation }) {
  const { darkMode } = useContext(AuthContext);
  const theme = getTheme(darkMode);
  const { paciente } = route.params;
  const [nombre, setNombre] = useState(paciente?.nombre || '');
  const [edad, setEdad] = useState(paciente?.edad?.toString() || '');
  const [telefono, setTelefono] = useState(paciente?.telefono || '');
  const [email, setEmail] = useState(paciente?.email || '');
  const [alergias, setAlergias] = useState(paciente?.alergias || '');
  const [especialidadPreferida, setEspecialidadPreferida] = useState(paciente?.especialidadPreferida || '');
  const [doctorReferente, setDoctorReferente] = useState(paciente?.doctorReferente || '');
  const [especialidades, setEspecialidades] = useState([]);
  const [doctores, setDoctores] = useState([]);
  const [fotoUri, setFotoUri] = useState(paciente?.fotoUri || '');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadPatient = async () => {
      if (!paciente?.id) {
        return;
      }
      const full = await getPatientById(paciente.id);
      if (!full) {
        return;
      }
      setNombre(full.nombre || '');
      setEdad(full.edad ? String(full.edad) : '');
      setTelefono(full.telefono || '');
      setEmail(full.email || '');
      setAlergias(full.alergias || '');
      setEspecialidadPreferida(full.especialidadPreferida || '');
      setDoctorReferente(full.doctorReferente || '');
      setFotoUri(full.fotoUri || '');
    };

    loadPatient();
  }, [paciente?.id]);

  useEffect(() => {
    const loadDoctorsData = async () => {
      const [specialtiesRows, doctorsRows] = await Promise.all([
        getDoctorSpecialties({ onlyActive: true }),
        getDoctors({ onlyActive: true }),
      ]);
      setEspecialidades(specialtiesRows);
      setDoctores(doctorsRows);
    };

    loadDoctorsData();
  }, []);

  const handleActualizar = async () => {
    if (!nombre.trim()) {
      Alert.alert('Dato requerido', 'El nombre del paciente es obligatorio.');
      return;
    }

    try {
      setSubmitting(true);
      await updatePatient(paciente.id, {
        nombre: nombre.trim(),
        edad: edad.trim(),
        telefono: telefono.trim(),
        email: email.trim(),
        alergias: alergias.trim(),
        especialidadPreferida: especialidadPreferida.trim(),
        doctorReferente: doctorReferente.trim(),
        fotoUri: fotoUri.trim(),
      });
      navigation.goBack();
    } catch (error) {
      Alert.alert('Error', 'No se pudo actualizar el paciente.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEliminar = () => {
    Alert.alert('Eliminar paciente', 'Esta acción eliminará también citas y notas asociadas.', [
      { text: 'Cancelar', style: 'cancel' },
      {
        text: 'Eliminar',
        style: 'destructive',
        onPress: async () => {
          try {
            await deletePatient(paciente.id);
            navigation.popToTop();
          } catch (error) {
            Alert.alert('Error', 'No se pudo eliminar el paciente.');
          }
        },
      },
    ]);
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: theme.bg }]}>
      <View style={[styles.form, { backgroundColor: theme.card }]}>
        <Text style={[styles.label, { color: theme.text }]}>Nombre Completo</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          value={nombre}
          onChangeText={setNombre}
        />

        <Text style={[styles.label, { color: theme.text }]}>Edad</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          value={edad}
          onChangeText={setEdad}
          keyboardType="numeric"
        />

        <Text style={[styles.label, { color: theme.text }]}>Teléfono</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          value={telefono}
          onChangeText={setTelefono}
          keyboardType="phone-pad"
        />

        <Text style={[styles.label, { color: theme.text }]}>Correo Electrónico</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
        />

        <Text style={[styles.label, { color: theme.text }]}>Alergias</Text>
        <TextInput
          style={[styles.input, styles.textarea, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          value={alergias}
          onChangeText={setAlergias}
          multiline
          numberOfLines={4}
        />

        <Text style={[styles.label, { color: theme.text }]}>Especialidad Preferida</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          value={especialidadPreferida}
          onChangeText={(value) => {
            setEspecialidadPreferida(value);
            setDoctorReferente('');
          }}
        />
        {especialidadPreferida.length > 0 && (
          <View style={{ borderWidth: 1, borderColor: theme.border, borderRadius: 6, marginBottom: 8 }}>
            {especialidades
              .filter((item) => item.toLowerCase().includes(especialidadPreferida.toLowerCase()))
              .slice(0, 5)
              .map((item) => (
                <TouchableOpacity
                  key={item}
                  onPress={() => {
                    setEspecialidadPreferida(item);
                    setDoctorReferente('');
                  }}
                  style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: theme.border }}
                >
                  <Text style={{ color: theme.text }}>{item}</Text>
                </TouchableOpacity>
              ))}
          </View>
        )}

        <Text style={[styles.label, { color: theme.text }]}>Doctor Referente</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          value={doctorReferente}
          onChangeText={setDoctorReferente}
        />
        <View style={{ borderWidth: 1, borderColor: theme.border, borderRadius: 6, marginBottom: 8 }}>
          {doctores
            .filter((item) => {
              const bySpecialty = !especialidadPreferida.trim() || item.especialidad.toLowerCase() === especialidadPreferida.trim().toLowerCase();
              const byName = !doctorReferente.trim() || item.nombre.toLowerCase().includes(doctorReferente.toLowerCase());
              return bySpecialty && byName;
            })
            .slice(0, 5)
            .map((item) => (
              <TouchableOpacity
                key={item.id}
                onPress={() => {
                  setDoctorReferente(item.nombre);
                  if (!especialidadPreferida) {
                    setEspecialidadPreferida(item.especialidad);
                  }
                }}
                style={{ padding: 10, borderBottomWidth: 1, borderBottomColor: theme.border }}
              >
                <Text style={{ color: theme.text }}>{item.nombre}</Text>
                <Text style={{ color: theme.sub, fontSize: 12 }}>{item.especialidad}</Text>
              </TouchableOpacity>
            ))}
        </View>

        <Text style={[styles.label, { color: theme.text }]}>Foto (URI opcional)</Text>
        <TextInput
          style={[styles.input, { backgroundColor: theme.inputBg, borderColor: theme.border, color: theme.text }]}
          value={fotoUri}
          onChangeText={setFotoUri}
        />

        <TouchableOpacity style={styles.submitButton} onPress={handleActualizar} disabled={submitting}>
          <Text style={styles.submitButtonText}>{submitting ? 'Actualizando...' : 'Actualizar Paciente'}</Text>
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
