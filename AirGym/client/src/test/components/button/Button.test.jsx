import { it, expect, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import Button from "../../../components/button/Button";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";

describe("URL Button", () => {
  it("should render props values", () => {
    render(
      <MemoryRouter>
        <Button
          btnText="Click Me"
          borderColor="red"
          backgroundColor="blue"
          fontColor="white"
          border="1px solid"
          link="/login"
        />
      </MemoryRouter>,
    );
    const link = screen.getAllByRole("link")[0];
    expect(link).toHaveAttribute("href", "/login");
  });

  it("should render default values", () => {
    render(
      <MemoryRouter>
        <Button btnText="Click Me" link="/" />
      </MemoryRouter>,
    );
    const link = screen.getAllByRole("link")[1];
    expect(link).toHaveAttribute("href", "/");
  });
});
