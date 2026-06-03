import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, describe, expect, it, vi } from "vitest";
import { LandingPage } from "./landing-page";

afterEach(() => {
  vi.unstubAllGlobals();
});

describe("LandingPage", () => {
  it("renders the exact Figma artboard with prototype controls", () => {
    render(<LandingPage />);

    expect(screen.getByRole("heading", { level: 1, name: "Qlidex customer support landing page" })).toBeInTheDocument();
    expect(screen.getByRole("img", { name: "QLIDEX customer support landing page design" })).toHaveAttribute(
      "src",
      "/assets/qlidex-figma-design.svg"
    );
    expect(screen.getByRole("link", { name: "Contact Us" })).toHaveAttribute("href", "#contact");
    expect(screen.getByRole("form", { name: "Request a callback" })).toBeInTheDocument();
  });

  it("expands FAQ items and submits the callback form", async () => {
    const user = userEvent.setup();
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ ok: true })
    });
    vi.stubGlobal("fetch", fetchMock);

    render(<LandingPage />);

    const supportQuestion = screen.getByRole("button", {
      name: /Does Qlidex only provide customer support services/i
    });

    expect(supportQuestion).toHaveAttribute("aria-expanded", "false");
    await user.click(supportQuestion);
    expect(supportQuestion).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByText(/onboarding, retention workflows/i)).toBeInTheDocument();

    await user.type(screen.getByLabelText("Your name"), "Ada");
    await user.type(screen.getByLabelText("Your email"), "ada@example.com");
    await user.click(screen.getByRole("button", { name: "Book a Call" }));

    expect(screen.getByRole("button", { name: "Request Sent" })).toBeInTheDocument();
    expect(fetchMock).toHaveBeenCalledWith(
      "http://localhost:4000/api/contact",
      expect.objectContaining({
        method: "POST"
      })
    );
  });
});
