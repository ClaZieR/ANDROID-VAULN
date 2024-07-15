import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Platform, Modal, TouchableOpacity } from 'react-native';
import { AntDesign } from '@expo/vector-icons';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FontAwesome5 } from '@expo/vector-icons';
import { FontAwesome } from '@expo/vector-icons';
import * as LocalAuthentication from 'expo-local-authentication';
import * as Device from 'expo-device';
import { LinearGradient } from 'expo-linear-gradient';
import * as SecureStore from 'expo-secure-store';
import * as Network from 'expo-network';
import { MaterialIcons } from '@expo/vector-icons';

const checkNetworkSecurity = async () => {
  const isConnected = await Network.getNetworkStateAsync();
  const isSecure = isConnected.isInternetReachable && isConnected.isConnectedSecure;
  // Use isSecure to determine network security status
};

const checkEncryption = async () => {
  const { platform } = await Device.getPlatformAsync();
  const isEncrypted = platform === 'ios' ? await SecureStore.isAvailableAsync() : await Device.isEncryptedAsync();
  // Use isEncrypted to determine encryption status
};

const App = () => {
  const [isSecureLockEnabled, setIsSecureLockEnabled] = useState(false);
  const [isDeveloperMode, setIsDeveloperMode] = useState(__DEV__);
  const [isRooted, setIsRooted] = useState(false);
  const [showDeveloperModePopup, setShowDeveloperModePopup] = useState(false);
  const [showSecureLockPopup, setShowSecureLockPopup] = useState(false);
  const [showRootedPopup, setShowRootedPopup] = useState(false);
  const [isEncrypted, setIsEncrypted] = useState(false);
  const [isSecureNetwork, setIsSecureNetwork] = useState(false);

  useEffect(() => {
    const checkSecureLock = async () => {
      try {
        const hasHardware = await LocalAuthentication.hasHardwareAsync();
        const isEnrolled = await LocalAuthentication.isEnrolledAsync();
        setIsSecureLockEnabled(hasHardware && isEnrolled);
      } catch (error) {
        console.error('Error checking secure lock:', error);
      }
    };

    const checkRooted = async () => {
      // Using heuristic approach to determine if the device might be rooted
      // For example, check if the device is an emulator
      const isEmulator = !Device.isDevice; // true if the device is an emulator
      setIsRooted(isEmulator);
    };

    const checkSecurity = async () => {
      await checkEncryption();
      await checkNetworkSecurity();
    };

    checkSecureLock();
    checkRooted();
    checkSecurity();
  }, []);

  const osIcon = Platform.OS === 'ios' 
    ? <FontAwesome name="apple" size={40} color="white" />
    : <FontAwesome5 name="android" size={40} color="white" />;

  const handleDeveloperModePopup = () => {
    setShowDeveloperModePopup(true);
  };

  const handleSecureLockPopup = () => {
    setShowSecureLockPopup(true);
  };

  const handleRootedPopup = () => {
    setShowRootedPopup(true);
  };

  return (
    <LinearGradient
      colors={['rgba(34,193,195,1)', 'rgba(253,187,45,1)']}
      style={styles.background}
    >
      <View style={styles.container}>
        <View style={styles.osIconContainer}>
          {osIcon}
        </View>
        <View style={styles.iconRow}>
          <AntDesign name="tool" size={40} color={isDeveloperMode ? 'red' : 'green'} />
          <TouchableOpacity onPress={handleDeveloperModePopup}>
            <Text style={styles.iconText}>Developer Mode: {isDeveloperMode ? 'Enabled' : 'Disabled'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.iconRow}>
          <MaterialCommunityIcons name="lock-alert" size={40} color={isSecureLockEnabled ? 'green' : 'red'} />
          <TouchableOpacity onPress={handleSecureLockPopup}>
            <Text style={styles.iconText}>Secure Lock: {isSecureLockEnabled ? 'Enabled' : 'Disabled'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.iconRow}>
          <FontAwesome5 name="hashtag" size={40} color={isRooted ? 'red' : 'green'} />
          <TouchableOpacity onPress={handleRootedPopup}>
            <Text style={styles.iconText}>Device Rooted: {isRooted ? 'Yes' : 'No'}</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.iconRow}>
          <MaterialIcons name="security" size={40} color={isEncrypted ? 'green' : 'red'} />
          <Text style={styles.iconText}>Encryption: {isEncrypted ? 'Enabled' : 'Disabled'}</Text>
        </View>
        <View style={styles.iconRow}>
          <MaterialCommunityIcons name="security-network" size={40} color={isSecureNetwork ? 'green' : 'red'} />
          <Text style={styles.iconText}>Network Security: {isSecureNetwork ? 'Secure' : 'Not Secure'}</Text>
        </View>
      </View>

      {/* Developer Mode Popup */}
      {isDeveloperMode && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showDeveloperModePopup}
          onRequestClose={() => setShowDeveloperModePopup(false)}
        >
          <View style={styles.popupContainer}>
            <View style={styles.popup}>
              <Text style={styles.popupTitle}>Developer Mode Instructions</Text>
              <Text style={styles.popupText}>
                {Platform.OS === 'ios'
                  ? 'To disable Developer Mode, go to Settings > Privacy & Security > Developer Mode and turn it off.'
                  : 'To disable Developer Mode, go to Settings > Additional Settings > Developer options and turn it off.'}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowDeveloperModePopup(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Secure Lock Popup */}
      {!isSecureLockEnabled && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showSecureLockPopup}
          onRequestClose={() => setShowSecureLockPopup(false)}
        >
          <View style={styles.popupContainer}>
            <View style={styles.popup}>
              <Text style={styles.popupTitle}>Secure Lock Instructions</Text>
              <Text style={styles.popupText}>
                {Platform.OS === 'ios'
                  ? 'To adjust lock screen settings, go to Settings > Face ID & Passcode or Touch ID & Passcode and configure your preferred options.'
                  : 'To adjust lock screen settings, go to Settings > Security & Location and configure your preferred options.'}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowSecureLockPopup(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}

      {/* Rooted Device Popup */}
      {isRooted && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={showRootedPopup}
          onRequestClose={() => setShowRootedPopup(false)}
        >
          <View style={styles.popupContainer}>
            <View style={styles.popup}>
              <Text style={styles.popupTitle}>Device Rooted Instructions</Text>
              <Text style={styles.popupText}>
                Your device is rooted. This can compromise security.
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setShowRootedPopup(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  osIconContainer: {
    position: 'absolute',
    top: 90,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'left',
    marginVertical: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    padding: 10,
    borderRadius: 10,
    width: 300, // Fixed width
    height: 80, // Fixed height
  },
  iconText: {
    marginLeft: 20,
    fontSize: 16,
    color: 'white',
    fontWeight: 'bold',
    flexShrink: 1,
  },
  popupContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  popup: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    elevation: 5,
    minWidth: 300,
    alignItems: 'center',   
  },
  popupTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  popupText: {
    fontSize: 16,
    marginBottom: 20,
    textAlign: 'center',
  },
  closeButton: {
    backgroundColor: '#2196F3',
    padding: 10,
    borderRadius: 5,
    alignSelf: 'stretch',
    alignItems: 'center',
  },
  closeButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default App;
