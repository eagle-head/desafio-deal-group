import styles from './Header.module.css';

/**
 * Application header component displaying the game title
 * 
 * Renders the main header with the Tic Tac Toe game title using
 * CSS modules for styling. Provides consistent branding across
 * the application interface.
 * 
 * @returns {JSX.Element} Header element with game title
 * 
 * @example
 * <Header />
 */
export default function Header() {
  return (
    <header className={styles.header}>
      <h1 className={styles.title}>Tic Tac Toe</h1>
    </header>
  );
}
