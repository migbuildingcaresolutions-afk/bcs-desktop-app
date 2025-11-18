/**
 * Android Camera Module for Job Site Photos
 * Captures photos with metadata (GPS, timestamp, job ID)
 */

import React, { useState, useRef } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, Alert } from 'react-native';
import { RNCamera } from 'react-native-camera';
import Geolocation from 'react-native-geolocation-service';
import RNFS from 'react-native-fs';

interface CameraModuleProps {
  jobId: string;
  onPhotoCapture: (photoData: PhotoData) => void;
  onClose: () => void;
}

interface PhotoData {
  uri: string;
  filename: string;
  jobId: string;
  latitude: number | null;
  longitude: number | null;
  timestamp: string;
  fileSize: number;
}

export const CameraModule: React.FC<CameraModuleProps> = ({
  jobId,
  onPhotoCapture,
  onClose,
}) => {
  const cameraRef = useRef<RNCamera>(null);
  const [capturing, setCapturing] = useState(false);

  const takePicture = async () => {
    if (cameraRef.current && !capturing) {
      setCapturing(true);

      try {
        // Capture photo
        const options = {
          quality: 0.8,
          base64: false,
          width: 1920,
          height: 1080,
          orientation: 'portrait',
          fixOrientation: true,
        };

        const data = await cameraRef.current.takePictureAsync(options);

        // Get GPS location
        const location = await getCurrentLocation();

        // Get file stats
        const fileInfo = await RNFS.stat(data.uri);

        // Generate filename
        const timestamp = new Date().toISOString();
        const filename = `job_${jobId}_${Date.now()}.jpg`;

        // Create photo directory if it doesn't exist
        const photoDir = `${RNFS.DocumentDirectoryPath}/job_photos/${jobId}`;
        await RNFS.mkdir(photoDir);

        // Move photo to permanent storage
        const permanentPath = `${photoDir}/${filename}`;
        await RNFS.moveFile(data.uri, permanentPath);

        const photoData: PhotoData = {
          uri: permanentPath,
          filename,
          jobId,
          latitude: location?.latitude || null,
          longitude: location?.longitude || null,
          timestamp,
          fileSize: parseInt(fileInfo.size, 10),
        };

        onPhotoCapture(photoData);
        Alert.alert('Success', 'Photo captured successfully!');
      } catch (error) {
        console.error('Error capturing photo:', error);
        Alert.alert('Error', 'Failed to capture photo');
      } finally {
        setCapturing(false);
      }
    }
  };

  const getCurrentLocation = (): Promise<{
    latitude: number;
    longitude: number;
  } | null> => {
    return new Promise((resolve) => {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (error) => {
          console.error('Error getting location:', error);
          resolve(null);
        },
        { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
      );
    });
  };

  return (
    <View style={styles.container}>
      <RNCamera
        ref={cameraRef}
        style={styles.preview}
        type={RNCamera.Constants.Type.back}
        flashMode={RNCamera.Constants.FlashMode.auto}
        androidCameraPermissionOptions={{
          title: 'Permission to use camera',
          message: 'We need your permission to use your camera',
          buttonPositive: 'Ok',
          buttonNegative: 'Cancel',
        }}
        captureAudio={false}
      >
        <View style={styles.overlay}>
          {/* Top Bar */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.closeButton} onPress={onClose}>
              <Text style={styles.closeButtonText}>✕</Text>
            </TouchableOpacity>
            <Text style={styles.jobIdText}>Job #{jobId}</Text>
          </View>

          {/* Bottom Controls */}
          <View style={styles.bottomBar}>
            <TouchableOpacity
              style={[styles.captureButton, capturing && styles.capturing]}
              onPress={takePicture}
              disabled={capturing}
            >
              <View style={styles.captureButtonInner} />
            </TouchableOpacity>
          </View>
        </View>
      </RNCamera>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'black',
  },
  preview: {
    flex: 1,
    justifyContent: 'space-between',
  },
  overlay: {
    flex: 1,
    justifyContent: 'space-between',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 40,
    backgroundColor: 'rgba(0,0,0,0.3)',
  },
  closeButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.3)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontSize: 24,
    fontWeight: 'bold',
  },
  jobIdText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  bottomBar: {
    alignItems: 'center',
    paddingBottom: 40,
    backgroundColor: 'rgba(0,0,0,0.3)',
    paddingVertical: 30,
  },
  captureButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#007AFF',
  },
  captureButtonInner: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: '#007AFF',
  },
  capturing: {
    opacity: 0.5,
  },
});

export default CameraModule;
