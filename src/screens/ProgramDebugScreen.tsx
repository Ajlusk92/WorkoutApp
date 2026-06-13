import React, { useEffect, useState } from 'react';
import { ScrollView, Text } from 'react-native';
import { getActiveProgram } from '../db/database';

export function ProgramDebugScreen() {
  const [program, setProgram] = useState<any>(null);

  useEffect(() => {
    setProgram(getActiveProgram());
  }, []);

  return (
    <ScrollView contentContainerStyle={{ padding: 20 }}>
      <Text style={{ fontSize: 24, fontWeight: '700' }}>
        Program Debug
      </Text>

      <Text>
        {JSON.stringify(program, null, 2)}
      </Text>
    </ScrollView>
  );
}