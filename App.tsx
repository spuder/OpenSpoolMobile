import React, { useState } from 'react';
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

const filamentTypes = ['PxLA', 'PETG', 'ABS', 'TPU', 'Nylon'];
const filamentBrands = ['Prusament', 'Overture', 'Hatchbox', 'eSUN', 'Polymaker'];

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
      <Text style={styles.dropdownLabel}>{title}</Text>
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
  const isDarkMode = useColorScheme() === 'dark';

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
});

export default App;