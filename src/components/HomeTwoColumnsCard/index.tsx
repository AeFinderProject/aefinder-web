import clsx from 'clsx';
import CommonImage from '@/components/CommonImage';
import RowDescription from '@/components/RowDescription';
import { CSSProperties, useMemo } from 'react';
import styles from './styles.module.scss';
import { motion, Variants } from 'framer-motion';
import {
  INITIAL,
  WHILE_IN_VIEW,
  variantDownToUp,
  VIEWPORT,
  variantLeftToRight,
  variantRightToLeft,
} from '@/constants/motion';
import { GraphicTextModuleType } from '@/types/modules/graphicTextModule';
import { DescriptionComponent } from '@/types/components/description';
import { s3Url } from '@/constants/network';
import CommonButton from '../CommonButton';
import { openWithBlank } from '@/utils/router';
import { CommonButtonComponent } from '@/types/components/button';

interface ContentData extends DescriptionComponent {
  textColor?: string;
  iconWidth?: number;
  iconHeight?: number;
  iconMarginRight?: number; // icon and descriptive text gap
}

interface HomeTwoColumnsCardProps {
  readonly className?: string;
  readonly imageClassName?: string;
  readonly style?: CSSProperties;
  readonly imgPosition?: GraphicTextModuleType; // image position, must be on the right or left
  readonly imgSrc: string; // image url
  readonly titleText?: string;
  readonly title?: string;
  readonly contents: Array<ContentData>;
  readonly buttonList?: Array<CommonButtonComponent>;
}

export default function HomeTwoColumnsCard(props: HomeTwoColumnsCardProps) {
  const {
    className,
    imageClassName,
    style,
    imgSrc,
    imgPosition = GraphicTextModuleType.LeftPicture_RightText,
    titleText,
    title,
    contents,
    buttonList,
  } = props;

  const multiLayer = useMemo(() => {
    return contents.filter((item) => item.children?.length).length > 0;
  }, [contents]);

  const contentUI = (className: string, variant: (amount: number) => Variants) => {
    return (
      <div className={className}>
        <motion.div initial={INITIAL} whileInView={WHILE_IN_VIEW} viewport={VIEWPORT}>
          {titleText && (
            <motion.div variants={variantDownToUp(0)}>
              <div className={clsx(['page-container', styles.sectionTitle, styles.graphicTextModuleTitle])}>
                <div style={{ color: '#127FFF' }}>AeFinder Apps</div>
                <div>Powerful Indexer for Blockchain Data Access</div>
              </div>
            </motion.div>
          )}
          <motion.div variants={variant(0)}>
            {title ? <div className={styles.cardTitle}>{title}</div> : null}
          </motion.div>
          {contents?.map((item, idx) => {
            return (
              <motion.div key={'HomeTwoColumnsDesc' + idx} variants={variant((idx + 1) * 0.1)}>
                <RowDescription
                  multiLayer={multiLayer}
                  subContentList={item.children || []}
                  className={styles.cardContent}
                  iconSrc={item?.icon?.filename_disk ? s3Url + item?.icon?.filename_disk : ''}
                  iconWidth={item?.iconWidth}
                  iconHeight={item?.iconHeight}
                  content={item.text || ''}
                  contentColor={style?.color}
                  gap={item?.iconMarginRight}
                  isLast={idx === contents.length - 1}
                />
              </motion.div>
            );
          })}

          {Array.isArray(buttonList) && buttonList?.length > 0 && (
            <section className={styles.btnListWrap}>
              {buttonList.map((button, index) => {
                return (
                  <div className={styles.btnWrap} key={index}>
                    <motion.span variants={variant(contents.length * 0.5)}>
                      <CommonButton
                        className={styles.btn}
                        text={button.text || ''}
                        fontColor={button.commonStyles.default?.fontColor}
                        backgroundColor={button.commonStyles.default?.backgroundColor}
                        borderColor={button.commonStyles.default?.borderColor}
                        width={button.commonStyles.width ? button.commonStyles.width + 'px' : 'auto'}
                        onClick={() => openWithBlank(button.link?.url, button.link?.target)}
                      />
                    </motion.span>
                  </div>
                );
              })}
            </section>
          )}
        </motion.div>
      </div>
    );
  };

  const imgUI = () => {
    return (
      <CommonImage
        quality={100}
        src={imgSrc}
        width={500}
        height={500}
        layout="intrinsic" // TODO
        className={clsx(['flex-row-center', imageClassName])}
        alt="infoImg"
      />
    );
  };

  return (
    <div className={clsx(styles.homeTwoColsCard, className)} style={style}>
      <motion.div initial={INITIAL} whileInView={WHILE_IN_VIEW} viewport={VIEWPORT}>
        {imgPosition === GraphicTextModuleType.LeftPicture_RightText ? (
          // picture on the left
          <div className={styles.cardItem}>
            <motion.div variants={variantLeftToRight(0)}>{imgUI()}</motion.div>
            <motion.div variants={variantRightToLeft(0)}>
              {contentUI(styles.cardInfoRight, variantRightToLeft)}
            </motion.div>
          </div>
        ) : (
          // picture on the right
          <div className={clsx([styles.cardItem, styles.cardItemLeft])}>
            <motion.div variants={variantLeftToRight(0)}>
              {contentUI(styles.cardInfoLeft, variantLeftToRight)}
            </motion.div>
            <motion.div variants={variantRightToLeft(0)}>{imgUI()}</motion.div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
