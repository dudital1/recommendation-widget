import { appendMany, createDivWithClassName } from "./utils.js";

describe("createDivWithClassName", () => {
  test("it should create a div with the given class name", () => {
    const className = "test-class";
    const div = createDivWithClassName(className);

    expect(div.tagName).toBe("DIV");
    expect(div.classList.contains(className)).toBe(true);
  });
});

describe("appendMany", () => {
  test("it should append multiple children to a parent", () => {
    const parent = document.createElement("div");
    const children = [
      document.createElement("p"),
      document.createElement("span"),
      document.createElement("a"),
    ];

    appendMany(parent, children);

    expect(parent.childNodes.length).toBe(3);
  });
});
