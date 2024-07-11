import clsx from 'clsx';
import HomeTwoColumnsCard from '@/components/HomeTwoColumnsCard';
import styles from './styles.module.scss';
import { motion } from 'framer-motion';
import { INITIAL, VIEWPORT, WHILE_IN_VIEW } from '@/constants/motion';
import { GraphicTextModuleType, IGraphicTextModule } from '@/types/modules/graphicTextModule';
import { s3Url } from '@/constants/network';
import useGetVertical from '@/hooks/useGetVertical';
import TopPicture from '../TopPicture';
import { Row, Col, Divider } from 'antd';
import Image from 'next/image';

export interface GraphicTextModuleProps {
  readonly module: IGraphicTextModule;
}

export default function GraphicTextModule({ module }: GraphicTextModuleProps) {
  const { getVertical } = useGetVertical();
  const { defaultBackgroundColor } = module.commonStyles;
  if (module.type === GraphicTextModuleType.TopPicture_BottomText) {
    return <TopPicture module={module} />;
  }

  return (
    <section className="section-container">
      <div className={styles.imgWrapper}>
        <Row gutter={24} className={clsx([styles.graphicTextModule, styles.imgBox])}>
          <Col md={24} lg={8} style={{ textAlign: 'center', marginBottom: '60px' }}>
            <Image src="/img/asset1.png" alt="Fast Indexing" width={200} height={200} />
            <div className={styles.sectionTitleCol}>Fast Indexing</div>
            <div className={styles.sectionSubTitleCol}>
              With AeFinder is advanced indexing infrastructure, data is efficiently retrieved from blockchain and
              delivered to dApps.
            </div>
          </Col>
          <Col md={24} lg={8} style={{ textAlign: 'center', marginBottom: '60px' }}>
            <Image src="/img/asset2.png" alt="Minimal Costs" width={200} height={200} />
            <div className={styles.sectionTitleCol}>Minimal Costs</div>
            <div className={styles.sectionSubTitleCol}>
              AeFinder offers cost-effective data indexing and querying, priced solely on data volume, saving you over
              90% compared to maintaining your own server.
            </div>
          </Col>
          <Col md={24} lg={8} style={{ textAlign: 'center', marginBottom: '60px' }}>
            <Image src="/img/asset3.png" alt="Robust Performance" width={200} height={200} />
            <div className={styles.sectionTitleCol}>Robust Performance</div>
            <div className={styles.sectionSubTitleCol}>
              AeFinder ensures a reliable indexing experience with over 99.99% uptime, designed to meet the demands of
              data-intensive dApps.
            </div>
          </Col>
        </Row>
      </div>
      <Divider className={styles.divider} />
      <motion.div initial={INITIAL} whileInView={WHILE_IN_VIEW} viewport={VIEWPORT}>
        <section
          className={clsx(['section-container', 'flex-row-center', styles.graphicTextModule])}
          style={{
            backgroundColor: defaultBackgroundColor,
            paddingTop: getVertical(module.commonStyles).top + 'px',
            paddingBottom: getVertical(module.commonStyles).bottom + 'px',
            color: module.commonStyles?.fontColor,
          }}>
          <HomeTwoColumnsCard
            className={styles.graphicTextModuleItem}
            style={{ color: module.commonStyles?.fontColor }}
            imgSrc={module.image?.filename_disk ? s3Url + module.image?.filename_disk : ''}
            imgPosition={module.type}
            titleText={module.title?.text}
            title={module.subTitle?.text}
            contents={module.descriptionList || []}
            imageClassName={styles.image}
            buttonList={module.buttonList}
          />
        </section>
      </motion.div>
    </section>
  );
}
