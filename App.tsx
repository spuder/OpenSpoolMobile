import React, { useState, useEffect } from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
  Pressable,
  Modal,
} from 'react-native';

const filamentTypes = ['PLA', 'PETG', 'ABS', 'TPU', 'Nylon'];
const filamentBrands = ['Generic', 'Prusament', 'Overture', 'Hatchbox', 'eSUN'];

function Dropdown({ title, options, selected, onSelect }: {
  title: string;
  options: string[];
  selected: string;
  onSelect: (value: string) => void;
}): React.JSX.Element {
  const [modalVisible, setModalVisible] = useState(false);
  const isDarkMode = useColorScheme() === 'dark';

  return (
    <View style={styles.dropdownContainer}>
      <Text style={[styles.dropdownLabel, { color: isDarkMode ? '#fff' : '#000' }]}>{title}</Text>
      <Pressable
        style={[styles.dropdown, { backgroundColor: isDarkMode ? '#333' : '#eee' }]}
        onPress={() => setModalVisible(true)}>
        <Text style={[styles.selectedText, { color: isDarkMode ? '#fff' : '#000' }]}>
          {selected}
        </Text>
      </Pressable>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContent, { backgroundColor: isDarkMode ? '#222' : '#fff' }]}>
            <Text style={[styles.modalTitle, { color: isDarkMode ? '#fff' : '#000' }]}>{title}</Text>
            {options.map((option) => (
              <Pressable
                key={option}
                style={styles.option}
                onPress={() => {
                  onSelect(option);
                  setModalVisible(false);
                }}>
                <Text style={[styles.optionText, { color: isDarkMode ? '#fff' : '#000' }]}>
                  {option}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
}

function App(): React.JSX.Element {
  const [filamentType, setFilamentType] = useState(filamentTypes[0]);
  const [filamentBrand, setFilamentBrand] = useState(filamentBrands[0]);
  const [jsonOutput, setJsonOutput] = useState('');
  const isDarkMode = useColorScheme() === 'dark';

  useEffect(() => {
    const output = {
      protocol: "OpenSpool",
      version: "1.0",
      brand: filamentBrand,
      type: filamentType
    };
    setJsonOutput(JSON.stringify(output, null, 2));
  }, [filamentType, filamentBrand]);

  const backgroundStyle = {
    backgroundColor: isDarkMode ? '#000' : '#fff',
    flex: 1,
  };

  return (
    <SafeAreaView style={backgroundStyle}>
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={backgroundStyle.backgroundColor}
      />
      <ScrollView contentInsetAdjustmentBehavior="automatic" style={styles.container}>
        <View style={styles.header}>
          <Text style={[styles.title, { color: isDarkMode ? '#fff' : '#000' }]}>
            Filament Settings
          </Text>
        </View>
        <View style={styles.content}>
          <Dropdown
            title="Filament Type"
            options={filamentTypes}
            selected={filamentType}
            onSelect={setFilamentType}
          />
          <Dropdown
            title="Filament Brand"
            options={filamentBrands}
            selected={filamentBrand}
            onSelect={setFilamentBrand}
          />
          <View style={[styles.jsonContainer, { backgroundColor: isDarkMode ? '#333' : '#f5f5f5' }]}>
            <Text style={[styles.jsonTitle, { color: isDarkMode ? '#fff' : '#000' }]}>
              Generated JSON
            </Text>
            <Text style={[styles.jsonOutput, { color: isDarkMode ? '#fff' : '#000' }]}>
              {jsonOutput}
            </Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  dropdownContainer: {
    marginBottom: 20,
  },
  dropdownLabel: {
    fontSize: 16,
    marginBottom: 8,
    fontWeight: '500',
  },
  dropdown: {
    padding: 15,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedText: {
    fontSize: 16,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
  },
  option: {
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  optionText: {
    fontSize: 16,
  },
  jsonContainer: {
    marginTop: 20,
    padding: 15,
    borderRadius: 8,
  },
  jsonTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 10,
  },
  jsonOutput: {
    fontFamily: 'monospace',
    fontSize: 14,
  },
});

export default App;