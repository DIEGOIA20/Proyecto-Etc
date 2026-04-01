import * as SQLite from 'expo-sqlite';
import { Platform } from 'react-native';

let dbPromise;

async function initDbPromise() {
  try {
    return SQLite.openDatabaseAsync('medicitas.db');
  } catch (error) {
    console.warn('SQLite unavailable, using fallback:', error.message);
    return null;
  }
}

dbPromise = initDbPromise();

const DEFAULT_SETTINGS = {
  darkMode: false,
  notificationsCitas: true,
  notificationsNotas: true,
  reminderWindow: '24h',
};

function toBoolean(value, fallback = false) {
  if (value === null || value === undefined) {
    return fallback;
  }
  return value === 'true';
}

async function getDb() {
  const db = await dbPromise;
  if (!db) {
    throw new Error('SQLite database not available on this platform');
  }
  return db;
}

export async function initDatabase() {
  const db = await getDb();

  await db.execAsync(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      nombreCompleto TEXT,
      telefono TEXT,
      especialidad TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS patients (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      edad INTEGER,
      telefono TEXT,
      email TEXT,
      alergias TEXT,
      especialidadPreferida TEXT,
      doctorReferente TEXT,
      fotoUri TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS doctors (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      nombre TEXT NOT NULL,
      especialidad TEXT NOT NULL,
      activo INTEGER NOT NULL DEFAULT 1,
      telefono TEXT,
      email TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS appointments (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patientId INTEGER NOT NULL,
      doctor TEXT NOT NULL,
      fecha TEXT NOT NULL,
      hora TEXT NOT NULL,
      motivo TEXT NOT NULL,
      estado TEXT NOT NULL DEFAULT 'Programada',
      notificationId TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patientId) REFERENCES patients(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      patientId INTEGER NOT NULL,
      peso REAL,
      presionArterial TEXT,
      temperatura REAL,
      notaMedica TEXT,
      fotoUri TEXT,
      createdAt TEXT DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (patientId) REFERENCES patients(id) ON DELETE CASCADE
    );

    CREATE TABLE IF NOT EXISTS settings (
      key TEXT PRIMARY KEY,
      value TEXT NOT NULL
    );
  `);

  // Migraciones para bases ya creadas en versiones anteriores.
  try {
    await db.execAsync('ALTER TABLE patients ADD COLUMN especialidadPreferida TEXT;');
  } catch (_error) {}

  try {
    await db.execAsync('ALTER TABLE patients ADD COLUMN doctorReferente TEXT;');
  } catch (_error) {}

  await seedDefaults();
}

async function seedDefaults() {
  const db = await getDb();

  const existing = await db.getFirstAsync('SELECT COUNT(*) as total FROM settings;');
  if (!existing?.total || existing.total === 0) {
    await db.runAsync('INSERT INTO settings (key, value) VALUES (?, ?);', 'darkMode', String(DEFAULT_SETTINGS.darkMode));
    await db.runAsync('INSERT INTO settings (key, value) VALUES (?, ?);', 'notificationsCitas', String(DEFAULT_SETTINGS.notificationsCitas));
    await db.runAsync('INSERT INTO settings (key, value) VALUES (?, ?);', 'notificationsNotas', String(DEFAULT_SETTINGS.notificationsNotas));
    await db.runAsync('INSERT INTO settings (key, value) VALUES (?, ?);', 'reminderWindow', DEFAULT_SETTINGS.reminderWindow);
  }

  const sampleUser = await db.getFirstAsync('SELECT id FROM users LIMIT 1;');
  if (!sampleUser) {
    await db.runAsync(
      'INSERT INTO users (email, password, nombreCompleto, telefono, especialidad) VALUES (?, ?, ?, ?, ?);',
      'admin@medicitas.com',
      '123456',
      'Usuario Admin',
      '4420000000',
      'Administrador'
    );
  }

  const doctorsCount = await db.getFirstAsync('SELECT COUNT(*) as total FROM doctors;');
  if (!doctorsCount?.total || doctorsCount.total === 0) {
    await db.runAsync(
      'INSERT INTO doctors (nombre, especialidad, activo, telefono, email) VALUES (?, ?, ?, ?, ?);',
      'Dr. Ana González',
      'Cardiología',
      1,
      '5551001001',
      'ana.gonzalez@clinic.com'
    );
    await db.runAsync(
      'INSERT INTO doctors (nombre, especialidad, activo, telefono, email) VALUES (?, ?, ?, ?, ?);',
      'Dr. Luis Martínez',
      'Medicina General',
      1,
      '5551001002',
      'luis.martinez@clinic.com'
    );
    await db.runAsync(
      'INSERT INTO doctors (nombre, especialidad, activo, telefono, email) VALUES (?, ?, ?, ?, ?);',
      'Dra. Sofía Ramírez',
      'Pediatría',
      1,
      '5551001003',
      'sofia.ramirez@clinic.com'
    );
    await db.runAsync(
      'INSERT INTO doctors (nombre, especialidad, activo, telefono, email) VALUES (?, ?, ?, ?, ?);',
      'Dr. Javier Ortega',
      'Traumatología',
      0,
      '5551001004',
      'javier.ortega@clinic.com'
    );
  }

  //pacientes de prueba
  const patientCount = await db.getFirstAsync('SELECT COUNT(*) as total FROM patients;');
  if (patientCount?.total === 0) {
    const p1 = await db.runAsync(
      'INSERT INTO patients (nombre, edad, telefono, email, alergias) VALUES (?, ?, ?, ?, ?);',
      'Juan García López',
      45,
      '5551234567',
      'juan@email.com',
      'Penicilina'
    );
    const p2 = await db.runAsync(
      'INSERT INTO patients (nombre, edad, telefono, email, alergias) VALUES (?, ?, ?, ?, ?);',
      'María Rodríguez',
      32,
      '5559876543',
      'maria@email.com',
      'Ninguna'
    );
    const p3 = await db.runAsync(
      'INSERT INTO patients (nombre, edad, telefono, email, alergias) VALUES (?, ?, ?, ?, ?);',
      'Carlos Hernández',
      58,
      '5555432109',
      'carlos@email.com',
      'Sulfamidas'
    );

    // Agregar citas de prueba
    await db.runAsync(
      'INSERT INTO appointments (patientId, doctor, fecha, hora, motivo, estado) VALUES (?, ?, ?, ?, ?, ?);',
      p1.lastInsertRowId,
      'Dr. González',
      '2026-04-05',
      '14:00',
      'Revisión general',
      'Programada'
    );
    await db.runAsync(
      'INSERT INTO appointments (patientId, doctor, fecha, hora, motivo, estado) VALUES (?, ?, ?, ?, ?, ?);',
      p2.lastInsertRowId,
      'Dra. Martínez',
      '2026-04-06',
      '10:30',
      'Seguimiento presión arterial',
      'Programada'
    );
    await db.runAsync(
      'INSERT INTO appointments (patientId, doctor, fecha, hora, motivo, estado) VALUES (?, ?, ?, ?, ?, ?);',
      p3.lastInsertRowId,
      'Dr. López',
      '2026-04-07',
      '16:00',
      'Examen cardiovascular',
      'Completada'
    );

    // Agregar notas de prueba
    await db.runAsync(
      'INSERT INTO notes (patientId, peso, presionArterial, temperatura, notaMedica) VALUES (?, ?, ?, ?, ?);',
      p1.lastInsertRowId,
      75.5,
      '120/80',
      37.2,
      'Paciente en buen estado general'
    );
    await db.runAsync(
      'INSERT INTO notes (patientId, peso, presionArterial, temperatura, notaMedica) VALUES (?, ?, ?, ?, ?);',
      p2.lastInsertRowId,
      62.0,
      '115/75',
      36.8,
      'Presión controlada'
    );
  }
}

export async function registerUser(email, password) {
  const db = await getDb();
  const existing = await db.getFirstAsync('SELECT id FROM users WHERE email = ?;', email.toLowerCase().trim());

  if (existing) {
    throw new Error('El correo ya está registrado.');
  }

  const result = await db.runAsync(
    'INSERT INTO users (email, password) VALUES (?, ?);',
    email.toLowerCase().trim(),
    password
  );

  return {
    id: result.lastInsertRowId,
    email: email.toLowerCase().trim(),
  };
}

export async function loginUser(email, password) {
  const db = await getDb();
  const user = await db.getFirstAsync(
    'SELECT id, email, nombreCompleto, telefono, especialidad FROM users WHERE email = ? AND password = ?;',
    email.toLowerCase().trim(),
    password
  );

  if (!user) {
    throw new Error('Credenciales inválidas.');
  }

  return user;
}

export async function updateUserProfile(userId, data) {
  const db = await getDb();
  await db.runAsync(
    'UPDATE users SET nombreCompleto = ?, telefono = ?, especialidad = ? WHERE id = ?;',
    data.nombreCompleto || null,
    data.telefono || null,
    data.especialidad || null,
    userId
  );

  return db.getFirstAsync(
    'SELECT id, email, nombreCompleto, telefono, especialidad FROM users WHERE id = ?;',
    userId
  );
}

export async function changeUserPassword(userId, currentPassword, newPassword) {
  const db = await getDb();
  const existing = await db.getFirstAsync(
    'SELECT id FROM users WHERE id = ? AND password = ?;',
    userId,
    currentPassword
  );

  if (!existing) {
    throw new Error('La contraseña actual es incorrecta.');
  }

  await db.runAsync(
    'UPDATE users SET password = ? WHERE id = ?;',
    newPassword,
    userId
  );

  return true;
}

export async function getUserById(userId) {
  const db = await getDb();
  return db.getFirstAsync(
    'SELECT id, email, nombreCompleto, telefono, especialidad FROM users WHERE id = ?;',
    userId
  );
}

export async function createPatient(data) {
  const db = await getDb();
  const result = await db.runAsync(
    `INSERT INTO patients (nombre, edad, telefono, email, alergias, especialidadPreferida, doctorReferente, fotoUri)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?);`,
    data.nombre,
    data.edad ? Number(data.edad) : null,
    data.telefono || null,
    data.email || null,
    data.alergias || null,
    data.especialidadPreferida || null,
    data.doctorReferente || null,
    data.fotoUri || null
  );

  return getPatientById(result.lastInsertRowId);
}

export async function updatePatient(patientId, data) {
  const db = await getDb();
  await db.runAsync(
    `UPDATE patients
     SET nombre = ?, edad = ?, telefono = ?, email = ?, alergias = ?, especialidadPreferida = ?, doctorReferente = ?, fotoUri = ?
     WHERE id = ?;`,
    data.nombre,
    data.edad ? Number(data.edad) : null,
    data.telefono || null,
    data.email || null,
    data.alergias || null,
    data.especialidadPreferida || null,
    data.doctorReferente || null,
    data.fotoUri || null,
    patientId
  );

  return getPatientById(patientId);
}

export async function deletePatient(patientId) {
  const db = await getDb();
  await db.runAsync('DELETE FROM patients WHERE id = ?;', patientId);
}

export async function getPatients(search = '') {
  const db = await getDb();
  const normalized = `%${search.trim().toLowerCase()}%`;

  return db.getAllAsync(
    `SELECT id, nombre, edad, telefono, email, alergias, especialidadPreferida, doctorReferente, fotoUri, createdAt
     FROM patients
     WHERE lower(nombre) LIKE ?
     ORDER BY nombre ASC;`,
    normalized
  );
}

export async function getPatientById(patientId) {
  const db = await getDb();
  return db.getFirstAsync(
    `SELECT id, nombre, edad, telefono, email, alergias, especialidadPreferida, doctorReferente, fotoUri, createdAt
     FROM patients
     WHERE id = ?;`,
    patientId
  );
}

export async function getDoctors({ onlyActive = false, especialidad = '' } = {}) {
  const db = await getDb();

  let query = `
    SELECT id, nombre, especialidad, activo, telefono, email, createdAt
    FROM doctors
    WHERE 1 = 1
  `;
  const args = [];

  if (onlyActive) {
    query += ' AND activo = 1';
  }

  if (especialidad?.trim()) {
    query += ' AND lower(especialidad) = ?';
    args.push(especialidad.trim().toLowerCase());
  }

  query += ' ORDER BY especialidad ASC, nombre ASC;';

  return db.getAllAsync(query, ...args);
}

export async function getDoctorSpecialties({ onlyActive = true } = {}) {
  const db = await getDb();

  let query = `
    SELECT DISTINCT especialidad
    FROM doctors
    WHERE trim(especialidad) != ''
  `;

  if (onlyActive) {
    query += ' AND activo = 1';
  }

  query += ' ORDER BY especialidad ASC;';

  const rows = await db.getAllAsync(query);
  return rows.map((item) => item.especialidad);
}

export async function createDoctor(data) {
  const db = await getDb();

  const result = await db.runAsync(
    `INSERT INTO doctors (nombre, especialidad, activo, telefono, email)
     VALUES (?, ?, ?, ?, ?);`,
    data.nombre?.trim(),
    data.especialidad?.trim(),
    data.activo ? 1 : 0,
    data.telefono?.trim() || null,
    data.email?.trim() || null
  );

  return db.getFirstAsync(
    'SELECT id, nombre, especialidad, activo, telefono, email, createdAt FROM doctors WHERE id = ?;',
    result.lastInsertRowId
  );
}

export async function updateDoctorStatus(doctorId, activo) {
  const db = await getDb();
  await db.runAsync('UPDATE doctors SET activo = ? WHERE id = ?;', activo ? 1 : 0, Number(doctorId));
}

export async function createAppointment(data) {
  const db = await getDb();
  const result = await db.runAsync(
    `INSERT INTO appointments (patientId, doctor, fecha, hora, motivo, estado, notificationId)
     VALUES (?, ?, ?, ?, ?, ?, ?);`,
    Number(data.patientId),
    data.doctor,
    data.fecha,
    data.hora,
    data.motivo,
    data.estado || 'Programada',
    data.notificationId || null
  );

  return getAppointmentById(result.lastInsertRowId);
}

export async function updateAppointment(appointmentId, data) {
  const db = await getDb();
  await db.runAsync(
    `UPDATE appointments
     SET patientId = ?, doctor = ?, fecha = ?, hora = ?, motivo = ?, estado = ?, notificationId = ?
     WHERE id = ?;`,
    Number(data.patientId),
    data.doctor,
    data.fecha,
    data.hora,
    data.motivo,
    data.estado || 'Programada',
    data.notificationId || null,
    appointmentId
  );

  return getAppointmentById(appointmentId);
}

export async function cancelAppointment(appointmentId) {
  const db = await getDb();
  await db.runAsync(
    `UPDATE appointments
     SET estado = 'Cancelada'
     WHERE id = ?;`,
    appointmentId
  );

  return getAppointmentById(appointmentId);
}

export async function deleteAppointment(appointmentId) {
  const db = await getDb();
  await db.runAsync('DELETE FROM appointments WHERE id = ?;', appointmentId);
}

export async function getAppointments({ patientId, includeCancelled = true } = {}) {
  const db = await getDb();

  let query = `
    SELECT
      a.id,
      a.patientId,
      p.nombre as paciente,
      a.doctor,
      a.fecha,
      a.hora,
      a.motivo,
      a.estado,
      a.notificationId,
      a.createdAt
    FROM appointments a
    INNER JOIN patients p ON p.id = a.patientId
    WHERE 1 = 1
  `;

  const args = [];

  if (patientId) {
    query += ' AND a.patientId = ?';
    args.push(Number(patientId));
  }

  if (!includeCancelled) {
    query += " AND a.estado != 'Cancelada'";
  }

  query += ' ORDER BY a.fecha DESC, a.hora DESC;';

  return db.getAllAsync(query, ...args);
}

export async function getAppointmentById(appointmentId) {
  const db = await getDb();
  return db.getFirstAsync(
    `SELECT
      a.id,
      a.patientId,
      p.nombre as paciente,
      a.doctor,
      a.fecha,
      a.hora,
      a.motivo,
      a.estado,
      a.notificationId,
      a.createdAt
    FROM appointments a
    INNER JOIN patients p ON p.id = a.patientId
    WHERE a.id = ?;`,
    appointmentId
  );
}

export async function createNote(data) {
  const db = await getDb();
  const result = await db.runAsync(
    `INSERT INTO notes (patientId, peso, presionArterial, temperatura, notaMedica, fotoUri)
     VALUES (?, ?, ?, ?, ?, ?);`,
    Number(data.patientId),
    data.peso ? Number(data.peso) : null,
    data.presionArterial || null,
    data.temperatura ? Number(data.temperatura) : null,
    data.notaMedica || null,
    data.fotoUri || null
  );

  return getNoteById(result.lastInsertRowId);
}

export async function getNotes({ patientId } = {}) {
  const db = await getDb();

  let query = `
    SELECT
      n.id,
      n.patientId,
      p.nombre as paciente,
      n.peso,
      n.presionArterial,
      n.temperatura,
      n.notaMedica,
      n.fotoUri,
      n.createdAt
    FROM notes n
    INNER JOIN patients p ON p.id = n.patientId
    WHERE 1 = 1
  `;

  const args = [];

  if (patientId) {
    query += ' AND n.patientId = ?';
    args.push(Number(patientId));
  }

  query += ' ORDER BY n.createdAt DESC;';

  return db.getAllAsync(query, ...args);
}

export async function getNoteById(noteId) {
  const db = await getDb();
  return db.getFirstAsync(
    `SELECT
      n.id,
      n.patientId,
      p.nombre as paciente,
      n.peso,
      n.presionArterial,
      n.temperatura,
      n.notaMedica,
      n.fotoUri,
      n.createdAt
    FROM notes n
    INNER JOIN patients p ON p.id = n.patientId
    WHERE n.id = ?;`,
    noteId
  );
}

export async function getSettings() {
  const db = await getDb();
  const rows = await db.getAllAsync('SELECT key, value FROM settings;');

  const map = rows.reduce((acc, item) => {
    acc[item.key] = item.value;
    return acc;
  }, {});

  return {
    darkMode: toBoolean(map.darkMode, DEFAULT_SETTINGS.darkMode),
    notificationsCitas: toBoolean(map.notificationsCitas, DEFAULT_SETTINGS.notificationsCitas),
    notificationsNotas: toBoolean(map.notificationsNotas, DEFAULT_SETTINGS.notificationsNotas),
    reminderWindow: map.reminderWindow || DEFAULT_SETTINGS.reminderWindow,
  };
}

export async function updateSetting(key, value) {
  const db = await getDb();
  await db.runAsync(
    `INSERT INTO settings (key, value)
     VALUES (?, ?)
     ON CONFLICT(key) DO UPDATE SET value = excluded.value;`,
    key,
    String(value)
  );
}
