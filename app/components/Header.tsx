'use client';

import React from 'react';
import styles from '../page.module.css';

export default function Header() {
  return (
    <header className={styles.header}>
      <nav className={styles.nav}>
        <a href="#" className={styles.homeLink}>HOME</a>
        <a href="#work">WORK</a>
        <a href="#articles">ARTICLES</a>
        <a href="#footer">CONTACT</a>
      </nav>
    </header>
  );
}
