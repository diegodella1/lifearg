import { fireEvent, render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";
import { MatcherExperience } from "./matcher-experience";

describe("MatcherExperience", () => {
  beforeEach(() => window.localStorage.clear());

  it("completes anonymous onboarding and shows ranked results", () => {
    render(<MatcherExperience />);
    fireEvent.click(screen.getByRole("button", { name: /descubrir mi match/i }));
    expect(screen.getByText("¿Qué te trae por acá?")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }));
    expect(screen.getByText("Imaginá un buen martes.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }));
    expect(screen.getByText("Lo que tiene que cerrar.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /continuar/i }));
    expect(screen.getByText("Elegí hasta cuatro prioridades.")).toBeInTheDocument();
    fireEvent.click(screen.getByRole("button", { name: /ver mis ciudades/i }));
    expect(screen.getByText(/Encontramos lugares/i)).toBeInTheDocument();
    expect(screen.getAllByText(/\/100/).length).toBeGreaterThanOrEqual(3);
  });
});
