import program from '@/data/workoutProgram.json';
import { db } from './database';

export async function seedProgramIfNeeded() {
  const row = await db.getFirstAsync<{ value: string }>('SELECT value FROM app_meta WHERE key = ?', ['program_seeded']);
  if (row?.value === 'true') return;

  // The current version bundles the workbook-derived plan as JSON.
  // In a later backend version, this is where you can migrate the plan into normalized tables.
  await db.runAsync('INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)', ['program_title', program.meta.title]);
  await db.runAsync('INSERT OR REPLACE INTO app_meta (key, value) VALUES (?, ?)', ['program_seeded', 'true']);
}
