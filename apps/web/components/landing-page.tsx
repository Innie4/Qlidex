"use client";

import type { CSSProperties, FormEvent } from "react";
import { useState } from "react";

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
  { title: "Forex & Prop", subtitle: "Trading", icon: "FT" },
  { title: "Crypto &", subtitle: "Web3", icon: "CW" },
  { title: "E-commerce", subtitle: "Brands", icon: "EB" }
];

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
          name: formData.get("name"),
          email: formData.get("email")
        })
      });

      if (!response.ok) {
        throw new Error("Unable to submit inquiry");
      }

      form.reset();
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

          <div className="art-mask trust-mask" style={artboardStyle(0, 988, 1512, 280)} aria-hidden="true" />
          <section className="trust-overlay" aria-label="Trusted support categories" style={artboardStyle(0, 1006, 1512, 250)}>
            <p>Trusted Support for Fast-Growing Businesses In:</p>
            <div className="trust-card-row">
              {trustCards.map((card) => (
                <article className="trust-card" key={card.title}>
                  <span>{card.icon}</span>
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
            style={artboardStyle(795, 8158, 620, 250)}
            aria-label="Request a callback"
            onSubmit={handleSubmit}
          >
            <input aria-label="Your name" name="name" placeholder="Your name" />
            <input aria-label="Your email" name="email" type="email" placeholder="Your email address" />
            <button type="submit" disabled={formStatus === "sending"}>
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
