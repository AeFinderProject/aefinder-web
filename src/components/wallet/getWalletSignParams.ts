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
    walletInfo,
    walletType,
    getSignature,
    disConnectWallet,
    isConnected,
  } = useConnectWallet();
  const { getSignatureAndPublicKey } = useDiscoverProvider();

  const getReqParams: () => Promise<null | QueryWalletAuthExtra> = async () => {
    console.log('isConnected', isConnected);
    console.log('walletInfo', walletInfo);
    if (!isConnected || !walletInfo) return null;
    const timestamp = Date.now();
    const plainTextOrigin = `${walletInfo?.address}-${timestamp}`;
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
        isConnected && disConnectWallet();
        return null;
      }
    } else {
      const sign = await getSignature({
        appName: 'aefinder-web',
        address: walletInfo?.address,
        signInfo:
          walletType === WalletTypeEnum.aa
            ? Buffer.from(`${walletInfo?.address}-${timestamp}`).toString('hex')
            : AElf.utils.sha256(plainTextOrigin),
      });
      if (sign?.errorMessage) {
        message.error(sign?.errorMessage);
        isConnected && disConnectWallet();
        return null;
      }
      signature = sign?.signature ?? '';
    }

    // ------------ request api ---------
    const { caHash, originChainId } = await getCaHashAndOriginChainIdByWallet(
      walletInfo,
      walletType
    );
    const reqParams = {
      timestamp,
      signature,
      chain_id: originChainId,
      address: walletInfo?.address,
    } as QueryWalletAuthExtra;

    if (caHash) {
      reqParams.ca_hash = caHash;
    }

    return reqParams;
  };

  return { getReqParams };
};
