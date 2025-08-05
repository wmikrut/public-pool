import { Network } from 'bitcoinjs-lib';

export const digibyteMainnet: Network = {
    messagePrefix: '\x18DigiByte Signed Message:\n',
    bech32: 'dgb', // Native SegWit Bech32 prefix
    bip32: {
        public: 0x0488b21e, // same as Bitcoin
        private: 0x0488ade4,
    },
    pubKeyHash: 0x1e, // starts with 'D'
    scriptHash: 0x3f, // starts with 'S'
    wif: 0x80,
};

export const digibyteTestnet: Network = {
    messagePrefix: '\x18DigiByte Signed Message:\n',
    bech32: 'dgbt',
    bip32: {
        public: 0x043587cf, // same as Bitcoin testnet
        private: 0x04358394,
    },
    pubKeyHash: 0x7f, // starts with 't'
    scriptHash: 0x8c,
    wif: 0xef,
};
