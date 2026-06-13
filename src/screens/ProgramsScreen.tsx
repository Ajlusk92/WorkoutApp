import React, { useEffect, useState } from 'react';
import { Alert, ScrollView, Text, TouchableOpacity, View } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

import {
  addProgramExercise,
  cloneProgram,
  createProgram,
  deleteProgram,
  deleteProgramExercise,
  getAllProgramExercises,
  getPrograms,
  setActiveProgram,
  updateProgramExercise,
} from '../db/database';

import { importWorkoutProgramFromExcel } from '../services/excelImportService';
import {
  Card,
  DangerButton,
  Field,
  PageTitle,
  PrimaryButton,
  Screen,
  SecondaryButton,
} from '../components/ui';
import { colors } from '../theme/colors';
import { spacing } from '../theme/spacing';

export function ProgramsScreen() {
  const [programs, setPrograms] = useState<any[]>([]);
  const [selectedProgramId, setSelectedProgramId] = useState<number | null>(null);
  const [exercises, setExercises] = useState<any[]>([]);
  const [editingExerciseId, setEditingExerciseId] = useState<number | null>(null);

  const [newProgram, setNewProgram] = useState({
    name: '',
    description: '',
    startDate: new Date().toISOString().slice(0, 10),
  });

  const [newExercise, setNewExercise] = useState({
    week: '1',
    day: 'Mon',
    session: 'A',
    exercise: '',
    sets: '5',
    reps: '5',
    targetWeight: '',
    rpeTarget: '',
    progressionRule: '',
    warmupSets: '',
    notes: '',
  });

  function load() {
    const rows = getPrograms();
    setPrograms(rows);

    const selectedStillExists =
      selectedProgramId !== null && rows.some(program => program.id === selectedProgramId);

    const programToLoad = selectedStillExists ? selectedProgramId : rows[0]?.id ?? null;

    setSelectedProgramId(programToLoad);

    if (programToLoad) {
      setExercises(getAllProgramExercises(programToLoad));
    } else {
      setExercises([]);
    }
  }

  useEffect(() => {
    load();
  }, []);

  async function importExcelProgram() {
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: [
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'application/vnd.ms-excel.sheet.macroEnabled.12',
        ],
        copyToCacheDirectory: true,
      });

      if (result.canceled) return;

      const file = result.assets[0];

      await importWorkoutProgramFromExcel(file.uri, file.name);

      load();

      Alert.alert('Import Complete', `${file.name} imported and set active.`);
    } catch (error) {
      Alert.alert(
        'Import Failed',
        error instanceof Error ? error.message : 'Unknown import error'
      );
    }
  }

  function createNewProgram() {
    if (!newProgram.name.trim()) {
      Alert.alert('Missing Name', 'Enter a program name.');
      return;
    }

    createProgram({
      name: newProgram.name.trim(),
      description: newProgram.description.trim(),
      startDate: newProgram.startDate,
      active: programs.length === 0,
    });

    setNewProgram({
      name: '',
      description: '',
      startDate: new Date().toISOString().slice(0, 10),
    });

    load();
    Alert.alert('Created', 'Program created.');
  }

  function selectProgram(id: number) {
    setSelectedProgramId(id);
    setExercises(getAllProgramExercises(id));
    setEditingExerciseId(null);
    resetExerciseForm();
  }

  function makeActive(id: number) {
    setActiveProgram(id);
    load();
    Alert.alert('Updated', 'Active program changed.');
  }

  function clone(id: number) {
    cloneProgram(id);
    load();
    Alert.alert('Cloned', 'Program copied.');
  }

  function remove(id: number) {
    Alert.alert('Delete Program', 'This will delete the program and its exercises.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteProgram(id);
          load();
        },
      },
    ]);
  }

  function resetExerciseForm() {
    setNewExercise({
      week: '1',
      day: 'Mon',
      session: 'A',
      exercise: '',
      sets: '5',
      reps: '5',
      targetWeight: '',
      rpeTarget: '',
      progressionRule: '',
      warmupSets: '',
      notes: '',
    });
  }

  function editExercise(item: any) {
    setEditingExerciseId(item.id);

    setNewExercise({
      week: String(item.week ?? '1'),
      day: item.day ?? 'Mon',
      session: item.session ?? '',
      exercise: item.exercise ?? '',
      sets: String(item.sets ?? ''),
      reps: String(item.reps ?? ''),
      targetWeight: String(item.target_weight ?? ''),
      rpeTarget: item.rpe_target ?? '',
      progressionRule: item.progression_rule ?? '',
      warmupSets: item.warmup_sets ?? '',
      notes: item.notes ?? '',
    });
  }

  function saveExercise() {
    if (!selectedProgramId) {
      Alert.alert('Select Program', 'Select a program first.');
      return;
    }

    if (!newExercise.exercise.trim()) {
      Alert.alert('Missing Exercise', 'Exercise name is required.');
      return;
    }

    const payload = {
      week: Number(newExercise.week) || 1,
      day: newExercise.day.trim() || 'Mon',
      session: newExercise.session.trim(),
      exercise: newExercise.exercise.trim(),
      sets: Number(newExercise.sets) || undefined,
      reps: newExercise.reps,
      targetWeight: newExercise.targetWeight,
      rpeTarget: newExercise.rpeTarget,
      progressionRule: newExercise.progressionRule,
      warmupSets: newExercise.warmupSets,
      notes: newExercise.notes,
    };

    if (editingExerciseId) {
      updateProgramExercise({
        id: editingExerciseId,
        ...payload,
      });

      Alert.alert('Updated', 'Exercise updated.');
    } else {
      addProgramExercise({
        programId: selectedProgramId,
        ...payload,
      });

      Alert.alert('Added', 'Exercise added.');
    }

    setEditingExerciseId(null);
    resetExerciseForm();
    setExercises(getAllProgramExercises(selectedProgramId));
  }

  function removeExercise(id: number) {
    Alert.alert('Delete Exercise', 'Remove this exercise from the program?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          deleteProgramExercise(id);

          if (selectedProgramId) {
            setExercises(getAllProgramExercises(selectedProgramId));
          }
        },
      },
    ]);
  }

  const selectedProgram = programs.find(program => program.id === selectedProgramId);
  const activeProgram = programs.find(program => program.active === 1);

  return (
    <Screen>
      <ScrollView contentContainerStyle={{ padding: spacing.xl, paddingBottom: 100  }}>
        <PageTitle
          title="Programs"
          subtitle="Manage training plans, imports, and exercise progressions"
        />

        <Card title="Active Program">
          {activeProgram ? (
            <>
              <Text style={headlineText}>{activeProgram.name}</Text>
              <Text style={mutedText}>
                {activeProgram.description || 'No description added.'}
              </Text>
              <Text style={mutedText}>Start Date: {activeProgram.start_date}</Text>
            </>
          ) : (
            <Text style={mutedText}>No active program selected.</Text>
          )}
        </Card>

        <Card title="Import Program">
          <Text style={mutedText}>
            Import your Excel workbook and automatically create a program from the
            12-week training plan.
          </Text>
          <PrimaryButton title="Import Excel Program" onPress={importExcelProgram} />
        </Card>

        <Card title="Create Program">
          <Field
            label="Program Name"
            value={newProgram.name}
            onChangeText={value => setNewProgram({ ...newProgram, name: value })}
            placeholder="Example: STACKED"
          />

          <Field
            label="Description"
            value={newProgram.description}
            onChangeText={value => setNewProgram({ ...newProgram, description: value })}
            placeholder="Example: 12-week strength and fat-loss plan"
            multiline
          />

          <Field
            label="Start Date"
            value={newProgram.startDate}
            onChangeText={value => setNewProgram({ ...newProgram, startDate: value })}
            placeholder="YYYY-MM-DD"
          />

          <PrimaryButton title="Create Program" onPress={createNewProgram} />
        </Card>

        <Card title="Available Programs">
          {programs.length === 0 && <Text style={mutedText}>No programs found.</Text>}

          {programs.map(program => (
            <TouchableOpacity
              key={program.id}
              onPress={() => selectProgram(program.id)}
              style={[
                programCard,
                selectedProgramId === program.id && {
                  borderColor: colors.primary,
                  borderWidth: 2,
                },
              ]}
            >
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <Text style={programTitle}>{program.name}</Text>
                  <Text style={mutedText}>
                    {program.description || 'No description added.'}
                  </Text>
                  <Text style={mutedText}>Start Date: {program.start_date}</Text>
                </View>

                {program.active === 1 && (
                  <View style={activePill}>
                    <Text style={activePillText}>ACTIVE</Text>
                  </View>
                )}
              </View>

              <View style={{ marginTop: spacing.md }}>
                <SecondaryButton title="Set Active" onPress={() => makeActive(program.id)} />
                <SecondaryButton title="Clone Program" onPress={() => clone(program.id)} />
                <DangerButton title="Delete Program" onPress={() => remove(program.id)} />
              </View>
            </TouchableOpacity>
          ))}
        </Card>

        <Card title={selectedProgram ? `Editor: ${selectedProgram.name}` : 'Program Editor'}>
          {!selectedProgram && <Text style={mutedText}>Select a program to edit exercises.</Text>}

          {selectedProgram && (
            <>
              <Text style={sectionLabel}>
                {editingExerciseId ? 'Editing Exercise' : 'Add Exercise'}
              </Text>

              <View style={{ flexDirection: 'row', gap: spacing.md }}>
                <View style={{ flex: 1 }}>
                  <Field
                    label="Week"
                    value={newExercise.week}
                    onChangeText={value => setNewExercise({ ...newExercise, week: value })}
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Field
                    label="Day"
                    value={newExercise.day}
                    onChangeText={value => setNewExercise({ ...newExercise, day: value })}
                    placeholder="Mon"
                  />
                </View>
              </View>

              <Field
                label="Session"
                value={newExercise.session}
                onChangeText={value => setNewExercise({ ...newExercise, session: value })}
                placeholder="A"
              />

              <Field
                label="Exercise"
                value={newExercise.exercise}
                onChangeText={value => setNewExercise({ ...newExercise, exercise: value })}
                placeholder="Squat"
              />

              <View style={{ flexDirection: 'row', gap: spacing.md }}>
                <View style={{ flex: 1 }}>
                  <Field
                    label="Sets"
                    value={newExercise.sets}
                    onChangeText={value => setNewExercise({ ...newExercise, sets: value })}
                    keyboardType="numeric"
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Field
                    label="Reps"
                    value={newExercise.reps}
                    onChangeText={value => setNewExercise({ ...newExercise, reps: value })}
                  />
                </View>
              </View>

              <Field
                label="Target Weight"
                value={newExercise.targetWeight}
                onChangeText={value => setNewExercise({ ...newExercise, targetWeight: value })}
                placeholder="175"
              />

              <Field
                label="RPE Target"
                value={newExercise.rpeTarget}
                onChangeText={value => setNewExercise({ ...newExercise, rpeTarget: value })}
                placeholder="7-8"
              />

              <Field
                label="Progression Rule"
                value={newExercise.progressionRule}
                onChangeText={value =>
                  setNewExercise({ ...newExercise, progressionRule: value })
                }
                placeholder="Add 5 lb if all reps hit"
                multiline
              />

              <Field
                label="Warm-Up Sets"
                value={newExercise.warmupSets}
                onChangeText={value => setNewExercise({ ...newExercise, warmupSets: value })}
                placeholder="45%x5, 60%x3, 75%x2"
                multiline
              />

              <Field
                label="Notes"
                value={newExercise.notes}
                onChangeText={value => setNewExercise({ ...newExercise, notes: value })}
                placeholder="Technique notes, substitutions, reminders"
                multiline
              />

              <PrimaryButton
                title={editingExerciseId ? 'Save Exercise Changes' : 'Add Exercise'}
                onPress={saveExercise}
              />

              {editingExerciseId && (
                <SecondaryButton
                  title="Cancel Edit"
                  onPress={() => {
                    setEditingExerciseId(null);
                    resetExerciseForm();
                  }}
                />
              )}

              <View style={{ marginTop: spacing.xl }}>
                <Text style={sectionLabel}>Exercises</Text>

                {exercises.length === 0 && (
                  <Text style={mutedText}>No exercises added to this program yet.</Text>
                )}

                {exercises.map(item => (
                  <View key={item.id} style={exerciseCard}>
                    <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                      <View style={{ flex: 1 }}>
                        <Text style={exerciseTitle}>{item.exercise}</Text>
                        <Text style={mutedText}>
                          Week {item.week} • {item.day} • Session {item.session || 'N/A'}
                        </Text>
                        <Text style={mutedText}>
                          {item.sets || '—'} x {item.reps || '—'} @{' '}
                          {item.target_weight || 'N/A'}
                        </Text>
                      </View>
                    </View>

                    {item.progression_rule ? (
                      <Text style={{ marginTop: spacing.sm, color: colors.text }}>
                        {item.progression_rule}
                      </Text>
                    ) : null}

                    <View style={{ marginTop: spacing.md }}>
                      <SecondaryButton title="Edit Exercise" onPress={() => editExercise(item)} />
                      <DangerButton title="Delete Exercise" onPress={() => removeExercise(item.id)} />
                    </View>
                  </View>
                ))}
              </View>
            </>
          )}
        </Card>
      </ScrollView>
    </Screen>
  );
}

const headlineText = {
  fontSize: 22,
  fontWeight: '800' as const,
  color: colors.text,
};

const mutedText = {
  color: colors.muted,
  marginTop: 4,
};

const programCard = {
  backgroundColor: colors.surface,
  borderRadius: 16,
  padding: spacing.lg,
  marginBottom: spacing.md,
  borderWidth: 1,
  borderColor: colors.border,
};

const programTitle = {
  fontSize: 20,
  fontWeight: '800' as const,
  color: colors.text,
};

const activePill = {
  alignSelf: 'flex-start' as const,
  backgroundColor: colors.primarySoft,
  borderRadius: 999,
  paddingHorizontal: 10,
  paddingVertical: 5,
};

const activePillText = {
  color: colors.primary,
  fontWeight: '800' as const,
  fontSize: 12,
};

const sectionLabel = {
  fontSize: 18,
  fontWeight: '800' as const,
  color: colors.text,
  marginBottom: spacing.md,
};

const exerciseCard = {
  backgroundColor: colors.background,
  borderRadius: 14,
  padding: spacing.lg,
  marginTop: spacing.md,
  borderWidth: 1,
  borderColor: colors.border,
};

const exerciseTitle = {
  fontSize: 18,
  fontWeight: '800' as const,
  color: colors.text,
};