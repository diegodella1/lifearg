import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { cities } from "@/data/cities";
import { CityPostcard } from "./city-postcard";

describe("CityPostcard", () => {
  it("identifies the city and marks the visual as editorial", () => {
    render(<CityPostcard city={cities[0]} />);

    expect(screen.getByRole("img", { name: /postal ilustrada de buenos aires/i })).toBeInTheDocument();
    expect(screen.getByText(/ilustración editorial/i)).toBeInTheDocument();
  });
});
