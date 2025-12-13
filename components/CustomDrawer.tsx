import { Ndef } from 'react-native-nfc-manager';
import React from 'react';
import { Platform, StyleSheet } from 'react-native';
import { writeNdef } from '../helpers/nfcHelper';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import { useTagModal } from '../contexts/TagModal';

function CustomDrawerContent(props: any) {
    const { showModal: setTagModalOpen, hideModal: setTagModalClosed } = useTagModal();

    async function writeAppTag() {
        let bytes: number[] | null = null;
        if (Platform.OS === 'ios') {
            bytes = Ndef.encodeMessage([
                Ndef.uriRecord('bambulab://'),
            ]);
        }
        else if (Platform.OS === 'android') {
            setTagModalOpen();
            props.navigation.closeDrawer();

            const ndefRecords = Ndef.record(Ndef.TNF_MIME_MEDIA, 'text', '1', 'bbl.intl.bambulab.com');

            bytes = Ndef.encodeMessage([
                ndefRecords,
            ]);
        }

        if (bytes !== null) {
            await writeNdef(bytes);
        }

        if(Platform.OS === 'android'){
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
