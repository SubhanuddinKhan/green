import React from "react";
import { rest } from "msw";
import { setupServer } from "msw/node";
import {
  render,
  screen,
  waitFor,
  fireEvent,
  act,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import MaterialEntry from "../../components/material_entry/materialentry";
import { NotificationsProvider } from "../../contexts/NotficationsContext";
import { SnackbarProvider } from "notistack";
import {
  ThemeProvider,
  StyledEngineProvider,
  createTheme,
} from "@mui/material/styles";

import axios from "axios";
//import notistack from "notistack";
import "@testing-library/jest-dom/extend-expect";
// jest.mock("axios");

const theme = createTheme();

const mount = () => {
  const wrapper = render(
    <StyledEngineProvider>
      <ThemeProvider theme={theme}>
        <SnackbarProvider>
          <NotificationsProvider>
            <MaterialEntry />
          </NotificationsProvider>
        </SnackbarProvider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
  return { wrapper };
};

const server = setupServer(
  rest.get("//localhost:8000/api/get_carriers", (req, res, ctx) => {
    return res(
      ctx.json({
        count: "500",
        next: null,
        previous: null,
        results: [
          {
            uid: "1",
            article: {
              name: "test",
            },
          },

          {
            uid: "2",
            article: {
              name: "test",
            },
          },
        ],
      })
    );
  }),

  rest.get("//localhost:8000/api/imprtSingleArticle", (req, res, ctx) => {
    console.log("its called");
    return res(
      ctx.json({
        status: "info",
        message: "Article imported",
      })
    );
  })
);

beforeAll(() => server.listen());
afterEach(() => server.resetHandlers());
afterAll(() => server.close());

describe("MaterialEntry window", () => {
  test("it displays a table of carriers", async () => {
    await act(async () => mount());

    const carriersTable = await waitFor(() =>
      screen.getByTestId("carriers-table")
    );
    expect(carriersTable).toBeInTheDocument();
  });

  test("it displays sidebar", async () => {
    mount();
    const sidebar = await waitFor(() => screen.getByTestId("side-bar"));
    expect(sidebar).toBeInTheDocument();
  });

  test("Opens single Article modal", async () => {
    mount();
    const openSingleArticleButton = screen.getByTestId(
      "btn-open-single-article"
    );
    fireEvent.click(openSingleArticleButton);

    const singleArticleModal = await waitFor(() =>
      screen.getByTestId("me-modal-single-article")
    );
    expect(singleArticleModal).toBeInTheDocument();

    // const articleNumberInput = screen.getByTestId(
    //   "me-msa-input-article-number"
    // );
    // fireEvent.change(articleNumberInput, { value: "12345" });

    // const descriptionInput = screen.getByTestId(
    //   "me-msa-input-article-description"
    // );
    // fireEvent.change(descriptionInput, { value: "test" });

    //   const snackbar = await waitFor(() => mockEnqueue.mock);
    //   console.log(snackbar);
    //   expect(snackbar).toBeInTheDocument();
  });

  test("Open single carrier modal", async () => {
    mount();
    const openSingleCarrierButton = screen.getByTestId(
      "btn-open-single-carrier"
    );
    fireEvent.click(openSingleCarrierButton);

    const singleCarrierModal = await waitFor(() =>
      screen.getByTestId("me-modal-single-carrier")
    );
    expect(singleCarrierModal).toBeInTheDocument();
  });
  test.todo("Open multiple article modal behaviour");
  test.todo("Open multiple carrier modal behaviour");
  test.todo("Pagination behaviour");
  test.todo("Filtering behaviour");
  test.todo("Sorting behaviour");
});

describe("Add Article modal", () => {
  test("it displays errors when article number or description are empty", async () => {
    mount();
    const openSingleArticleButton = screen.getByTestId(
      "btn-open-single-article"
    );

    fireEvent.click(openSingleArticleButton);

    const saveButton = screen.getByTestId("me-msa-btn-save");

    userEvent.click(saveButton);

    const articleNumberErrorMessage = await waitFor(() =>
      screen.getByText("Article number is required")
    );

    const descriptionErrorMessage = await waitFor(() =>
      screen.getByText("Article description is required")
    );
    expect(articleNumberErrorMessage).toBeInTheDocument();
    expect(descriptionErrorMessage).toBeInTheDocument();
  });

  test("test inputs", async () => {
    mount();
    const message = "Article imported";
    // Mock API

    jest.spyOn(axios, "post").mockImplementation(() =>
      Promise.resolve({
        status: 200,
        json: () =>
          Promise.resolve({
            value: message,
          }),
      })
    );

    //const { snackEl } = mount();
    const openSingleArticleButton = screen.getByTestId(
      "btn-open-single-article"
    );

    fireEvent.click(openSingleArticleButton);
    const articleNumberInput = screen.getByTestId(
      "me-msa-input-article-number"
    );
    userEvent.type(articleNumberInput, "12345");
    const descriptionInput = screen.getByTestId(
      "me-msa-input-article-description"
    );
    userEvent.type(descriptionInput, "test");
    const saveButton = screen.getByTestId("me-msa-btn-save");
    userEvent.click(saveButton);

    await waitFor(() => screen.getByTestId("snackbar"));
    console.log(screen.getByTestId("snackbar").textContent);
    expect(screen.getByTestId("snackbar").textContent).toBe(message);
    //await expect(snackEl.innerHTML).toContain("imported");
  });
});

describe("Add article modal", () => {
  test.todo("Add article modal behaviour");
  test.todo("Test inputs");
  test.todo("Test form POST");
  test.todo("Test server feedback");
});

describe("Import carriers modal", () => {
  test.todo("Import carriers modal behaviour");
  test.todo("Test inputs");
  test.todo("Test form POST");
  test.todo("Test server feedback");
});

describe("Import articles modal", () => {
  test.todo("Import articles modal behaviour");
});
