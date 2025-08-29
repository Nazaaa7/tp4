import React, { useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, ActivityIndicator, Alert, TextInput } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

export default function RegisterFaceScreen() {
  const [permission, requestPermission] = useCameraPermissions();
  const [isCameraOpen, setIsCameraOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [cuil, setCuil] = useState("");
  const cameraRef = useRef(null);
  const router = useRouter();

  const takePicture = async () => {
    if (!cameraRef.current) return;
    if (!cuil) {
      Alert.alert("Error", "Debes ingresar tu CUIL antes de registrar.");
      return;
    }

    setLoading(true);
    try {
      const photo = await cameraRef.current.takePictureAsync({ base64: false });
      const formData = new FormData();
      formData.append("cuil", cuil);
      formData.append("image", {
        uri: photo.uri,
        name: "photo.jpg",
        type: "image/jpeg",
      });

      const response = await fetch("https://52ve8mm1q0ra.share.zrok.io/register", {
        method: "POST",
        headers: { "skip_zrok_interstitial": "true" },
        body: formData,
      });

      const result = await response.json();
      console.log(result);

      if (response.ok) {
       await AsyncStorage.setItem("cuilRegistered", cuil);
await AsyncStorage.setItem("faceRegistered", "true"); 
        Alert.alert("Éxito", "Rostro registrado correctamente.");
        router.replace("/login");
      } else {
        Alert.alert("Error", result?.message || "No se pudo registrar el rostro");
      }
    } catch (error) {
      console.error(error);
      Alert.alert("Error", "Ocurrió un problema con la red");
    } finally {
      setLoading(false);
      setIsCameraOpen(false);
    }
  };

  if (!permission) return <View style={styles.center}><Text>Cargando permisos...</Text></View>;
  if (!permission.granted)
    return (
      <View style={styles.center}>
        <Text>Necesitamos tu permiso para acceder a la cámara.</Text>
        <TouchableOpacity onPress={requestPermission}><Text>Conceder permiso</Text></TouchableOpacity>
      </View>
    );

  return (
    <View style={styles.container}>
      {!isCameraOpen ? (
        <>
          <Text style={styles.title}>Registro de Rostro</Text>
          <TextInput
            style={styles.input}
            placeholder="Ingresa tu CUIL"
            placeholderTextColor="#aaa"
            value={cuil}
            onChangeText={setCuil}
          />
          <TouchableOpacity style={styles.button} onPress={() => setIsCameraOpen(true)}>
            <Text style={styles.buttonText}>Abrir Cámara</Text>
          </TouchableOpacity>
        </>
      ) : (
        <View style={{ flex: 1, width: "100%" }}>
          <CameraView ref={cameraRef} style={{ flex: 1 }} facing="front" />
          <TouchableOpacity style={styles.captureButton} onPress={takePicture}>
            <Text style={{ color: "#fff" }}>Capturar</Text>
          </TouchableOpacity>
          {loading && (
            <View style={styles.overlay}>
              <ActivityIndicator size="large" color="#fff" />
              <Text style={styles.overlayText}>Registrando rostro...</Text>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#111" },
  title: { fontSize: 20, fontWeight: "bold", color: "#fff", marginBottom: 20 },
  button: { backgroundColor: "#4c6ef5", padding: 15, borderRadius: 10 },
  buttonText: { color: "#fff", fontSize: 16 },
  input: { borderWidth: 1, borderColor: "#aaa", padding: 10, borderRadius: 8, color: "#fff", width: "80%", marginBottom: 20 },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  captureButton: { position: "absolute", bottom: 40, alignSelf: "center", backgroundColor: "#4c6ef5", padding: 15, borderRadius: 50 },
  overlay: { position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.6)", justifyContent: "center", alignItems: "center" },
  overlayText: { color: "#fff", marginTop: 10, fontSize: 16 },
});
