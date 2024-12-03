import { it, expect, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import HeaderCard from "../../../components/cards/HeaderCard";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";

describe("Header Card", () => {
  it("should render props values", () => {
    render(
      <MemoryRouter>
        <HeaderCard title="Title" />
      </MemoryRouter>,
    );
    const title = screen.getByText("Title");
    expect(title).toBeInTheDocument();
  });
});
