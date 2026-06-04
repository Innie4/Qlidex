"use client";

import type { CSSProperties, FormEvent } from "react";
import { useState } from "react";
import countries, { type Country } from "world-countries";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4000";

const faqs = [
  {
    question: "What industries does Qlidex work with?",
    answer:
      "Qlidex supports ecommerce, SaaS, fintech, health, education, travel, and service businesses that need reliable customer experience operations."
  },
  {
    question: "Does Qlidex only provide customer support services?",
    answer:
      "No. The support team can also cover onboarding, retention workflows, CRM cleanup, reporting, and customer communication systems."
  },
  {
    question: "Can Qlidex manage dedicated account teams?",
    answer:
      "Yes. Dedicated teams can be assigned for brands that need consistent tone, specialized training, and deeper product knowledge."
  },
  {
    question: "Can Qlidex run multilingual support?",
    answer:
      "Yes. Coverage can be structured around the regions, languages, and time zones your customers use most."
  },
  {
    question: "Why should I choose Qlidex?",
    answer:
      "Qlidex combines trained agents, process design, and reporting so support becomes a growth system instead of a reactive inbox."
  }
];

const trustCards = [
  { title: "Forex & Prop", subtitle: "Trading", icon: "trading" },
  { title: "Crypto &", subtitle: "Web3", icon: "crypto" },
  { title: "E-commerce", subtitle: "Brands", icon: "commerce" }
];

type CountryOption = {
  code: string;
  name: string;
  dialCode: string;
};

function getDialCode(country: Country) {
  const root = country.idd?.root ?? "";
  const suffixes = country.idd?.suffixes ?? [];
  const suffix = suffixes.length === 1 ? suffixes[0] : "";
  return root ? `${root}${suffix}` : "";
}

const countryOptions: CountryOption[] = countries
  .map((country) => ({
    code: country.cca2,
    name: country.name.common,
    dialCode: getDialCode(country)
  }))
  .filter((country) => country.dialCode)
  .sort((left, right) => left.name.localeCompare(right.name));

const defaultCountryCode = countryOptions.find((country) => country.code === "US")?.code ?? countryOptions[0]?.code ?? "";

function artboardStyle(x: number, y: number, w: number, h: number): CSSProperties {
  return {
    left: `${(x / 1512) * 100}%`,
    top: `${(y / 9486) * 100}%`,
    width: `${(w / 1512) * 100}%`,
    height: `${(h / 9486) * 100}%`
  };
}

export function LandingPage() {
  const [openFaq, setOpenFaq] = useState(0);
  const [formStatus, setFormStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [selectedCountryCode, setSelectedCountryCode] = useState(defaultCountryCode);
  const [isCountryPickerOpen, setIsCountryPickerOpen] = useState(false);
  const [countrySearch, setCountrySearch] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const selectedCountry =
    countryOptions.find((country) => country.code === selectedCountryCode) ?? countryOptions[0];
  const normalizedCountrySearch = countrySearch.trim().toLowerCase();
  const filteredCountryOptions = normalizedCountrySearch
    ? countryOptions.filter((country) => {
        const searchableText = `${country.name} ${country.code} ${country.dialCode}`.toLowerCase();
        return searchableText.includes(normalizedCountrySearch);
      })
    : countryOptions;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setFormStatus("sending");

    try {
      const response = await fetch(`${API_URL}/api/contact`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          businessEmail: formData.get("businessEmail"),
          country: selectedCountry?.name,
          countryCode: selectedCountry?.dialCode,
          phoneNumber: formData.get("phoneNumber")
        })
      });

      if (!response.ok) {
        throw new Error("Unable to submit inquiry");
      }

      form.reset();
      setPhoneNumber("");
      setFormStatus("sent");
    } catch {
      setFormStatus("error");
    }
  }

  return (
    <main id="top" className="figma-page" aria-labelledby="page-title">
      <h1 id="page-title" className="sr-only">
        Qlidex customer support landing page
      </h1>
      <div className="figma-stage">
        <img
          className="figma-artboard"
          src="/assets/qlidex-figma-design.svg"
          alt="QLIDEX customer support landing page design"
        />

        <div className="prototype-layer" aria-label="Interactive prototype layer">
          <div className="art-mask header-mask" style={artboardStyle(0, 0, 1512, 150)} aria-hidden="true" />
          <header className="site-header" aria-label="Primary navigation">
            <a className="site-logo" href="#top" aria-label="Qlidex home">
              Qlidex
            </a>
            <nav className="site-nav" aria-label="Main">
              <a href="#top">Home</a>
              <a href="#about">About</a>
              <a href="#services">Services</a>
              <a href="#faq">FAQs</a>
            </nav>
            <a className="site-cta" href="#contact">
              Contact Us
            </a>
          </header>

          <a
            className="hotspot button-hotspot"
            href="#contact"
            aria-label="Start now"
            style={artboardStyle(528, 653, 202, 50)}
          />
          <a
            className="hotspot button-hotspot"
            href="#services"
            aria-label="Explore services"
            style={artboardStyle(760, 653, 188, 50)}
          />

          <section id="about" className="section-anchor" style={artboardStyle(0, 1320, 10, 10)} aria-hidden="true" />
          <section id="services" className="section-anchor" style={artboardStyle(0, 3120, 10, 10)} aria-hidden="true" />
          <section id="faq" className="section-anchor" style={artboardStyle(0, 7020, 10, 10)} aria-hidden="true" />
          <section id="contact" className="section-anchor" style={artboardStyle(0, 8030, 10, 10)} aria-hidden="true" />

          <div className="art-mask trust-mask" style={artboardStyle(0, 988, 1512, 340)} aria-hidden="true" />
          <section className="trust-overlay" aria-label="Trusted support categories" style={artboardStyle(0, 1006, 1512, 250)}>
            <p>Trusted Support for Fast-Growing Businesses In:</p>
            <div className="trust-card-row">
              {trustCards.map((card) => (
                <article className="trust-card" key={card.title}>
                  <TrustIcon name={card.icon} />
                  <strong>{card.title}</strong>
                  <small>{card.subtitle}</small>
                </article>
              ))}
            </div>
          </section>

          <div className="ticker ticker-top" style={artboardStyle(0, 864, 1512, 88)} aria-hidden="true">
            <div className="ticker-track">
              {Array.from({ length: 8 }).map((_, index) => (
                <span key={index}>
                  Customer support <b>*</b> Community growth <b>*</b> Global projects <b>*</b> Ticket and chat
                </span>
              ))}
            </div>
          </div>

          <div className="art-mask marquee-mask" style={artboardStyle(0, 6794, 1512, 230)} aria-hidden="true" />
          <div className="ticker ticker-lower" style={artboardStyle(0, 6818, 1512, 88)} aria-hidden="true">
            <div className="ticker-track reverse">
              {Array.from({ length: 8 }).map((_, index) => (
                <span key={index}>
                  Support agents <b>*</b> Community growth <b>*</b> Global projects <b>*</b> Ticket and chat
                </span>
              ))}
            </div>
          </div>

          <div className="motion-orb orb-right" style={artboardStyle(1400, 4695, 115, 115)} aria-hidden="true" />
          <div className="motion-orb orb-left" style={artboardStyle(-28, 5390, 115, 115)} aria-hidden="true" />

          <div className="art-mask faq-mask" style={artboardStyle(0, 7085, 1512, 1235)} aria-hidden="true" />
          <div className="faq-title-overlay" style={artboardStyle(0, 7108, 1512, 210)} aria-hidden="true">
            <span>FAQ</span>
            <h2>Frequently Asked Questions</h2>
            <p>We have answered some things you might be wondering.</p>
          </div>
          <section className="faq-overlay" aria-label="Frequently asked questions" style={artboardStyle(214, 7285, 1168, 650)}>
            {faqs.map((faq, index) => {
              const isOpen = openFaq === index;

              return (
                <article className={isOpen ? "faq-item is-open" : "faq-item"} key={faq.question}>
                  <button type="button" aria-expanded={isOpen} onClick={() => setOpenFaq(isOpen ? -1 : index)}>
                    <span>{faq.question}</span>
                    <strong>{isOpen ? "-" : "+"}</strong>
                  </button>
                  <p>{faq.answer}</p>
                </article>
              );
            })}
          </section>

          <form
            className={formStatus === "sent" ? "prototype-form contact-hit-form is-submitted" : "prototype-form contact-hit-form"}
            style={artboardStyle(800, 8461, 616, 312)}
            aria-label="Request a callback"
            onSubmit={handleSubmit}
          >
            <input
              aria-label="Business email"
              name="businessEmail"
              type="text"
              inputMode="email"
              placeholder="Business email..."
              required
            />
            <div className="phone-row">
              <div className="country-picker">
                <input type="hidden" name="country" value={selectedCountryCode} />
                <button
                  type="button"
                  className="country-trigger"
                  aria-expanded={isCountryPickerOpen}
                  aria-label="Country calling code"
                  onClick={() => setIsCountryPickerOpen((isOpen) => !isOpen)}
                >
                  <span>{selectedCountry ? `${selectedCountry.code} ${selectedCountry.dialCode}` : "Select"}</span>
                </button>
                {isCountryPickerOpen ? (
                  <div className="country-menu" role="dialog" aria-label="Select country calling code">
                    <div className="country-search-row">
                      <input
                        aria-label="Search countries"
                        type="search"
                        value={countrySearch}
                        placeholder="Search country"
                        onChange={(event) => setCountrySearch(event.target.value)}
                      />
                      <button type="button" onClick={() => setCountrySearch(countrySearch.trim())}>
                        Search
                      </button>
                    </div>
                    <div className="country-option-list" role="listbox">
                      {filteredCountryOptions.map((country) => (
                        <button
                          type="button"
                          role="option"
                          aria-selected={country.code === selectedCountryCode}
                          aria-label={`${country.name} ${country.code} ${country.dialCode}`}
                          className="country-option"
                          key={country.code}
                          onClick={() => {
                            setSelectedCountryCode(country.code);
                            setCountrySearch("");
                            setIsCountryPickerOpen(false);
                          }}
                        >
                          <span>{country.name}</span>
                          <strong>
                            {country.code} {country.dialCode}
                          </strong>
                        </button>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
              <input
                aria-label="Phone number"
                name="phoneNumber"
                type="text"
                inputMode="numeric"
                pattern="[0-9]*"
                placeholder="Phone Number"
                value={phoneNumber}
                onChange={(event) => setPhoneNumber(event.target.value.replace(/\D/g, ""))}
                required
              />
            </div>
            <button type="submit" disabled={formStatus === "sending"}>
              <span aria-hidden="true" className="call-icon">
                <svg viewBox="0 0 24 24" focusable="false">
                  <path d="M6.6 10.8a11.7 11.7 0 0 0 6.6 6.6l2.2-2.2c.3-.3.7-.4 1.1-.3 1.2.4 2.5.6 3.8.6.6 0 1 .4 1 1v3.5c0 .6-.4 1-1 1A17.3 17.3 0 0 1 3 3.7c0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.6.6 3.8.1.4 0 .8-.3 1.1l-2.2 2.2Z" />
                  <path d="M15.8 8.2h4.1v4.1" />
                  <path d="m15.4 12.6 4.4-4.4" />
                </svg>
              </span>
              {formStatus === "sending" ? "Sending..." : formStatus === "sent" ? "Request Sent" : "Book a Call"}
            </button>
            <p className="form-status" aria-live="polite">
              {formStatus === "error" ? "Could not send. Please try again." : ""}
            </p>
          </form>
        </div>
      </div>
    </main>
  );
}

function TrustIcon({ name }: { name: string }) {
  if (name === "trading") {
    return (
      <span className="trust-icon" aria-hidden="true">
        <svg viewBox="0 0 48 48" focusable="false">
          <path d="M7 32h8v7H7zM18 25h8v14h-8zM29 18h8v21h-8z" />
          <path d="M7 14h27" />
          <path d="m31 8 8 6-8 6" />
        </svg>
      </span>
    );
  }

  if (name === "crypto") {
    return (
      <span className="trust-icon" aria-hidden="true">
        <svg viewBox="0 0 48 48" focusable="false">
          <path d="M17 8h14l6 6v8l-6 6H17z" />
          <path d="M17 28v12h18" />
          <path d="M23 14v14M29 14v14" />
          <circle cx="35" cy="13" r="8" />
          <path d="M35 9v8M31 13h8" />
        </svg>
      </span>
    );
  }

  return (
    <span className="trust-icon" aria-hidden="true">
      <svg viewBox="0 0 48 48" focusable="false">
        <path d="M14 16h20v22H14z" />
        <path d="M18 16a6 6 0 0 1 12 0" />
        <path d="M24 22v10" />
        <path d="M20 26h8" />
        <path d="M9 9v9M9 30v9M39 9v9M39 30v9M5 14h8M5 34h8M35 14h8M35 34h8" />
      </svg>
    </span>
  );
}
