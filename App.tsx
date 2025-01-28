import React, { useState, useRef, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  Modal,
  ActivityIndicator,
  Animated,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';

const OpenSpool = () => {
  const [isLoading, setIsLoading] = useState(true);
  const rotateAnim = useRef(new Animated.Value(0)).current;
  const [color, setColor] = useState('magenta');
  const [type, setType] = useState('pla');
  const [minTemp, setMinTemp] = useState('180');
  const [maxTemp, setMaxTemp] = useState('210');
  const [modalTitle, setModalTitle] = useState('Read Tag');
  const [readTagModalOpen, setReadTagModalOpen] = useState(false);

  useEffect(() => {
    Animated.timing(rotateAnim, {
      toValue: 1,
      duration: 720,
      useNativeDriver: true,
    }).start(() => {
      setIsLoading(false);
    });
  }, [rotateAnim]);

  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const colors = [
    { label: 'White', value: 'white', hex: 'FFFFFF' },
    { label: 'Yellow', value: 'yellow', hex: 'FFF144' },
    { label: 'Grass Green', value: 'grass_green', hex: 'DCF478' },
    { label: 'Bambu Green', value: 'bambu_green', hex: '0ACC38' },
    { label: 'Missletoe Green', value: 'missletoe_green', hex: '057748' },
    { label: 'Dark Blue', value: 'dark_blue', hex: '0D6284' },
    { label: 'Glow Green', value: 'glow_green', hex: '0EE2A0' },
    { label: 'Ice Blue', value: 'ice_blue', hex: '76D9F4' },
    { label: 'Cyan', value: 'cyan', hex: '46A8F9' },
    { label: 'Blue', value: 'blue', hex: '2850E0' },
    { label: 'Iris Purple', value: 'iris_purple', hex: '443089' },
    { label: 'Purple', value: 'purple', hex: 'A03CF7' },
    { label: 'Magenta', value: 'magenta', hex: 'F330F9' },
    { label: 'Sakura Pink', value: 'sakura_pink', hex: 'D4B1DD' },
    { label: 'Pink', value: 'pink', hex: 'F95D73' },
    { label: 'Red', value: 'red', hex: 'F72323' },
    { label: 'Dark Brown', value: 'dark_brown', hex: '7C4B00' },
    { label: 'Orange', value: 'orange', hex: 'F98C36' },
    { label: 'Beige', value: 'beige', hex: 'FCECD6' },
    { label: 'Desert Tan', value: 'desert_tan', hex: 'D3C5A3' },
    { label: 'Brown', value: 'brown', hex: 'AF7933' },
    { label: 'Ash Grey', value: 'ash_grey', hex: '898989' },
    { label: 'Grey', value: 'grey', hex: 'BCBCBC' },
    { label: 'Black', value: 'black', hex: '161616' },
  ];

  const types = [
    { label: 'PLA', value: 'pla' },
    { label: 'PETG', value: 'petg' },
    { label: 'ABS', value: 'abs' },
    { label: 'TPU', value: 'tpu' },
    { label: 'Nylon', value: 'nylon' },
  ];

  const temperatures = Array.from({ length: 20 }, (_, i) => ({
    label: `${180 + i * 5}°C`,
    value: (180 + i * 5).toString(),
  }));

  const renderColorItem = (item: any) => {
    return (
      <View style={styles.colorItem}>
        <View style={[styles.colorSwatch, { backgroundColor: `#${item.hex}` }]} />
        <Text style={styles.colorLabel}>{item.label}</Text>
      </View>
    );
  };

  const verifyAndSetMinTemp = (temp: string) => {
      // If the new minTemp is equal or greater than the maxTemp, adjust maxTemp
    if (Number(temp) >= Number(maxTemp)) {
        const tempPlusStep = Number(temp) + 5;
        const highestTempValue = Number(temperatures[temperatures.length - 1].value);

        // Ensure maxTemp is always greater than minTemp
        const newMaxTemp = Math.min(tempPlusStep, highestTempValue);

        setMaxTemp(String(newMaxTemp));
    }

      // Set the new minTemp
    setMinTemp(temp);
  };

  const verifyAndSetMaxTemp = (temp: string) => {
    if (Number(temp) <= Number(minTemp)) {
      Alert.alert('Max temperature must be greater than min temperature');
    }
    setMaxTemp(temp);
  };

  async function readNdef() {
    try {
      if (Platform.OS === 'android') {
        setModalTitle('Read Tag');
        setReadTagModalOpen(true);
      }

      await NfcManager.requestTechnology(NfcTech.Ndef);
      const tag = await NfcManager.getTag();

      if (tag?.ndefMessage) {
        const rawValue = tag.ndefMessage.map(record =>
          String.fromCharCode(...record.payload)
        );

        let jsonValue = JSON.parse(rawValue.toString());
        var nfcColor = colors.find(c => c.hex.toLowerCase() === jsonValue.color_hex.toLowerCase());
        var nfcType = types.find(t => t.value.toLowerCase() === jsonValue.type.toLowerCase());

        setColor(nfcColor?.value ?? 'blue');
        setType(nfcType?.value ?? 'pla');
        setMinTemp(jsonValue.min_temp.toString());
        setMaxTemp(jsonValue.max_temp.toString());
      } else {
        Alert.alert('Empty tag detected.');
      }
    } catch (ex) {
      console.warn('NFC read failed - could be user or system failure', ex);
    } finally {
      if (Platform.OS === 'android') {
        setReadTagModalOpen(false);
      }
      NfcManager.cancelTechnologyRequest();
    }
  }

  const writeNdef = async () => {
    if (Number(minTemp) >= Number(maxTemp)) {
      Alert.alert('Min temperature must be less than max temperature');
      return;
    }

    try {
      if (Platform.OS === 'android') {
        setModalTitle('Write To Tag');
        setReadTagModalOpen(true);
      }

      await NfcManager.requestTechnology(NfcTech.Ndef);

      const jsonData = {
        version: '1.0',
        protocol: 'openspool',
        color_hex: colors.find(c => c.value === color)?.hex,
        type: type,
        min_temp: Number(minTemp),
        max_temp: Number(maxTemp),
        brand: 'Generic',
      };
      const jsonStr = JSON.stringify(jsonData);
      const ndefRecords = Ndef.record(Ndef.TNF_MIME_MEDIA, 'application/json', '1', jsonStr);

      const bytes = await Ndef.encodeMessage([ndefRecords]);

      if (bytes) {
        await NfcManager.ndefHandler.writeNdefMessage(bytes);
      }
    } catch (error) {
      if(Platform.OS === 'android'){
        Alert.alert('Failed to write to tag. If corrupted, try again and keep tag in place for 1 full second.');
      }
      console.error('Error writing JSON:', error);
    } finally {
      if (Platform.OS === 'android') {
        setReadTagModalOpen(false);
      }
      NfcManager.cancelTechnologyRequest();
    }
  };

  const closeModalAndCancelRead = () => {
    setReadTagModalOpen(false);
    NfcManager.cancelTechnologyRequest();
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.card} overScrollMode="always">
        <Text style={styles.title}>OpenSpool</Text>

        <View style={styles.circleContainer}>
          <View style={styles.circleWrapper}>
            <View
                style={[
                  styles.circle,
                  { backgroundColor: isLoading ? '#ff0081' : `#${colors.find(c => c.value === color)?.hex}` || color },
                ]}
              />
              <Animated.Image
                source={require('./assets/openspool-transparent.png')}
                style={[
                  styles.overlayImage,
                  {
                    transform: [{ rotate: isLoading ? spin : '0deg' }],
                  },
                ]}
                resizeMode="cover"
              />
          </View>
        </View>

        <View style={styles.fieldsContainer}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Color</Text>
            <Dropdown
              style={styles.dropdown}
              containerStyle={[styles.dropdownContainer, { 
                maxHeight: 300,
                backgroundColor: '#2d2d2d', // Darker background
              }]}
              data={colors}
              labelField="label"
              valueField="value"
              placeholder="Select color"
              value={color}
              onChange={item => setColor(item.value)}
              renderItem={renderColorItem}
              placeholderStyle={styles.placeHolder}
              selectedTextStyle={[styles.selected, { color: '#ffffff' }]} // Accent color for selection
              flatListProps={{
                nestedScrollEnabled: true,
                scrollEnabled: true,
              }}
              itemContainerStyle={{
                backgroundColor: '#2d2d2d', // Match container background
              }}
              activeColor="#3d3d3d" // Slightly lighter for selection highlight
            />
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Type</Text>
            <Dropdown
              style={styles.dropdown}
              containerStyle={styles.dropdownContainer}
              data={types}
              labelField="label"
              valueField="value"
              placeholder="Select type"
              value={type}
              onChange={item => setType(item.value)}
              placeholderStyle={styles.placeHolder}
              selectedTextStyle={styles.selected}
              renderItem={(item) => (
                <Text style={[styles.colorLabel, { padding: 10 }]}>{item.label}</Text>
              )}
              activeColor="#3d3d3d" // Add highlight color
            />
          </View>

          <View style={styles.temperatureContainer}>
            <View style={[styles.fieldGroup, styles.temperatureField]}>
              <Text style={styles.label}>Min Temp</Text>
              <Dropdown
                style={styles.dropdown}
                containerStyle={styles.dropdownContainer}
                data={temperatures.slice(0, -1)}
                labelField="label"
                valueField="value"
                placeholder="Min temp"
                value={minTemp}
                onChange={item => verifyAndSetMinTemp(item.value)}
                placeholderStyle={styles.placeHolder}
                selectedTextStyle={[styles.selected, { color: '#ffffff' }]}
                renderItem={(item) => (
                  <Text style={[styles.colorLabel, { padding: 10 }]}>{item.label}</Text>
                )}
                activeColor="#3d3d3d" // Add highlight color
              />
            </View>

            <View style={[styles.fieldGroup, styles.temperatureField]}>
              <Text style={styles.label}>Max Temp</Text>
              <Dropdown
                style={styles.dropdown}
                containerStyle={styles.dropdownContainer}
                data={temperatures.filter(temp => parseInt(temp.value) > parseInt(minTemp))}
                labelField="label"
                valueField="value"
                placeholder="Max temp"
                value={maxTemp}
                onChange={item => verifyAndSetMaxTemp(item.value)}
                placeholderStyle={styles.placeHolder}
                selectedTextStyle={[styles.selected, { color: '#ffffff' }]}
                renderItem={(item) => (
                  <Text style={[styles.colorLabel, { padding: 10 }]}>{item.label}</Text>
                )}
                activeColor="#3d3d3d" // Add highlight color
              />
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={readNdef}
          >
            <Text style={styles.buttonText}>Read Tag</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={writeNdef}
          >
            <Text style={styles.buttonText}>Write Tag</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {Platform.OS === 'android' && (
        <Modal
          visible={readTagModalOpen}
          transparent={false}
          animationType={'slide'}
          onRequestClose={closeModalAndCancelRead}
          presentationStyle={'overFullScreen'}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>
                  {modalTitle}
                </Text>
                <TouchableOpacity onPress={closeModalAndCancelRead}>
                  <Text style={styles.closeButton}>✕</Text>
                </TouchableOpacity>
              </View>
              <View style={styles.androidModalContainer}>
                <Text style={styles.androidModalText}>Waiting for tag...</Text>
                <Text style={[styles.androidDurationText, styles.waitingText]}>
                  Hold Tag To Phone For 1 Second
                </Text>
                <ActivityIndicator size={'large'} color={'#ea338d'} />
              </View>
            </View>
          </View>
        </Modal>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    justifyContent: 'center',
    alignItems: 'center',
  },
  logoContainer: {
    width: 250,
    height: 250,
    justifyContent: 'center',
    alignItems: 'center',
  },
  splashLogo: {
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: '#1a1a1a',
  },
  card: {
    flex: 1,
    backgroundColor: '#2d2d2d',
    margin: 16,
    borderRadius: 12,
    padding: 20,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
    }),
  },
  title: {
    fontSize: 24,
    fontFamily: 'Orbitron-Regular',
    textAlign: 'center',
    marginBottom: 20,
    color: '#ffffff',
  },
  circleContainer: {
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  circleWrapper: {
    position: 'relative',
    width: 180,
    height: 180,
    alignItems: 'center',
    justifyContent: 'center',
  },
  overlayImage: {
    position: 'absolute',
    width: 180,
    height: 180,
    opacity: 1.0,
  },
  navigationButton: {
    padding: 12,
  },
  navigationIcon: {
    fontSize: 24,
    color: '#999',
  },
  circle: {
    width: 180,
    height: 180,
    borderRadius: 90,
    alignContent: 'center',
    backgroundColor: 'black',
    overflow: 'hidden',
    ...Platform.select({
      android: {
        elevation: 0,
      },
      ios: {
        shadowRadius: 0,
      },
    }),
  },
  fieldsContainer: {
    gap: 9,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#999',
    marginBottom: 4,
  },
  dropdown: {
    height: 40,
    borderColor: '#404040',
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: '#363636',
  },
  dropdownContainer: {
    borderRadius: 8,
    backgroundColor: '#363636',
  },
  temperatureContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 16,
  },
  temperatureField: {
    flex: 1,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    gap: 16,
  },
  button: {
    flex: 1,
    height: 48,
    borderWidth: 1,
    borderColor: '#404040',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#363636',
  },
  buttonText: {
    fontSize: 16,
    color: '#ffffff',
  },
  colorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  colorLabel: {
    fontSize: 16,
    color: '#ffffff', // White text for better contrast
    fontWeight: '600', // Added weight for better readability
  },
  colorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)', // Light border for contrast
  },
  placeHolder: {
    color: '#999',
  },
  selected: {
    color: '#ffffff',
  },
  androidModalContainer: {
    alignContent: 'center',
  },
  androidModalText: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  androidDurationText: {
    fontSize: 12,
  },
  waitingText: {
    marginVertical: 15,
    color: '#fff',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    width: '90%',
    backgroundColor: '#2d2d2d',
    borderRadius: 10,
    padding: 20,
    elevation: 5,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
  },
  closeButton: {
    fontSize: 20,
    color: '#fff',
  },
  modalSubtitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#555',
  },
  modalBody: {
    marginBottom: 20,
  },
  modalItem: {
    fontSize: 14,
    color: '#555',
    marginBottom: 8,
  },
  modalFooter: {
    alignSelf: 'flex-end',
    marginTop: 10,
    backgroundColor: '#007BFF',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  modalFooterText: {
    color: '#fff',
    fontSize: 16,
  },
  cancelButton: {
    flex: 1,
    justifyContent: 'flex-end',
    color: '#333',
  },
});

export default OpenSpool;
