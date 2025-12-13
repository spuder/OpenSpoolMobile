import { Alert, Platform } from 'react-native';
import NfcManager, { NfcTech } from 'react-native-nfc-manager';

const writeNdef = async (bytes: number[]) => {
    try {
        await NfcManager.requestTechnology(NfcTech.Ndef);

        if (bytes) {
            await NfcManager.ndefHandler.writeNdefMessage(bytes);
        }
    } catch (error) {
        if (Platform.OS === 'android') {
            Alert.alert('Failed to write to tag.', 'If corrupted, try again and keep tag in place for 1 full second.');
        }
        console.error('Error writing JSON:', error);
    } finally {
        NfcManager.cancelTechnologyRequest();
    }
};

async function readNdef(): Promise<any | null> {
    try {
        console.log('Starting NFC Read');
        await NfcManager.requestTechnology(NfcTech.Ndef);
        const tag = await NfcManager.getTag();

        if (tag?.ndefMessage) {
            const rawValue = tag.ndefMessage.map(record =>
                String.fromCharCode(...record.payload)
            );

            let jsonValue = JSON.parse(rawValue.toString());
            return jsonValue;
        } else {
            Alert.alert('Empty tag detected.');
        }
    } catch (ex) {
        console.warn('NFC read failed - could be user or system failure', ex);
    }
    finally{
        NfcManager.cancelTechnologyRequest();
    }
    return null;
}

const checkNfcSupportedAndEnabled = async () => {
    const isNfcSupported = await NfcManager.isSupported();
    if (!isNfcSupported) {
        Alert.alert('NFC is not supported on this device.');
        return false;
    }

    const isNfcEnabled = await NfcManager.isEnabled();
    if (!isNfcEnabled) {
        Alert.alert('NFC is disabled. Please enable it in your device settings.');
        return false;
    }

    return true;
};


export { writeNdef, readNdef, checkNfcSupportedAndEnabled};
