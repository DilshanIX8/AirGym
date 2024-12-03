import { it, expect, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import FeedCard from "../../../components/cards/FeedCard";
import "@testing-library/jest-dom/vitest";
import { MemoryRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "../../../state/store";

describe("Feed Card", () => {
  it("should render props values", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <FeedCard comments={[]} likes={0} isLiked={false} id="123" />
        </MemoryRouter>
      </Provider>,
    );
    const likeButton = screen.getByRole("button", {
      name: "Like",
    });
    expect(likeButton).toBeInTheDocument();
  });
});
