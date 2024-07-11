import { get } from '@/api/axios';
import { API } from '@/api/constants';
import { s3Url } from '@/constants/network';
import { ButtonComponent, ButtonKey, CommonButtonComponent } from '@/types/components/button';
import { DescriptionComponent } from '@/types/components/description';
import { GlobalModuleType } from '@/types/global';
import { GlobalConfig } from '@/types/global';
import { Footer } from '@/types/global/footer';
import { Header } from '@/types/global/header';
import { Module, ModuleType } from '@/types/modules';
import { handleErrorMessage } from '@/utils';
import { IAPIDescriptionItem } from './types';
import { DappPage } from '@/types/pages';
import { IPartnerItem } from '@/types/modules/partnersModule';
import { IFeatureCardItem } from '@/types/modules/featureCardModule';
import { IInfiniteScrollCarouselItem } from '@/types/modules/infiniteScrollCarouselModule';

export const getGlobalConfig = async (): Promise<GlobalConfig> => {
  try {
    const { data } = await get(API.GET.GLOBAL_CONFIG);
    return {
      meta: {
        favicon: data.metaFavicon?.filename_disk ? s3Url + data.metaFavicon?.filename_disk : '',
        title: data.metaTitle,
        description: data.metaDescription,
        keywords: data.metaKeywords,
      },
      themeColor: {
        brand: data.themeColorBrand,
        hover: data.themeColorHover,
        normal: data.themeColorNormal,
        click: data.themeColorClick,
        disable: data.themeColorDisable,
      },
      functionalColor: {
        link: data.functionalColorLink,
        linkBg: data.functionalColorLinkBg,
        success: data.functionalColorSuccess,
        successBg: data.functionalColorSuccessBg,
        warning: data.functionalColorWarning,
        warningBg: data.functionalColorWarningBg,
        error: data.functionalColorError,
        errorBg: data.functionalColorErrorBg,
      },
      neutralColor: {
        primaryText: data.neutralColorPrimaryText,
        secondaryText: data.neutralColorSecondaryText,
        disableText: data.neutralColorDisableText,
        whiteText: data.neutralColorWhiteText,
        border: data.neutralColorBorder,
        dash: data.neutralColorDash,
        dividers: data.neutralColorDividers,
        normalBg: data.neutralColorNormalBg,
        hoverBg: data.neutralColorHoverBg,
        clickBg: data.neutralColorClickBg,
        pageBg: data.neutralColorPageBg,
        maskBg: data.neutralColorMaskBg,
      },
    };
  } catch (error) {
    throw Error(handleErrorMessage(error));
  }
};

export const getHeader = async (): Promise<Header> => {
  try {
    const { data } = await get(API.GET.HEADER);
    const menuList = (data.menuList || []).map((item: any) => ({
      ...item.topMenu_id,
    }));

    return {
      key: GlobalModuleType.Header,
      type: data.type,
      logo: data.defaultLogo,
      menuList,
      actionButton: data.actionButton ? formatCommonButton(data.actionButton) : undefined,
      commonStyles: {
        defaultBackgroundColor: data.defaultBackgroundColor || undefined,
        firstMenuDefaultFontColor: data.firstMenuDefaultFontColor || undefined,
        firstMenuFontHoverColor: data.firstMenuFontHoverColor || undefined,
      },
    };
  } catch (error) {
    throw Error(handleErrorMessage(error));
  }
};

export const getFooter = async (): Promise<Footer> => {
  try {
    const { data } = await get(API.GET.FOOTER);
    const menuList = (data.menuList || []).map((item: any) => ({
      ...item.bottomMenu_id,
    }));
    const socialMediaList = (data.socialMediaList || []).map((item: any) => ({
      ...item.socialMedia_id,
    }));

    return {
      key: GlobalModuleType.Footer,
      powerName: {
        text: data.powerNameText,
      },
      logo: data.defaultLogo,
      description: data.description || undefined,
      menuList,
      socialMediaList,
      commonStyles: {
        defaultBackgroundColor: data.defaultBackgroundColor || undefined,
        dividingLineColor: data.dividingLineColor || undefined,
        secondMenuDefaultFontColor: data.secondMenuDefaultFontColor || undefined,
        secondMenuFontHoverColor: data.secondMenuFontHoverColor || undefined,
      },
    };
  } catch (error) {
    throw Error(handleErrorMessage(error));
  }
};

export const getPage = async (key: string): Promise<DappPage | undefined> => {
  try {
    const { data } = await get(API.GET.PAGE);
    const pageData = data.find(
      (item: any) => item?.status === 'published' && item.key?.toLowerCase() === key?.toLowerCase(),
    );
    if (!pageData) return undefined;
    const moduleList = formatModuleList(pageData.moduleList || []);
    return {
      ...pageData,
      moduleList,
    };
  } catch (error) {
    throw Error(handleErrorMessage(error));
  }
};

export const formatModuleList = (moduleList = []): Module[] => {
  return (moduleList.map((moduleItem: any) => formatModule(moduleItem.item)).filter((item) => !!item) as Module[]).sort(
    (a, b) => a.index - b.index,
  );
};

const formatModule = (moduleItem: any): Module | undefined => {
  if (moduleItem?.status !== 'published') return undefined;
  switch (moduleItem.key) {
    case ModuleType.BrandModule:
      return {
        key: ModuleType.BrandModule,
        index: moduleItem.index,
        title: {
          text: moduleItem.title,
        },
        image: moduleItem.image,
        backgroundImage: moduleItem.backgroundImage,
        type: moduleItem.type,
        buttonList: formatButtonList(moduleItem.buttonList),
        descriptionList: formatDescriptionList(moduleItem.descriptionList),
        commonStyles: {
          paddingTop: moduleItem.paddingTop || undefined,
          paddingBottom: moduleItem.paddingBottom || undefined,
          mobilePaddingTop: moduleItem.mobilePaddingTop || undefined,
          mobilePaddingBottom: moduleItem.mobilePaddingBottom || undefined,
          defaultBackgroundColor: moduleItem.defaultBackgroundColor || undefined,
        },
      };
    case ModuleType.GraphicTextModule:
      return {
        key: ModuleType.GraphicTextModule,
        index: moduleItem.index,
        image: moduleItem.image,
        title: {
          text: moduleItem.title,
          subText: moduleItem.titleDescription,
        },
        subTitle: {
          text: moduleItem.subTitle,
        },
        descriptionList: formatDescriptionList(moduleItem.descriptionList),
        buttonList: formatButtonList(moduleItem.buttonList) as CommonButtonComponent[],
        type: moduleItem.type,
        commonStyles: {
          paddingTop: moduleItem.paddingTop || undefined,
          paddingBottom: moduleItem.paddingBottom || undefined,
          mobilePaddingTop: moduleItem.mobilePaddingTop || undefined,
          mobilePaddingBottom: moduleItem.mobilePaddingBottom || undefined,
          defaultBackgroundColor: moduleItem.defaultBackgroundColor || undefined,
          fontColor: moduleItem.fontColor || '',
        },
      };
    case ModuleType.CardListModule:
      return {
        key: ModuleType.CardListModule,
        index: moduleItem.index,
        title: {
          text: moduleItem.title,
        },
        subTitle: {
          text: moduleItem.subTitle,
        },
        dataArray: formatDescriptionList(moduleItem.dataArray),
        commonStyles: {
          paddingTop: moduleItem.paddingTop || undefined,
          paddingBottom: moduleItem.paddingBottom || undefined,
          mobilePaddingTop: moduleItem.mobilePaddingTop || undefined,
          mobilePaddingBottom: moduleItem.mobilePaddingBottom || undefined,
          defaultBackgroundColor: moduleItem.defaultBackgroundColor || undefined,
          defaultCardBackgroundColor: moduleItem.defaultCardBackgroundColor || undefined,
          defaultImgContainerBackgroundColor: moduleItem.defaultImgContainerBackgroundColor || undefined,
        },
      };
    case ModuleType.PartnersModule:
      return {
        key: ModuleType.PartnersModule,
        index: moduleItem.index,
        title: {
          text: moduleItem.title,
        },
        list: formatPartnerList(moduleItem.list),
        commonStyles: {
          paddingTop: moduleItem.paddingTop || undefined,
          paddingBottom: moduleItem.paddingBottom || undefined,
          mobilePaddingTop: moduleItem.mobilePaddingTop || undefined,
          mobilePaddingBottom: moduleItem.mobilePaddingBottom || undefined,
          defaultBackgroundColor: moduleItem.defaultBackgroundColor || undefined,
          defaultCardBackgroundColor: moduleItem.defaultCardBackgroundColor || undefined,
        },
      };
    case ModuleType.ButtonBelowTextModule:
      return {
        key: ModuleType.ButtonBelowTextModule,
        index: moduleItem.index,
        title: {
          text: moduleItem.title,
        },
        descriptionList: formatDescriptionList(moduleItem.descriptionList),
        buttonList: formatButtonList(moduleItem.buttonList),
        commonStyles: {
          paddingTop: moduleItem.paddingTop || undefined,
          paddingBottom: moduleItem.paddingBottom || undefined,
          mobilePaddingTop: moduleItem.mobilePaddingTop || undefined,
          mobilePaddingBottom: moduleItem.mobilePaddingBottom || undefined,
          defaultBackgroundColor: moduleItem.defaultBackgroundColor || undefined,
        },
      };
    case ModuleType.FeatureCardModule:
      return {
        key: ModuleType.FeatureCardModule,
        index: moduleItem.index,
        title: moduleItem.title
          ? {
              text: moduleItem.title,
            }
          : undefined,
        subTitle: moduleItem.subTitle
          ? {
              text: moduleItem.subTitle,
            }
          : undefined,
        featureList: formatFeatureList(moduleItem.featureList),
        commonStyles: {
          paddingTop: moduleItem.paddingTop || undefined,
          paddingBottom: moduleItem.paddingBottom || undefined,
          mobilePaddingTop: moduleItem.mobilePaddingTop || undefined,
          mobilePaddingBottom: moduleItem.mobilePaddingBottom || undefined,
          defaultBackgroundColor: moduleItem.defaultBackgroundColor || undefined,
          defaultCardBackgroundColor: moduleItem.defaultCardBackgroundColor || undefined,
        },
      };
    case ModuleType.InfiniteScrollCarouselModule:
      return {
        key: ModuleType.InfiniteScrollCarouselModule,
        index: moduleItem.index,
        title: moduleItem.title
          ? {
              text: moduleItem.title,
            }
          : undefined,
        carouselList: formatCarouselList(moduleItem.carouselList),
        commonStyles: {
          paddingTop: moduleItem.paddingTop || undefined,
          paddingBottom: moduleItem.paddingBottom || undefined,
          mobilePaddingTop: moduleItem.mobilePaddingTop || undefined,
          mobilePaddingBottom: moduleItem.mobilePaddingBottom || undefined,
          defaultBackgroundColor: moduleItem.defaultBackgroundColor || undefined,
        },
      };
    default:
      return undefined;
  }
};

const formatDescriptionList = (
  descriptionList: IAPIDescriptionItem[] | DescriptionComponent[] = [],
): DescriptionComponent[] => {
  return descriptionList
    .map((descriptionItem) => {
      const item = 'description_id' in descriptionItem ? descriptionItem.description_id : descriptionItem;
      return {
        index: item.index,
        text: item.text,
        subText: item.subText,
        icon: item.icon || undefined,
        children: formatDescriptionList(item.children),
      };
    })
    .sort((a: any, b: any) => a.index - b.index);
};

const formatButtonList = (buttonList = []) => {
  return (
    buttonList
      .map((buttonItem: any) =>
        formatButton({
          ...(buttonItem.item || buttonItem.button_id),
        }),
      )
      .filter((item) => !!item) as ButtonComponent[]
  ).sort((a, b) => a.index - b.index);
};

const formatCommonButton = (data: any): CommonButtonComponent | undefined => {
  return {
    key: ButtonKey.Common,
    index: data.index,
    type: data.type,
    link: {
      url: data.linkUrl,
      target: data.linkTarget,
    },
    text: data.text || undefined,
    commonStyles: {
      width: data.width || undefined,
      default: {
        backgroundColor: data.defaultBackgroundColor || undefined,
        fontColor: data.defaultFontColor || undefined,
        borderColor: data.defaultBorderColor || undefined,
      },
    },
  };
};

const formatButton = (data: any): ButtonComponent | undefined => {
  switch (data.key) {
    case ButtonKey.Common:
      return formatCommonButton(data);
    case ButtonKey.DownloadApp:
      return {
        key: ButtonKey.DownloadApp,
        index: data.index,
        type: data.type,
        androidUrl: data.androidUrl || undefined,
        iOSUrl: data.iOSUrl || undefined,
        extensionUrl: data.extensionUrl || undefined,
        otherUrl: data.otherUrl || undefined,
      };
    default:
      return undefined;
  }
};

const formatPartnerList = (partnerList: any[] = []): IPartnerItem[] => {
  return partnerList
    .map<IPartnerItem>(({ partner_id: item }) => ({
      index: item.index,
      logoImage: item.logoImage,
      url: item.url || undefined,
    }))
    .sort((a, b) => a.index - b.index);
};

const formatFeatureList = (featureList: any[] = []): IFeatureCardItem[] => {
  return featureList
    .map<IFeatureCardItem>((item: any) => ({
      index: item.index,
      iconNormal: item.iconNormal,
      iconHover: item.iconHover,
      title: item.title,
      content: item.content,
    }))
    .sort((a, b) => a.index - b.index);
};

const formatCarouselList = (featureList: any[] = []): IInfiniteScrollCarouselItem[] => {
  return featureList
    .map<IInfiniteScrollCarouselItem>((item: any) => ({
      index: item.index,
      name: item.name,
      logo: item.logo,
    }))
    .sort((a, b) => a.index - b.index);
};
