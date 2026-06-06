import { collection, doc, setDoc, getDocs } from 'firebase/firestore';
import { firestore } from '@/config/firebase';
import { getWorkoutLogs, saveWorkoutLog } from '@/db/workoutRepository';
import { WorkoutLog } from '@/types/program';

export async function pushWorkoutLogsToCloud(userId: string): Promise<void> {
  const logs = await getWorkoutLogs();
  for (const log of logs) {
    await setDoc(doc(firestore, 'users', userId, 'workoutLogs', log.id), log);
  }
}

export async function pullWorkoutLogsFromCloud(userId: string): Promise<void> {
  const snapshot = await getDocs(collection(firestore, 'users', userId, 'workoutLogs'));
  for (const item of snapshot.docs) {
    await saveWorkoutLog(item.data() as WorkoutLog);
  }
}
