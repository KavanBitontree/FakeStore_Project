import { useMemo } from "react";
import "./Footer.scss";

const Footer = () => {
  const currentYear = useMemo(() => new Date().getFullYear(), []);

  const footerLinks = useMemo(
    () => ({
      company: [
        { name: "About Us", href: "#about" },
        { name: "Careers", href: "#careers" },
        { name: "Contact", href: "#contact" },
      ],
      resources: [
        { name: "Blog", href: "#blog" },
        { name: "Help Center", href: "#help" },
        { name: "FAQ", href: "#faq" },
      ],
      legal: [
        { name: "Privacy Policy", href: "#privacy" },
        { name: "Terms of Service", href: "#terms" },
        { name: "Cookie Policy", href: "#cookies" },
      ],
    }),
    []
  );

  return (
    <footer className="footer">
      <div className="footer__container">
        {/* Logo & Description with vintage box */}
        <div className="footer__brand">
          <div className="footer__brand-box">
            <h2 className="footer__logo">FakeStore</h2>
            <p className="footer__description">
              Your trusted store to explore, compare, and buy products.
            </p>
          </div>
        </div>

        {/* Links Columns */}
        <div className="footer__links">
          <div className="footer__column">
            <h3 className="footer__title">Company</h3>
            <ul className="footer__list">
              {footerLinks.company.map((link) => (
                <li key={link.name}>
                  <a href={link.href}>{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__column">
            <h3 className="footer__title">Resources</h3>
            <ul className="footer__list">
              {footerLinks.resources.map((link) => (
                <li key={link.name}>
                  <a href={link.href}>{link.name}</a>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__column">
            <h3 className="footer__title">Legal</h3>
            <ul className="footer__list">
              {footerLinks.legal.map((link) => (
                <li key={link.name}>
                  <a href={link.href}>{link.name}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar with vintage line */}
      <div className="footer__bottom">
        <div className="footer__divider"></div>
        <p>&copy; {currentYear} FakeStore. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
