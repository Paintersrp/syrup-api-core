import React from 'react';
import styles from './index.module.css';
import { Page } from '../components/Page/Page';

// @pause
// @syrup.css
const Root: React.FC = () => {
  return (
    <Page>
      <section className={styles.section_9adb43}>
        <h1 className={styles.h1_1076af}>Welcome to Syrup</h1>
        <p className={styles.p_fcf767}>
          Your one-stop solution for seamless application development.
        </p>
      </section>
      <section className={styles.section_31dbad}>
        <h2 className={styles.h2_3eae59}>Featured Products</h2>
        <div className={styles.div_c4c29f}>
          {[1, 2, 3].map((id) => (
            <div key={id} className={styles.div_53e552}>
              <img
                src={`https://via.placeholder.com/150?text=Product+${id}`}
                alt={`Product ${id}`}
                className={styles.img_427eb2}
              />
              <div className={styles.div_ba955c}>
                <h3>Product {id}</h3>
                <p>Amazing product that does XYZ...</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </Page>
  );
};

export default Root;
