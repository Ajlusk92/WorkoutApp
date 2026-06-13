import * as FileSystem from 'expo-file-system';
import * as XLSX from 'xlsx';
import { addProgramExercise, createProgram, setActiveProgram } from '../db/database';

export async function importWorkoutProgramFromExcel(uri: string, fileName: string) {
  const base64 = await FileSystem.readAsStringAsync(uri, {
    encoding: 'base64',
  });

  const workbook = XLSX.read(base64, { type: 'base64' });
  const sheet = workbook.Sheets['12-Week Training Plan'];

  if (!sheet) {
    throw new Error('Could not find sheet: 12-Week Training Plan');
  }

  const rows = XLSX.utils.sheet_to_json<any>(sheet);

  const programId = createProgram({
    name: fileName.replace('.xlsm', '').replace('.xlsx', ''),
    description: 'Imported from Excel workbook',
    startDate: new Date().toISOString().slice(0, 10),
    active: true,
  });

  if (!programId) {
    throw new Error('Could not create program.');
  }

  rows.forEach(row => {
    const exercise = row['Exercise'];
    if (!exercise) return;

    addProgramExercise({
      programId,
      week: Number(row['Week']) || 1,
      day: String(row['Day'] ?? 'Mon'),
      session: String(row['Session'] ?? ''),
      exercise: String(exercise),
      sets: Number(row['Sets']) || undefined,
      reps: String(row['Reps'] ?? ''),
      percentTrainingMax: Number(row['% Training Max']) || null,
      targetWeight: String(row['Target Wt'] ?? ''),
      rpeTarget: String(row['RPE Target'] ?? ''),
      progressionRule: String(row['Progression Rule'] ?? ''),
      warmupSets: String(row['Warm-Up Sets'] ?? ''),
      notes: String(row['Notes'] ?? ''),
    });
  });

  setActiveProgram(programId);
  return programId;
}