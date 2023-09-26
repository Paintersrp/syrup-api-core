import React from 'react';
import { Page } from '../../components/Page/Page';
import { useData } from '../../core/router/state/data/useData';

const Home: React.FC = () => {
  const { data } = useData();

  return (
    <Page>
      Home
      {Array.isArray(data) && (
        <div>
          {data.map((item, index) => (
            <div key={index}>ID: {item.id}</div>
          ))}
        </div>
      )}
    </Page>
  );
};

export default Home;
