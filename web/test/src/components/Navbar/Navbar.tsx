import React from 'react';
import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';

interface NavbarProps {}

export const Navbar: React.FC<NavbarProps> = () => {
  return (
    <div className={styles.navbar}>
      <div className={styles.logo}>My App</div>
      <div className={styles.links}>
        <Link className={styles.link} to="/app/users">
          Users
        </Link>
        <Link className={styles.link} to="/app/profiles">
          Profiles
        </Link>
      </div>
      <div className={styles.extras}></div>
    </div>
  );
};
