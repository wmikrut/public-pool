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
