import React from 'react';
import { Page } from '../../../../components/Page/Page';
import { useParams } from 'react-router-dom';

const Product: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  
  return <Page>Product: {id}</Page>;
};

export default Product;

