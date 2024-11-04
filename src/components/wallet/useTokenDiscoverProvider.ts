import { TWalletInfo } from '@aelf-web-login/wallet-adapter-base';
import { IPortkeyProvider, MethodsWallet } from '@portkey/provider-types';
import AElf from 'aelf-sdk';
import elliptic from 'elliptic';

import { zeroFill } from '@/lib/utils';

const ec = new elliptic.ec('secp256k1');

interface ProviderWithMethodCheck extends IPortkeyProvider {
  methodCheck: (method: string) => unknown;
}

export default function useDiscoverProvider() {
  const discoverProvider = async ({
    walletInfoRef,
  }: {
    walletInfoRef: TWalletInfo;
  }) => {
    const provider: IPortkeyProvider | null =
      walletInfoRef?.extraInfo?.provider;
    if (provider) {
      if (!provider.isPortkey) {
        throw new Error('Discover provider found, but check isPortkey failed');
      }
      return provider;
    } else {
      return null;
    }
  };

  const getSignatureAndPublicKey = async (
    hexData: string,
    signInfo: string,
    walletInfoRef: TWalletInfo
  ) => {
    const provider = await discoverProvider({ walletInfoRef });
    if (!provider?.request) {
      throw new Error('Discover not connected');
    }

    const providerWithMethodCheck = provider as ProviderWithMethodCheck;
    const isSupportManagerSignature = providerWithMethodCheck.methodCheck(
      'wallet_getManagerSignature'
    );
    const signature = await provider.request({
      // method: MethodsWallet.GET_WALLET_SIGNATURE,
      method: isSupportManagerSignature
        ? 'wallet_getManagerSignature'
        : MethodsWallet.GET_WALLET_SIGNATURE,
      payload: isSupportManagerSignature ? { hexData } : { data: signInfo },
    });
    if (signature?.recoveryParam == null) return {};
    const signatureR = zeroFill(signature.r);
    const signatureS = zeroFill(signature.s);
    const signatureRE = `0${signature.recoveryParam.toString()}`;
    const signatureStr = `${signatureR}${signatureS}${signatureRE}`;

    // recover pubkey by signature
    let publicKey;
    if (isSupportManagerSignature) {
      publicKey = ec.recoverPubKey(
        Buffer.from(AElf.utils.sha256(hexData), 'hex'),
        signature,
        signature.recoveryParam
      );
    } else {
      publicKey = ec.recoverPubKey(
        Buffer.from(signInfo.slice(0, 64), 'hex'),
        signature,
        signature.recoveryParam
      );
    }
    const pubKey = ec.keyFromPublic(publicKey).getPublic('hex');

    return { pubKey, signatureStr };
  };

  return { discoverProvider, getSignatureAndPublicKey };
}
