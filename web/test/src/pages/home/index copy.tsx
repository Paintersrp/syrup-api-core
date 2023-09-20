import React from 'react';
import { css } from '@emotion/react';
import { Page } from '../../components/Page/Page';
const styles = {
  heroSection: css({
    textAlign: 'center',
    backgroundColor: '#1f2937',
    color: '#ffffff',
    padding: '50px 0',
    borderRadius: 8,
  }),
  heroTitle: css({
    fontSize: '2.5rem',
    marginBottom: '1rem',
  }),
  sectionTitle: css({
    color: '#ffffff',
    fontSize: '1.8rem',
    marginBottom: '1rem',
  }),
  featured: css({
    padding: '20px',
  }),
  cardContainer: css({
    display: 'flex',
    flexWrap: 'wrap',
    gap: '20px',
    justifyContent: 'space-evenly',
  }),
  card: css({
    flex: '1 1 calc(33.333% - 20px)',
    backgroundColor: '#1f2937',
    color: '#ffffff',
    border: '1px solid #2e3a4d',
    borderRadius: '5px',
    padding: '15px',
    margin: '10px',
  }),
  cardImage: css({
    backgroundColor: '#2e3a4d',
    height: '150px',
    borderRadius: '3px',
    width: 'auto',
  }),
  cardContent: css({
    padding: '10px',
  }),
};
const Home: React.FC = () => {
  return (
    <Page>
      <section css={styles.heroSection} style={{ color: 'red' }}>
        <h1 css={styles.heroTitle} style={{ color: 'green' }}>
          Welcome to Syrup
        </h1>
        <p style={{ color: 'purple' }}>
          Your one-stop solution for seamless application development.
        </p>
      </section>
      <section css={styles.featured} style={{ background: 'orange' }}>
        <h2 css={styles.sectionTitle} style={{ background: 'red', color: 'black' }}>
          Featured Products
        </h2>
        <div css={styles.cardContainer}>
          {[1, 2, 3].map((id) => (
            <div css={styles.card} key={id}>
              <img
                src={`https://via.placeholder.com/150?text=Product+${id}`}
                alt={`Product ${id}`}
                css={styles.cardImage}
              />
              <div css={styles.cardContent}>
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
export default Home;
