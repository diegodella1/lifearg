import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { MatcherExperience } from "./matcher-experience";

describe("MatcherExperience", () => {
  beforeEach(() => {
    window.localStorage.clear();
    Element.prototype.scrollIntoView = vi.fn();
  });
  afterEach(cleanup);

  it("completes anonymous onboarding and shows ranked results", () => {
    render(<MatcherExperience />);
    fireEvent.click(screen.getByRole("button", { name: /descubrir mi match/i }));
    expect(screen.getByText("¿Qué te trae por acá?")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }));
    expect(screen.getByText("Imaginá un buen martes.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }));
    expect(screen.getByText("Lo que tiene que cerrar.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }));
    expect(screen.getByText("¿Dónde vivís ahora?")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }));
    expect(screen.getByText("Elegí hasta cuatro prioridades.")).toBeInTheDocument();
    expect(screen.getByText("05 — LO QUE MÁS PESA")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /ver mis ciudades/i }));
    expect(screen.getByText(/Encontramos lugares/i)).toBeInTheDocument();
    expect(screen.getAllByText(/\/100/).length).toBeGreaterThanOrEqual(3);
    expect(screen.getByRole("img", { name: /mapa de argentina/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /mesa de decisión/i })).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: /alquileres para probar/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /impuestos y aportes/i })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole("tab", { name: /^impuestos$/i }));
    expect(screen.getByRole("heading", { name: /impuestos y aportes/i })).toBeInTheDocument();
    expect(screen.queryByRole("heading", { name: /alquileres para probar/i })).not.toBeInTheDocument();
  });

  it("synchronizes the selected map city with the decision tools", () => {
    render(<MatcherExperience />);
    fireEvent.click(screen.getByRole("button", { name: /descubrir mi match/i }));
    for (let step = 0; step < 4; step += 1) fireEvent.click(screen.getByRole("button", { name: /continuar/i }));
    fireEvent.click(screen.getByRole("button", { name: /ver mis ciudades/i }));

    const pins = screen.getAllByRole("button", { name: /match \d+/i });
    const secondCity = pins[1].getAttribute("aria-label")?.match(/^2\. ([^,]+)/)?.[1];
    fireEvent.click(pins[1]);

    expect(screen.getByRole("combobox", { name: /^ciudad$/i })).toHaveDisplayValue(secondCity ?? "");
  });
});
