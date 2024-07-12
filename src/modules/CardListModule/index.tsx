import { ICardListModule } from '@/types/modules/cardListModule';
import styles from './style.module.scss';
// import CommonImage from '@/components/CommonImage';
// import { s3Url } from '@/constants/network';
import clsx from 'clsx';
import useGetVertical from '@/hooks/useGetVertical';
import { Row, Col } from 'antd';
import Image from 'next/image';
export interface ICardListModuleProps {
  moduleData: ICardListModule;
}

export default function CardListModule({ moduleData }: ICardListModuleProps) {
  const { title, subTitle, commonStyles } = moduleData;
  const { getVertical } = useGetVertical();

  // const cardList = (
  //   <section className={styles.cardList}>
  //     {dataArray?.map((item, index) => {
  //       return (
  //         <section
  //           key={index + `${item?.icon?.filename_disk}`}
  //           className={styles.cardItem}
  //           style={{
  //             backgroundColor: commonStyles.defaultCardBackgroundColor,
  //           }}>
  //           {item.text && (
  //             <section className={styles.cardDesc}>
  //               <h2 className={styles.cardItemTitle}>{item.text}</h2>
  //               <h3 className={styles.cardItemSubTitle}>{item.subText}</h3>
  //             </section>
  //           )}
  //           <section
  //             key={index + `${item?.icon?.filename_disk}`}
  //             style={{ backgroundColor: commonStyles.defaultImgContainerBackgroundColor }}
  //             className={styles.cardImgContainer}>
  //             <CommonImage
  //               quality={100}
  //               width={0}
  //               height={0}
  //               src={item.icon?.filename_disk ? s3Url + item?.icon.filename_disk : ''}
  //               className={styles.cardImg}
  //               alt="cardImage"
  //               priority
  //               style={{ width: '100%', height: 'auto' }}
  //             />
  //           </section>
  //         </section>
  //       );
  //     })}
  //   </section>
  // );

  const cardList = (
    <div>
      <Row gutter={23}>
        <Col md={24} lg={10} className={styles.cardItemCol}>
          <div className={styles.cardItemBox}>
            <div className={styles.cardTitleColBox}>
              <div className={styles.cardTitleCol}>Efficient Indexing on the aelf Network</div>
              <div className={styles.cardDescriptionCol}>
                Index and retrieve blockchain data effortlessly and cost-effectively with AeFinder.
              </div>
            </div>
            <Image
              quality={100}
              width={612}
              height={341}
              src="/img/frame1.png"
              className={styles.cardImgCol}
              alt="cardImage"
            />
          </div>
        </Col>
        <Col md={24} lg={14} className={styles.cardItemCol}>
          <div className={styles.cardItemBox}>
            <div className={styles.cardTitleColBox}>
              <div className={styles.cardTitleCol}>Seamless Integration</div>
              <div className={styles.cardDescriptionCol}>
                AeFinder index blockchain data seamlessly and enhances data accessibility, enabling dApps efficiently
                access and retrieve various types of blockchain data, including transactions, addresses, smart
                contracts, and other on-chain info.
              </div>
            </div>
            <Image
              quality={100}
              width={334}
              height={263}
              src="/img/frame2.png"
              className={clsx(styles.cardImgCol, styles.frame3Img)}
              alt="cardImage"
            />
            <Image
              quality={100}
              width={204}
              height={553}
              src="/img/frame3.png"
              className={styles.cardImgCol}
              alt="cardImage"
            />
          </div>
        </Col>
        <Col md={24} lg={14} className={styles.cardItemCol}>
          <div className={styles.cardItemBox}>
            <div className={styles.cardTitleColBox}>
              <div className={styles.cardTitleCol}>Streamline Processes</div>
              <div className={styles.cardDescriptionCol}>
                With AeFinder, there is no need for manual node deployment, indexing infrastructure or complex setup.
                Developers can easily specify required data and integrate it into their projects with minimal effort.
              </div>
            </div>
            <Image
              quality={100}
              width={522}
              height={270}
              src="/img/frame4.png"
              className={clsx(styles.cardImgCol, styles.frame4Img)}
              alt="cardImage"
            />
          </div>
        </Col>
        <Col md={24} lg={10} className={styles.cardItemCol}>
          <div className={styles.cardItemBox}>
            <div className={styles.cardTitleColBox}>
              <div className={styles.cardTitleCol}>Comprehensive Developer Support</div>
              <div className={styles.cardDescriptionCol}>
                AeFinder offers detailed documentation and support to ensure a smooth development experience, from
                account registration to data query implementation.
              </div>
            </div>
            <Image
              quality={100}
              width={329}
              height={329}
              src="/img/frame5.png"
              className={styles.cardImgCol}
              alt="cardImage"
              style={{ margin: '0 auto' }}
            />
          </div>
        </Col>
      </Row>
    </div>
  );

  return (
    <section
      className={clsx(['section-container', styles.cardListModuleWrap])}
      style={{
        backgroundColor: commonStyles.defaultBackgroundColor,
        paddingTop: getVertical(commonStyles).top + 'px',
        paddingBottom: getVertical(commonStyles).bottom + 'px',
      }}>
      <section className={styles.cardListModule}>
        {title?.text && <h1 className={styles.title}>{title?.text}</h1>}
        {subTitle?.text && <h3 className={styles.subTitle}>{subTitle?.text}</h3>}
        {cardList}
      </section>
    </section>
  );
}
