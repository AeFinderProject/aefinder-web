import {
  TWalletInfo,
  WalletTypeEnum,
} from '@aelf-web-login/wallet-adapter-base';
import { useConnectWallet } from '@aelf-web-login/wallet-adapter-react';
import AElf from 'aelf-sdk';
import { message } from 'antd';

import { QueryWalletAuthExtra } from '@/api/apiUtils';

import useDiscoverProvider from './useTokenDiscoverProvider';
import { getCaHashAndOriginChainIdByWallet } from './wallet';

const hexDataCopywriter = `Welcome to AeFinder! Click to sign in to the AeFinder platform! This request will not trigger any blockchain transaction or cost any gas fees.

signature: `;

interface GetReqParamsProps {
  walletInfoRef: TWalletInfo;
  walletTypeRef: WalletTypeEnum;
  isConnectedRef: boolean;
}

export const useGetWalletSignParams = () => {
  const { getSignature, disConnectWallet } = useConnectWallet();
  const { getSignatureAndPublicKey } = useDiscoverProvider();

  const getReqParams = async ({
    walletInfoRef,
    walletTypeRef,
    isConnectedRef,
  }: GetReqParamsProps): Promise<null | QueryWalletAuthExtra> => {
    if (!walletInfoRef || !walletTypeRef) return null;

    const timestamp = Date.now();
    const plainTextOrigin = `${walletInfoRef?.address}-${timestamp}`;
    const signInfo = AElf.utils.sha256(plainTextOrigin);
    const discoverSignHex = Buffer.from(
      hexDataCopywriter + plainTextOrigin
    ).toString('hex');

    let signature = '';

    // -------------- get signature --------------
    if (walletTypeRef === WalletTypeEnum.discover) {
      try {
        const { signatureStr } = await getSignatureAndPublicKey(
          discoverSignHex,
          signInfo,
          walletInfoRef
        );
        signature = signatureStr ?? '';
      } catch (error) {
        console.log(error);
        isConnectedRef && disConnectWallet();
        return null;
      }
    } else {
      const sign = await getSignature({
        appName: 'aefinder-web',
        address: walletInfoRef?.address,
        signInfo:
          walletTypeRef === WalletTypeEnum.aa
            ? Buffer.from(`${walletInfoRef?.address}-${timestamp}`).toString(
                'hex'
              )
            : AElf.utils.sha256(plainTextOrigin),
      });
      if (sign?.errorMessage) {
        message.error(sign?.errorMessage);
        isConnectedRef && disConnectWallet();
        return null;
      }
      signature = sign?.signature ?? '';
    }

    // ------------ request api ---------
    const { caHash, originChainId } = await getCaHashAndOriginChainIdByWallet(
      walletInfoRef,
      walletTypeRef
    );
    const reqParams = {
      timestamp,
      signature,
      chain_id: originChainId,
      address: walletInfoRef?.address,
    } as QueryWalletAuthExtra;

    if (caHash) {
      reqParams.ca_hash = caHash;
    }

    return reqParams;
  };

  return { getReqParams };
};
