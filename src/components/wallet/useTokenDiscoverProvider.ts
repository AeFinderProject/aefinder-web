import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import { IPortkeyProvider, MethodsWallet } from '@portkey/provider-types';

export default function useDiscoverProvider() {
  const { walletInfo } = useConnectWallet();
  const discoverProvider = async () => {
    const provider: IPortkeyProvider | null = walletInfo?.extraInfo?.provider;
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
    signInfo: string
  ) => {
    const provider = await discoverProvider();
    if (!provider || !provider?.request)
      throw new Error('Discover not connected');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const isSupportManagerSignature = (provider as any).methodCheck(
      'wallet_getManagerSignature'
    );
    const signature = await provider.request({
      // method: MethodsWallet.GET_WALLET_SIGNATURE,
      method: isSupportManagerSignature
        ? 'wallet_getManagerSignature'
        : MethodsWallet.GET_WALLET_SIGNATURE,
      payload: isSupportManagerSignature ? { hexData } : { data: signInfo },
    });
    if (!signature || signature.recoveryParam == null) return {};
    const signatureStr = [
      signature.r.toString(16, 64),
      signature.s.toString(16, 64),
      `0${signature.recoveryParam.toString()}`,
    ].join('');

    return { signatureStr };
  };

  return { discoverProvider, getSignatureAndPublicKey };
}
