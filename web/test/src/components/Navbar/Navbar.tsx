import React from 'react';
// import { Link } from 'react-router-dom';
import styles from './Navbar.module.css';
import { getLinks } from '../../utils/getLinks';
import { NavLink } from '../../utils/types';
import { Link } from '../../core/router/components/Link';

export const Navbar: React.FC = () => {
  const links = getLinks();

  const renderLink = (link: NavLink) => (
    <div key={link.path} className={styles.linkItem}>
      <Link to={link.path}>{link.label}</Link>
      {link.children && link.children.length > 0 && (
        <i className="fa fa-chevron-down" style={{ marginLeft: 8 }}></i>
      )}
      {link.children && <div className={styles.submenu}>{link.children.map(renderLink)}</div>}
    </div>
  );

  return (
    <div className={styles.navbar}>
      <div className={styles.logo}>
        <Link to="/">
          <i className="fa-solid fa-bacon fa-spin" style={{ marginRight: 8 }}></i>
          Syrup (Root Layout)
        </Link>
      </div>
      <div className={styles.links}>{links.map(renderLink)}</div>
      {/* <div className={styles.extras}>
         <i className={`fa fa-user ${styles.icon}`}></i>
        <i className={`fa fa-bell ${styles.icon}`}></i>
      </div> */}
    </div>
  );
};

export default Navbar;
