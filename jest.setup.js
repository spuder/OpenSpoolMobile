/* eslint-env jest */
// react-native-nfc-manager needs a native module that doesn't exist under Jest
jest.mock('react-native-nfc-manager', () => ({
  __esModule: true,
  default: {
    isSupported: jest.fn(() => Promise.resolve(true)),
    isEnabled: jest.fn(() => Promise.resolve(true)),
    requestTechnology: jest.fn(() => Promise.resolve()),
    getTag: jest.fn(() => Promise.resolve(null)),
    cancelTechnologyRequest: jest.fn(() => Promise.resolve()),
    ndefHandler: {writeNdefMessage: jest.fn(() => Promise.resolve())},
    ndefFormatableHandlerAndroid: {formatNdef: jest.fn(() => Promise.resolve())},
  },
  NfcTech: {Ndef: 'Ndef', NdefFormatable: 'NdefFormatable'},
  NfcError: {UserCancel: class UserCancel extends Error {}},
  Ndef: {
    TNF_MIME_MEDIA: 0x02,
    record: jest.fn(),
    encodeMessage: jest.fn(() => []),
    util: {bytesToString: jest.fn(bytes => String(bytes))},
  },
}));
