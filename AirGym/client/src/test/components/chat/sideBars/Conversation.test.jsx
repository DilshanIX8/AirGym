import { it, expect, describe } from "vitest";
import { render, screen } from "@testing-library/react";
import Conversation from "../../../../components/chat/sidebar/Conversation";
import "@testing-library/jest-dom/vitest";
import { Provider } from "react-redux";
import { store } from "../../../../state/store";
import { SocketContextProvider } from "../../../../context/SocketContext";

describe("Conversation", () => {
  it("should render conversation", () => {
    render(
      <Provider store={store}>
        <SocketContextProvider>
          <Conversation
            conversation={{
              id: "1",
              sender: { username: "sender", firstName: "sender" },
              receiver: { username: "receiver", firstName: "receiver" },
              messages: [
                {
                  message: "Hello",
                  sender: "sender",
                  createdAt: "2024-08-01T00:00:00.000Z",
                },
              ],
            }}
          />
        </SocketContextProvider>
      </Provider>,
    );

    const message = screen.getByText("receiver : Hello");
    expect(message).toBeInTheDocument();
  });
});
