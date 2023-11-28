import { setupIonicReact } from "@ionic/react";
import { expect, afterEach, vi } from "vitest";
import "@testing-library/jest-dom";
import * as matchers from "@testing-library/jest-dom/matchers";
import { server } from "./mocks/server";

vi.mock("react-secure-storage", () => {
  return {
    default: { setItem: vi.fn() },
    secureLocalStorage: vi.fn(),
  };
});

// mocking window properties
const scrollToMock = vi.fn();
window.HTMLElement.prototype.scrollTo = scrollToMock;

const mockIntersectionObserver = vi.fn();
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
});
window.IntersectionObserver = mockIntersectionObserver;

Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(), // deprecated
    removeListener: vi.fn(), // deprecated
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

HTMLMediaElement.prototype.pause = vi.fn();

vi.mock("zustand");

// extends Vitest's expect method with methods from react-testing-library
expect.extend(matchers);

// TODO: getting this error every once in a while while testing, fix...
// TODO: ...ReferenceError: window is not defined...
// TODO: ...❯ Timeout._onTimeout node_modules/@ionic/core/components/ion-app.js:19:50
setupIonicReact();

beforeAll(() => server.listen());

// clean up after each test case
afterEach(() => {
  server.resetHandlers();
});

// clean up after the tests are finished.
afterAll(() => server.close());
