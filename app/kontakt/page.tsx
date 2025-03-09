import Link from "next/link";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kontakt - Michał Zeprzałka",
  description:
    "Skontaktuj się ze mną w sprawie współpracy, konsultacji lub projektów.",
};

export default function ContactPage() {
  return (
    <main className="contact-page">
      <div className="contact-page__container">
        <header className="contact-page__header">
          <h1 className="contact-page__title">Kontakt</h1>
          <p className="contact-page__description">
            Masz pytanie, propozycję współpracy lub po prostu chcesz się
            przywitać? Skorzystaj z formularza kontaktowego lub odezwij się
            bezpośrednio.
          </p>
        </header>

        <div className="contact-page__content">
          <div className="contact-page__info">
            <h2 className="contact-page__info-title">Informacje kontaktowe</h2>
            <p className="contact-page__info-text">
              Chętnie odpowiem na Twoje pytania i porozmawiam o potencjalnej
              współpracy. Możesz skontaktować się ze mną przez formularz lub
              bezpośrednio.
            </p>

            <div className="contact-page__contact-details">
              <div className="contact-page__contact-item">
                <span className="contact-page__contact-icon">✉️</span>
                <span>kontakt@zeprzalka.pl</span>
              </div>
              <div className="contact-page__contact-item">
                <span className="contact-page__contact-icon">📱</span>
                <span>+48 XXX XXX XXX</span>
              </div>
              <div className="contact-page__contact-item">
                <span className="contact-page__contact-icon">📍</span>
                <span>Warszawa, Polska</span>
              </div>
            </div>

            <div className="contact-page__social">
              <h3 className="contact-page__social-title">
                Media społecznościowe
              </h3>
              <div className="contact-page__social-links">
                <Link
                  href="https://linkedin.com/"
                  target="_blank"
                  className="contact-page__social-link"
                >
                  in
                </Link>
                <Link
                  href="https://twitter.com/"
                  target="_blank"
                  className="contact-page__social-link"
                >
                  𝕏
                </Link>
                <Link
                  href="https://facebook.com/"
                  target="_blank"
                  className="contact-page__social-link"
                >
                  f
                </Link>
              </div>
            </div>
          </div>

          <div className="contact-page__form">
            <h2 className="contact-page__form-title">Wyślij wiadomość</h2>
            <form>
              <div className="contact-page__form-group">
                <label htmlFor="name" className="contact-page__label">
                  Imię i nazwisko
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="contact-page__input"
                  required
                />
              </div>

              <div className="contact-page__form-group">
                <label htmlFor="email" className="contact-page__label">
                  Adres email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="contact-page__input"
                  required
                />
              </div>

              <div className="contact-page__form-group">
                <label htmlFor="subject" className="contact-page__label">
                  Temat
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="contact-page__input"
                  required
                />
              </div>

              <div className="contact-page__form-group">
                <label htmlFor="message" className="contact-page__label">
                  Treść wiadomości
                </label>
                <textarea
                  id="message"
                  name="message"
                  className="contact-page__textarea"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                className="button button--primary contact-page__submit"
              >
                Wyślij wiadomość
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}
