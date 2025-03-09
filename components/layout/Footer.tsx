import Link from "next/link";

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer__container">
        <div className="footer__copyright">
          © {currentYear} Michał Zeprzałka. Wszystkie prawa zastrzeżone.
        </div>
        <div className="footer__links">
          <Link href="/polityka-prywatnosci" className="footer__link">
            Polityka prywatności
          </Link>
          <Link href="/kontakt" className="footer__link">
            Kontakt
          </Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
