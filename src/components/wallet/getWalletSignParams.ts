import { WalletTypeEnum } from '@aelf-web-login/wallet-adapter-base';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import AElf from 'aelf-sdk';
import { message } from 'antd';

import { QueryWalletAuthExtra } from '@/api/apiUtils';

import useDiscoverProvider from './useTokenDiscoverProvider';
import { getCaHashAndOriginChainIdByWallet } from './wallet';

const hexDataCopywriter = `Welcome to AeFinder! Click to sign in to the AeFinder platform! This request will not trigger any blockchain transaction or cost any gas fees.

signature: `;

export const useGetWalletSignParams = () => {
  const {
    walletInfo: wallet,
    walletType,
    getSignature,
    disConnectWallet,
    isConnected,
  } = useConnectWallet();
  const { getSignatureAndPublicKey } = useDiscoverProvider();

  const isConnectWallet = isConnected;

  const getReqParams: () => Promise<null | QueryWalletAuthExtra> = async () => {
    if (!isConnected || !wallet) return null;

    const timestamp = Date.now();
    const plainTextOrigin = `${wallet?.address}-${timestamp}`;
    const signInfo = AElf.utils.sha256(plainTextOrigin);
    const discoverSignHex = Buffer.from(
      hexDataCopywriter + plainTextOrigin
    ).toString('hex');

    let signature = '';

    // -------------- get signature --------------
    if (walletType === WalletTypeEnum.discover) {
      try {
        const { signatureStr } = await getSignatureAndPublicKey(
          discoverSignHex,
          signInfo
        );
        signature = signatureStr || '';
      } catch (error) {
        console.log(error);
        isConnectWallet && disConnectWallet();
        return null;
      }
    } else {
      const sign = await getSignature({
        appName: 'aefinder-web',
        address: wallet?.address,
        signInfo:
          walletType === WalletTypeEnum.aa
            ? Buffer.from(`${wallet?.address}-${timestamp}`).toString('hex')
            : AElf.utils.sha256(plainTextOrigin),
      });
      if (sign?.errorMessage) {
        message.error(sign?.errorMessage);
        isConnectWallet && disConnectWallet();
        return null;
      }
      signature = sign?.signature ?? '';
    }

    // ------------ request api ---------
    const { caHash, originChainId } = await getCaHashAndOriginChainIdByWallet(
      wallet,
      walletType
    );
    const reqParams = {
      timestamp,
      signature,
      chain_id: originChainId,
      address: wallet?.address,
    } as QueryWalletAuthExtra;

    if (caHash) {
      reqParams.ca_hash = caHash;
    }

    return reqParams;
  };

  return { getReqParams };
};
