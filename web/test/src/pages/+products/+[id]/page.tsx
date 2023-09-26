import React from 'react';
import { Page } from '../../../components/Page/Page';
import { useParams } from '../../../core/router/params/useParams';

const Product: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return <Page>Product: {id}</Page>;
};

export default Product;
