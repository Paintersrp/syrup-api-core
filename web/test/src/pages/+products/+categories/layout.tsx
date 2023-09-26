import React from 'react';
import FakeNavbar from '../../../components/Test';

const CategoriesLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <React.Fragment>
      <FakeNavbar text="/products/categories Layout (Nesting: Root and Products Layouts)" />
      {children}
    </React.Fragment>
  );
};

export default CategoriesLayout;
