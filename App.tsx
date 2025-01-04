import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { Dropdown } from 'react-native-element-dropdown';

const OpenSpool = () => {
  const [color, setColor] = useState('pink');
  const [type, setType] = useState('pla');
  const [minTemp, setMinTemp] = useState('180');
  const [maxTemp, setMaxTemp] = useState('210');

  const colors = [
    { label: 'Pink', value: 'pink', hex: '#ea338d' },
    { label: 'Black', value: 'black', hex: '#000000' },
    { label: 'White', value: 'white', hex: '#FFFFFF' },
    { label: 'Yellow', value: 'yellow', hex: '#FFEB3B' },
    { label: 'Red', value: 'red', hex: '#F44336' },
    { label: 'Blue', value: 'blue', hex: '#2196F3' },
    { label: 'Green', value: 'green', hex: '#4CAF50' },
  ];

  const types = [
    { label: 'PLA', value: 'pla' },
    { label: 'PETG', value: 'petg' },
    { label: 'ABS', value: 'abs' },
    { label: 'TPU', value: 'tpu' },
    { label: 'Nylon', value: 'nylon' },
  ];

  const temperatures = Array.from({ length: 11 }, (_, i) => ({
    label: `${180 + i * 5}°C`,
    value: (180 + i * 5).toString()
  }));

  const handleReadTag = () => {
    console.log('Reading NFC tag...');
  };

  const handleWriteTag = () => {
    console.log('Writing to NFC tag...');
  };

  const renderColorItem = (item) => {
    return (
      <View style={styles.colorItem}>
        <View style={[styles.colorSwatch, { backgroundColor: item.hex }]} />
        <Text style={styles.colorLabel}>{item.label}</Text>
      </View>
    );
  };


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.title}>OpenSpool</Text>

        <View style={styles.circleContainer}>
          <View style={[styles.circle, {
            backgroundColor: colors.find(c => c.value === color)?.hex || color
          }]} />
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
              placeholderStyle={{ color: '#999' }}
              selectedTextStyle={{ color: '#ffffff' }}
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
              placeholderStyle={{ color: '#999' }}
              selectedTextStyle={{ color: '#ffffff' }}
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
                onChange={item => setMinTemp(item.value)}
                placeholderStyle={{ color: '#999' }}
                selectedTextStyle={{ color: '#ffffff' }}
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
                onChange={item => setMaxTemp(item.value)}
                placeholderStyle={{ color: '#999' }}
                selectedTextStyle={{ color: '#ffffff' }}
              />
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={handleReadTag}
          >
            <Text style={styles.buttonText}>Read Tag</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={handleWriteTag}
          >
            <Text style={styles.buttonText}>Write Tag</Text>
          </TouchableOpacity>
        </View>
      </View>
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
      android: {
        elevation: 5,
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
  navigationButton: {
    padding: 12,
  },
  navigationIcon: {
    fontSize: 24,
    color: '#999', // Lighter grey for navigation icons
  },
  circle: {
    width: 140,
    height: 140,
    borderRadius: 70, // Exactly half of width/height
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
    color: '#ffffff', // White text for color labels

  },
  colorSwatch: {
    width: 24,
    height: 24,
    borderRadius: 12, // Exactly half of width/height for perfect circle[3]
    marginRight: 10,
    borderWidth: 1,
    borderColor: 'transparent',
  },
});

export default OpenSpool;
