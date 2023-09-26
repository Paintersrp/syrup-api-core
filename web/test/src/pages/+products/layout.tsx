import React from 'react';
import FakeNavbar from '../../components/Test';

const ProductLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <React.Fragment>
      <FakeNavbar text="/products Layout (Nesting: Root Layout)" />
      {children}
    </React.Fragment>
  );
};

export default ProductLayout;
