import React from 'react';
import { View, Text, Pressable } from 'react-native';

export function ScoreRadio({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <View style={{ flexDirection: 'row', gap: 8 }}>
      {[0, 1, 2, 3].map((n) => (
        <Pressable
          key={n}
          onPress={() => onChange(n)}
          accessibilityRole="button"
          accessibilityLabel={`score-${n}`}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderWidth: 1,
            borderRadius: 10,
            backgroundColor: value === n ? '#e8e8e8' : '#fff',
          }}
        >
          <Text style={{ fontSize: 16 }}>{n}</Text>
        </Pressable>
      ))}
    </View>
  );
}
