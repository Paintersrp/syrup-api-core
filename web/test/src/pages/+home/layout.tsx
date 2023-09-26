import React from 'react';
import FakeNavbar from '../../components/Test';

const HomeLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <React.Fragment>
      <FakeNavbar text="Home Specific Layout" />
      {children}
    </React.Fragment>
  );
};

export default HomeLayout;
