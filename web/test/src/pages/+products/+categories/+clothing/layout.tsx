import React from 'react';
import FakeNavbar from '../../../../components/Test';

const ClothingLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <React.Fragment>
      <FakeNavbar text="/product/categories/clothing Layout (Nesting: Root, Products, and Categories Layouts)" />
      {children}
    </React.Fragment>
  );
};

export default ClothingLayout;
