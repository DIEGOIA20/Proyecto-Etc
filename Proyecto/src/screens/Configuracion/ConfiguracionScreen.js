import React, { useState } from 'react';
import { View, Text, Switch, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

export default function ConfiguracionScreen() {
  const [modoOscuro, setModoOscuro] = useState(false);
  const [notificacionesCitas, setNotificacionesCitas] = useState(true);
  const [notificacionesNotas, setNotificacionesNotas] = useState(true);
  const [recuerdoAnticipado, setRecuerdoAnticipado] = useState('24h');

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Apariencia</Text>

        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingLabel}>Modo Oscuro</Text>
            <Text style={styles.settingDescription}>Cambiar el tema de la aplicación</Text>
          </View>
          <Switch
            value={modoOscuro}
            onValueChange={setModoOscuro}
            trackColor={{ false: '#E5E7EB', true: '#6366F1' }}
            thumbColor={modoOscuro ? '#4F46E5' : '#F3F4F6'}
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notificaciones</Text>

        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingLabel}>Recordatorio de Citas</Text>
            <Text style={styles.settingDescription}>Recibir notificaciones de citas</Text>
          </View>
          <Switch
            value={notificacionesCitas}
            onValueChange={setNotificacionesCitas}
            trackColor={{ false: '#E5E7EB', true: '#10B981' }}
            thumbColor={notificacionesCitas ? '#059669' : '#F3F4F6'}
          />
        </View>

        <View style={styles.separator} />

        <View style={styles.settingRow}>
          <View>
            <Text style={styles.settingLabel}>Notificaciones de Notas</Text>
            <Text style={styles.settingDescription}>Alertas sobre nuevas notas médicas</Text>
          </View>
          <Switch
            value={notificacionesNotas}
            onValueChange={setNotificacionesNotas}
            trackColor={{ false: '#E5E7EB', true: '#10B981' }}
            thumbColor={notificacionesNotas ? '#059669' : '#F3F4F6'}
          />
        </View>

        <View style={styles.separator} />

        <View style={styles.settingBox}>
          <Text style={styles.settingLabel}>Recordatorio Anticipado</Text>
          <Text style={styles.settingDescription}>¿Cuándo desea recordar las citas?</Text>
          <View style={styles.optionsContainer}>
            {['15m', '1h', '24h', '48h'].map(option => (
              <TouchableOpacity
                key={option}
                style={[
                  styles.optionButton,
                  recuerdoAnticipado === option && styles.optionButtonActive,
                ]}
                onPress={() => setRecuerdoAnticipado(option)}
              >
                <Text
                  style={[
                    styles.optionText,
                    recuerdoAnticipado === option && styles.optionTextActive,
                  ]}
                >
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Información</Text>

        <View style={styles.infoBox}>
          <Text style={styles.infoLabel}>Versión de la App</Text>
          <Text style={styles.infoValue}>1.0.0</Text>
        </View>

        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkText}>Términos y Condiciones</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkText}>Política de Privacidad</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.linkButton}>
          <Text style={styles.linkText}>Contacto y Soporte</Text>
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
  section: {
    backgroundColor: '#fff',
    marginVertical: 8,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    paddingVertical: 16,
    paddingHorizontal: 0,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  separator: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },
  settingBox: {
    paddingVertical: 14,
  },
  optionsContainer: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'space-between',
  },
  optionButton: {
    flex: 1,
    paddingVertical: 8,
    marginHorizontal: 4,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    alignItems: 'center',
  },
  optionButtonActive: {
    backgroundColor: '#4F46E5',
    borderColor: '#4F46E5',
  },
  optionText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
  },
  optionTextActive: {
    color: '#fff',
  },
  infoBox: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoLabel: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
  },
  infoValue: {
    fontSize: 14,
    color: '#6B7280',
  },
  linkButton: {
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  linkText: {
    fontSize: 14,
    color: '#4F46E5',
    fontWeight: '500',
  },
});
