import React from 'react';

import styles from './Navbar/Navbar.module.css';

export const FakeNavbar: React.FC<{ text: string }> = ({ text }) => {
  return (
    <div className={styles.navbar}>
      <div className={styles.logo}>
        <i className="fa-solid fa-bacon fa-spin" style={{ marginRight: 8 }}></i>
      </div>
      <p style={{ fontSize: '1.2rem', marginLeft: 16 }}>{text}</p>

      {/* <div className={styles.extras}>
         <i className={`fa fa-user ${styles.icon}`}></i>
        <i className={`fa fa-bell ${styles.icon}`}></i>
      </div> */}
    </div>
  );
};

export default FakeNavbar;
