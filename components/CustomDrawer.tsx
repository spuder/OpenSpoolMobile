import { Ndef } from 'react-native-nfc-manager';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { writeNdef } from '../helpers/nfcHelper';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useTagModal } from '../contexts/TagModal';

function CustomDrawerContent(props: any) {
    const { showModal: setTagModalOpen, hideModal: setTagModalClosed } = useTagModal();

    async function writeAppTag() {
        if (Platform.OS === 'android') {
            setTagModalOpen();
            props.navigation.closeDrawer();

        }

        let records = [
            Ndef.uriRecord('bambulab://'),
            Ndef.androidApplicationRecord('bbl.intl.bambulab.com'),
        ];

        let bytes = Ndef.encodeMessage(records);

        if (bytes !== null) {
            await writeNdef(bytes);
        }

        if (Platform.OS === 'android') {
            setTagModalClosed();
        }
    }

    return (
        <DrawerContentScrollView {...props}>
            <DrawerItem
                label="Create Bambu App Tag"
                labelStyle={styles.navigationLabel}
                onPress={writeAppTag}
            />
        </DrawerContentScrollView>
    );
}

const styles = StyleSheet.create({
    navigationLabel: {
        color: 'white',
        borderColor: 'white',
        borderBottomWidth: 1,
        padding: 10,
    },
});

export { CustomDrawerContent };
