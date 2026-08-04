import { fireEvent, render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { InfoHeader } from "./info-chrome";

describe("InfoHeader", () => {
  it("exposes an accessible mobile navigation disclosure", () => {
    render(<InfoHeader />);

    const toggle = screen.getByRole("button", { name: /abrir menú/i });
    expect(toggle).toHaveAttribute("aria-expanded", "false");
    fireEvent.click(toggle);
    expect(toggle).toHaveAttribute("aria-expanded", "true");
    expect(screen.getByRole("navigation", { name: /información del servicio/i })).toHaveClass("is-open");
  });
});
