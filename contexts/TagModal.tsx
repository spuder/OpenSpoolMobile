import React, { createContext, useState, useContext } from 'react';
import { StyleSheet } from 'react-native';
import { ActivityIndicator, Modal, Text, TouchableOpacity, View } from 'react-native';
import NfcManager from 'react-native-nfc-manager';

const TagModalContext = createContext({
    isVisible: false,
    showModal: () => {},
    hideModal: () => {},
    setTitle: (title: string) => {},
});

export function TagModalProvider({ children }: { children: React.ReactNode }) {
    const [isVisible, setIsVisible] = useState(false);
    const [modalTitle, setModalTitle] = useState('Ready For Tag');

    const showModal = () => setIsVisible(true);
    const hideModal = () => setIsVisible(false);
    const setTitle = (title: string) => setModalTitle(title);

    const closeModalAndCancelRead = () => {
        hideModal();
        NfcManager.cancelTechnologyRequest();
    };

    return (
        <TagModalContext.Provider value={{ isVisible, showModal, hideModal, setTitle }}>
            {children}

            <Modal
                visible={isVisible}
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

        </TagModalContext.Provider>
    );
}

const styles = StyleSheet.create({
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
});

export const useTagModal = () => useContext(TagModalContext);
