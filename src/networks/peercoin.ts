import { Network } from 'bitcoinjs-lib';

export const peercoinMainnet: Network = {
    messagePrefix: '\x18Peercoin Signed Message:\n',
    bech32: 'pcrt1',
    bip32: {
        public: 0x0488b21e,
        private: 0x0488ade4,
    },
    pubKeyHash: 0x37,
    scriptHash: 0x75,
    wif: 0xb0,
};

export const peercoinTestnet: Network = {
    messagePrefix: '\x18Peercoin Signed Message:\n',
    bech32: null,
    bip32: {
        public: 0x043587cf,
        private: 0x04358394,
    },
    pubKeyHash: 0x6f, // m/n address
    scriptHash: 0xc4,
    wif: 0xef,
};