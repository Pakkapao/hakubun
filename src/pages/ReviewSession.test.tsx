import { renderWithRouter, screen } from "../testing/test-utils";
import ReviewSession from "./ReviewSession";
import Home from "./Home";

test("ReviewSession renders", () => {
  const { baseElement } = renderComponent(false);
  expect(baseElement).toBeDefined();
});

describe("End session dialog", () => {
  test("Displays dialog on home button click", async () => {
    const { user } = renderComponent(true);

    user.click(
      screen.getByRole("button", {
        name: /home page/i,
      })
    );

    let dialog = await screen.findByRole("alertdialog", {
      name: /end review session\?/i,
    });
    expect(dialog).toBeInTheDocument();
  });

  test("Navigates to Home when end session is clicked", async () => {
    const { user } = renderComponent(true);

    await user.click(
      screen.getByRole("button", {
        name: /home page/i,
      })
    );

    await screen.findByRole("alertdialog", {
      name: /end review session\?/i,
    });

    await user.click(
      screen.getByRole("button", {
        name: /end session/i,
      })
    );

    expect(
      await screen.findByRole("heading", {
        name: /hakubun/i,
      })
    ).toBeVisible();
  });
});

const renderComponent = (withHomeRoute: boolean) => {
  return renderWithRouter({
    routeObj: {
      path: "/reviews/session",
      element: <ReviewSession />,
    },
    routes: withHomeRoute
      ? [
          {
            path: "/",
            element: <Home />,
          },
        ]
      : [],
  });
};