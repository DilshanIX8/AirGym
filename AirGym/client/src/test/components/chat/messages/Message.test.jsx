import { it, expect, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import Message from "../../../../components/chat/messages/Message";
import "@testing-library/jest-dom/vitest";
import { Provider } from "react-redux";
import { store } from "../../../../state/store";

describe("Message", () => {
  it("should render message", () => {
    render(
      <Provider store={store}>
        <Message
          message={{ message: "Hello", createdAt: "2024-08-01T00:00:00.000Z" }}
        />
      </Provider>,
    );
    const message = screen.getByText("Hello");
    expect(message).toBeInTheDocument();
  });
});
