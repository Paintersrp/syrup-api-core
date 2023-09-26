import React from 'react';

import { useParams } from 'react-router-dom';
import { Page } from '../../../../components/Page/Page';

const Product: React.FC = () => {
  const { name } = useParams<{ name: string }>();

  return <Page>Name: {name}</Page>;
};

export default Product;
