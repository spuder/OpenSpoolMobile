import { Ndef } from 'react-native-nfc-manager';
import React from 'react';
import { StyleSheet } from 'react-native';
import { writeNdef } from '../helpers/nfcHelper';
import { DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';

function CustomDrawerContent(props: any) {
    async function writeAppTag() {
        const bytes = Ndef.encodeMessage([
            Ndef.uriRecord('bambulab://'),
        ]);
        await writeNdef(bytes);
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
