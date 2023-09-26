import React from 'react';
import FakeNavbar from '../../../../../components/Test';

const ElectronicsLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <React.Fragment>
      <FakeNavbar text="/products/categories/clothing/electronics Layout (Nesting: Root, Products, Categories, and Clothing Layouts)" />
      {children}
    </React.Fragment>
  );
};

export default ElectronicsLayout;
