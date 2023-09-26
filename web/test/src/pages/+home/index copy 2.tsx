// syrup.css
import React from 'react';
import { Page } from '../../components/Page/Page';

const Home: React.FC = () => {
  return (
    <Page>
      <section
        style={{
          textAlign: 'center',
          backgroundColor: '#1f2937',
          color: '#ffffff',
          padding: '50px 0',
          borderRadius: 8,
        }}
      >
        <h1 style={{ fontSize: '2.5rem', marginBottom: '1rem' }}>Welcome to Syrup</h1>
        <p style={{ color: 'purple' }}>
          Your one-stop solution for seamless application development.
        </p>
      </section>
      <section style={{ padding: '20px' }}>
        <h2 style={{ color: '#ffffff', fontSize: '1.8rem', marginBottom: '1rem' }}>
          Featured Products
        </h2>
        <div
          style={{ display: 'flex', flexWrap: 'wrap', gap: '20px', justifyContent: 'space-evenly' }}
        >
          {[1, 2, 3].map((id) => (
            <div
              key={id}
              style={{
                flex: '1 1 calc(33.333% - 20px)',
                backgroundColor: '#1f2937',
                color: '#ffffff',
                border: '1px solid #2e3a4d',
                borderRadius: '5px',
                padding: '15px',
                margin: '10px',
              }}
            >
              <img
                src={`https://via.placeholder.com/150?text=Product+${id}`}
                alt={`Product ${id}`}
                style={{
                  backgroundColor: '#2e3a4d',
                  height: '150px',
                  borderRadius: '3px',
                  width: 'auto',
                }}
              />
              <div style={{ padding: '10px' }}>
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
