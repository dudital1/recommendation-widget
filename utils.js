export const createDivWithClassName = (className) => {
  const element = document.createElement("div");
  element.classList.add(className);
  return element;
};

export const appendMany = (parent, children) => {
  children.forEach((child) => {
    parent.appendChild(child);
  });
};
