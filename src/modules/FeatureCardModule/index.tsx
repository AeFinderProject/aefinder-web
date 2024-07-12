import clsx from 'clsx';
import { motion } from 'framer-motion';
// import FeatureCard from '@/components/FeatureCard';
import { INITIAL, variantDownToUp, VIEWPORT, WHILE_IN_VIEW } from '@/constants/motion';
import { IFeatureCardModule } from '@/types/modules/featureCardModule';
import useGetVertical from '@/hooks/useGetVertical';
import styles from './styles.module.scss';
import { Row, Col } from 'antd';
import Image from 'next/image';
import Link from 'next/link';
interface FeatureCardModuleProps {
  readonly module: IFeatureCardModule;
}

export default function FeatureCardModule({ module: { title, subTitle, commonStyles } }: FeatureCardModuleProps) {
  const { getVertical } = useGetVertical();
  const { defaultBackgroundColor } = commonStyles || {};
  return (
    <motion.div initial={INITIAL} whileInView={WHILE_IN_VIEW} viewport={VIEWPORT}>
      <section
        className={clsx(['section-container', 'flex-column-center', styles.featureCardModuleWrapper])}
        style={{
          paddingTop: getVertical(commonStyles || {}).top + 'px',
          paddingBottom: getVertical(commonStyles || {}).bottom + 'px',
          backgroundColor: defaultBackgroundColor,
        }}>
        <div className={clsx(['flex-column-center'], styles.featureCardModuleContentWrapper)}>
          {(!!title?.text || !!subTitle?.text) && (
            <motion.div variants={variantDownToUp(0)}>
              <div className={clsx('flex-column-center', styles.sectionTitleWrapper)}>
                {!!title?.text && <div className={styles.sectionTitle}>{title.text}</div>}
                {!!subTitle?.text && <div className={styles.sectionSubTitle}>{subTitle.text}</div>}
              </div>
            </motion.div>
          )}
          <div className={styles.cardWrapperBox}>
            <Row gutter={24} className={styles.cardRow}>
              <Col md={24} lg={8} className={styles.cardCol}>
                <div className={styles.featureTileBox}>
                  <div className={styles.step}>Step 1</div>
                  <div className={styles.featureTile}>Set Up Your AeFinder App</div>
                  <div className={styles.featureDes}>
                    Customize the AeFinder App to meet your specific data requirements.
                  </div>
                </div>
                <Image src="/img/step1.png" alt="step1" width={205} height={190} priority />
                <Link href="https://aefinder.io/login" className={styles.arrowBox}>
                  Get started now
                  <Image src="/img/arrow-right.svg" alt="arrow" width={22} height={22} priority />
                </Link>
              </Col>
              <Col md={24} lg={8} className={styles.cardCol}>
                <div className={styles.featureTileBox}>
                  <div className={styles.step}>Step 2</div>
                  <div className={styles.featureTile}>Query Data</div>
                  <div className={styles.featureDes}>
                    Use GraphQL queries to retrieve the required blockchain data for your dApps in AeFinder App.
                  </div>
                </div>
                <Image src="/img/step2.png" alt="step2" width={193} height={190} priority />
                <Link href="https://aefinder.io/dashboard" className={styles.arrowBox}>
                  View the playground
                  <Image src="/img/arrow-right.svg" alt="arrow" width={22} height={22} priority />
                </Link>
              </Col>
              <Col md={24} lg={8} className={styles.cardCol}>
                <div className={styles.featureTileBox}>
                  <div className={styles.step}>Step 3</div>
                  <div className={styles.featureTile}>Integrate</div>
                  <div className={styles.featureDes}>Integrate the retrieved data into your dApp.</div>
                </div>
                <Image src="/img/step3.png" alt="step3" width={373} height={190} priority />
                <Link href="https://aelfscan.io" className={styles.arrowBox}>
                  View the dApp
                  <Image src="/img/arrow-right.svg" alt="arrow" width={22} height={22} priority />
                </Link>
              </Col>
            </Row>
          </div>
          {/* {!!featureList?.length && (
            <motion.div variants={variantDownToUp(1)}>
              <div className={styles.sectionCardWrapper}>
                {featureList?.map((item, idx) => {
                  return (
                    <FeatureCard
                      key={'FeatureCard_' + idx}
                      className={styles.card}
                      style={{
                        backgroundColor: commonStyles?.defaultCardBackgroundColor,
                      }}
                      item={item}
                    />
                  );
                })}
              </div>
            </motion.div>
          )} */}
        </div>
      </section>
    </motion.div>
  );
}
