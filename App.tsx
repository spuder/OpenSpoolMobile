import React, { useState } from 'react';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  Alert,
  Image,
  Modal,
  ActivityIndicator,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';
import NfcManager, { NfcTech, Ndef } from 'react-native-nfc-manager';

const OpenSpool = () => {
  const [color, setColor] = useState('pink');
  const [type, setType] = useState('pla');
  const [minTemp, setMinTemp] = useState('180');
  const [maxTemp, setMaxTemp] = useState('210');
  const [modalTitle, setModalTitle] = useState('Read Tag');
  const [readTagModalOpen, setReadTagModalOpen] = useState(false);

  const colors = [
    { label: 'Pink', value: 'pink', hex: 'ea338d' },
    { label: 'Black', value: 'black', hex: '000000' },
    { label: 'White', value: 'white', hex: 'ffffff' },
    { label: 'Yellow', value: 'yellow', hex: 'FFEB3B' },
    { label: 'Red', value: 'red', hex: 'f95d73' },
    { label: 'Blue', value: 'blue', hex: '2196F3' },
    { label: 'Green', value: 'green', hex: '4CAF50' },
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
    if (Number(temp) >= Number(maxTemp)) {
      Alert.alert('Min temperature must be less than max temperature');
    }
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

      // register for the NFC tag with NDEF in it
      await NfcManager.requestTechnology(NfcTech.Ndef);

      // Extract NDEF message (if present)
      const tag = await NfcManager.getTag();

      // Extract NDEF message (if present)
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
        Alert.alert('No NDEF message found on the tag.');
      }
    } catch (ex) {
      console.warn('NFC read failed - could be user or system failure', ex);
    } finally {
      if (Platform.OS === 'android') {
        setReadTagModalOpen(false);
      }

      // stop the nfc scanning
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

      //requires an array, but makes it a single once it's passed in
      const bytes = await Ndef.encodeMessage([ndefRecords]);

      if (bytes) {
        await NfcManager.ndefHandler
          .writeNdefMessage(bytes);
      }
    } catch (error) {
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
                { backgroundColor: `#${colors.find(c => c.value === color)?.hex}` || color }
              ]} 
            />
            <Image
              source={require('./assets/openspool-transparent.png')}
              style={styles.overlayImage}
              resizeMode="cover"
            />
          </View>
        </View>

        <View style={styles.fieldsContainer}>
          <View style={styles.fieldGroup}>
            <Text style={styles.label}>Color</Text>
            <Dropdown
              style={styles.dropdown}
              containerStyle={styles.dropdownContainer}
              data={colors}
              labelField="label"
              valueField="value"
              placeholder="Select color"
              value={color}
              onChange={item => setColor(item.value)}
              renderItem={renderColorItem}
              placeholderStyle={styles.placeHolder}
              selectedTextStyle={styles.selected}
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
            />
          </View>

          <View style={styles.temperatureContainer}>
            <View style={[styles.fieldGroup, styles.temperatureField]}>
              <Text style={styles.label}>Min Temp</Text>
              <Dropdown
                style={styles.dropdown}
                containerStyle={styles.dropdownContainer}
                data={temperatures.slice(0, -3)}
                labelField="label"
                valueField="value"
                placeholder="Min temp"
                value={minTemp}
                onChange={item => verifyAndSetMinTemp(item.value)}
                placeholderStyle={styles.placeHolder}
                selectedTextStyle={styles.selected}
              />
            </View>

            <View style={[styles.fieldGroup, styles.temperatureField]}>
              <Text style={styles.label}>Max Temp</Text>
              <Dropdown
                style={styles.dropdown}
                containerStyle={styles.dropdownContainer}
                data={temperatures.slice(3)}
                labelField="label"
                valueField="value"
                placeholder="Max temp"
                value={maxTemp}
                onChange={item => verifyAndSetMaxTemp(item.value)}
                placeholderStyle={styles.placeHolder}
                selectedTextStyle={styles.selected}
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

      {(Platform.OS === 'android' ?
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
                <Text style={[styles.androidDurationText, styles.waitingText]}>Hold Tag To Phone For 1 Second</Text>
                <ActivityIndicator size={'large'} color={'#ea338d'} />
              </View>
            </View>
          </View>
        </Modal>
        : null
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    // fontWeight: '600',
    textAlign: 'center',
    marginBottom: 20,
    color: '#ffffff', // White text

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
  // circle: {
  //   position: 'absolute',
  //   width: 180,
  //   height: 180,
  //   borderRadius: 90,
  //   backgroundColor: 'black',
  // },
  overlayImage: {
    position: 'absolute',
    width: 250,
    height: 260,
    opacity: 1.0, // Adjust this value to control the overlay intensity
  },
  navigationButton: {
    padding: 12,
  },
  navigationIcon: {
    fontSize: 24,
    color: '#999', // Lighter grey for navigation icons
  },
  circle: {
    width: 180,
    height: 180,
    borderRadius: 90, // Exactly half of width/height
    alignContent: 'center',
    backgroundColor: 'black',
    overflow: 'hidden', // This helps with some rendering artifacts[5]
    ...Platform.select({
      android: {
        elevation: 0, // Remove elevation on Android to prevent jagged edges[10]
      },
      ios: {
        shadowRadius: 0, // Remove shadow to prevent artifacts
      },
    }),
  },

  fieldsContainer: {
    gap: 16,
  },
  fieldGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    color: '#999', // Lighter grey for labels
    marginBottom: 8,
  },
  dropdown: {
    height: 48,
    borderColor: '#404040', // Darker border
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 8,
    backgroundColor: '#363636', // Dark dropdown background

  },
  dropdownContainer: {
    borderRadius: 8,
    backgroundColor: '#363636', // Dark dropdown container

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
    borderColor: '#404040', // Darker border
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#363636', // Dark button background

  },
  buttonText: {
    fontSize: 16,
    color: '#ffffff', // White text
  },

  colorItem: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
  },
  colorLabel: {
    fontSize: 16,

  },
  colorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12, // Exactly half of width/height for perfect circle[3]
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'transparent',
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
