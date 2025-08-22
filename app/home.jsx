import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      {/* Texto correctamente envuelto en un componente <Text> */}
      <Text style={styles.text}>✅ ¡Bienvenido, login exitoso con reconocimiento facial simulado!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#222' },
  text: { fontSize: 18, color: '#fff', textAlign: 'center', padding: 20 }
});