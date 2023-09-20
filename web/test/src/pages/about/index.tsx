import React from 'react';
import { Page } from '../../components/Page/Page';
import styles from './About.module.css';

const About: React.FC = () => {
  return (
    <Page>
      <section className={styles.introSection}>
        <h1>About Us</h1>
        <p>We started with a mission to simplify application development. Here's our story.</p>
      </section>
      <section className={styles.missionSection}>
        <h2>Mission</h2>
        <p>
          Our mission is to make the development process as smooth as syrup. Whether you're a
          seasoned veteran or just starting out, we're here to make your life easier.
        </p>
      </section>
      <section className={styles.teamSection}>
        <h2>Meet the Team</h2>
        <div className={styles.teamMembers}>
          {['Alice', 'Bob', 'Charlie'].map((name, index) => (
            <div className={styles.teamMember} key={index}>
              <img src={`https://via.placeholder.com/100?text=${name}`} alt={name} />
              <h3>{name}</h3>
              <p>Software Engineer</p>
            </div>
          ))}
        </div>
      </section>
    </Page>
  );
};

export default About;
