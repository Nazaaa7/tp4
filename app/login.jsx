import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Platform, Button } from 'react-native';
import { CameraView, useCameraPermissions } from 'expo-camera';
import { useRouter } from 'expo-router';

export default function LoginScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleFaceLogin = () => {
    setIsCameraOpen(true);
    setLoading(true);

    setTimeout(() => {
      setLoading(false);
      setIsCameraOpen(false);
      setTimeout(() => router.replace("/home"), 100);
    }, 3000);
  };

  if (!permission) {
    return (
      <View style={styles.center}>
        <Text>Cargando permisos...</Text>
      </View>
    );
  }

  if (!permission.granted) {
    return (
      <View style={styles.center}>
        <Text style={{ textAlign: 'center', marginBottom: 10 }}>
          Necesitamos tu permiso para acceder a la cámara.
        </Text>
        <Button onPress={requestPermission} title="Conceder permiso" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {!isCameraOpen ? (
        <>
          <Text style={styles.title}>Login con Reconocimiento Facial</Text>
          <TouchableOpacity style={styles.button} onPress={handleFaceLogin}>
            <Text style={styles.buttonText}>Iniciar sesión con cámara</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.button, { marginTop: 10 }]} onPress={() => router.push("/registerFace")}>
  <Text style={styles.buttonText}>Registrar rostro</Text>
</TouchableOpacity>
        </>
        
      ) : (
        <View style={{ flex: 1, width: '100%' }}>
          {Platform.OS !== 'web' ? (
            <CameraView 
              style={{ flex: 1 }} 
              facing="front"
            />
          ) : (
            <View style={styles.center}>
              <Text style={{ color: '#fff', textAlign: 'center' }}>
                Cámara no disponible en web
              </Text>
            </View>
          )}
          {loading && (
            <View style={styles.overlay}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.overlayText}>Escaneando rostro...</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#111' 
  },
  title: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#fff', 
    marginBottom: 20 
  },
  button: { 
    backgroundColor: '#4c6ef5', 
    padding: 15, 
    borderRadius: 10 
  },
  buttonText: { 
    color: '#fff', 
    fontSize: 16 
  },
  center: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  overlay: {
    position: 'absolute',
    top: 0, 
    left: 0, 
    right: 0, 
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  overlayText: { 
    color: '#fff', 
    marginTop: 10, 
    fontSize: 16 
  }
});