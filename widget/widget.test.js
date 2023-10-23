import { Widget } from "./widget.js";
import { RecommendationAPI } from "../api/recommendations-api.js";
import {
  mockRecommendations,
  mockWidgetHeaderTemplate,
} from "../utils/recommendationsMockData.js";

describe("Widget Class", () => {
  let widget;

  beforeEach(() => {
    document.body.innerHTML = '<div id="recommendations-widget"></div>';
    widget = new Widget();
  });

  afterEach(() => {
    jest.restoreAllMocks();
    document.body.innerHTML = "";
  });

  describe("initDomElements", () => {
    it("should initialize DOM elements (containers for: header, content, error-state, loader)", () => {
      expect(widget.widgetHeaderElement).toBeInstanceOf(HTMLDivElement);
      expect(
        widget.widgetHeaderElement.classList.contains("widget-header")
      ).toBe(true);

      expect(widget.widgetContainerElement).toBeInstanceOf(HTMLDivElement);
      expect(
        widget.widgetContainerElement.classList.contains(
          "recommendations-container"
        )
      ).toBe(true);

      expect(widget.widgetErrorsContainerElement).toBeInstanceOf(
        HTMLDivElement
      );
      expect(
        widget.widgetErrorsContainerElement.classList.contains(
          "recommendations-errors"
        )
      ).toBe(true);

      expect(widget.loaderElement).toBeInstanceOf(HTMLDivElement);
      expect(widget.loaderElement.classList.contains("loader")).toBe(true);
    });
  });

  describe("initRecommendationApiService", () => {
    it("should initialize recommendationApiService using RecommendationAPI class", () => {
      expect(widget.recommendationApiService).toBeInstanceOf(RecommendationAPI);
    });
  });

  describe("buildHeader", () => {
    it("should build the header", () => {
      // Create the expected DOM structure
      const expectedHeader = document.createElement("div");
      expectedHeader.innerHTML = mockWidgetHeaderTemplate;

      // Expect that widget.widgetHeaderElement is defined and not null
      expect(widget.widgetHeaderElement).toBeDefined();
      expect(widget.widgetHeaderElement).not.toBeNull();

      // Expect that widget.widgetHeaderElement contains the same elements as the expectedHeader
      expect(widget.widgetHeaderElement.isEqualNode(expectedHeader));
    });
  });

  describe("getHeaderLayoutButtons", () => {
    it("should check if layout buttons listToggleButton and gridToggleButton initialized", () => {
      console.log(widget.listToggleButton);
      // Create the expected DOM structure
      expect(widget.listToggleButton).toBeInstanceOf(HTMLButtonElement);
      expect(
        widget.listToggleButton.classList.contains("header-toggle-btn")
      ).toBe(true);

      expect(widget.gridToggleButton).toBeInstanceOf(HTMLButtonElement);
      expect(
        widget.gridToggleButton.classList.contains("header-toggle-btn")
      ).toBe(true);
      expect(widget.gridToggleButton.classList.contains("selected")).toBe(true);
    });
  });

  describe("getRecommendations", () => {
    it("should fetch and display recommendations", async () => {
      const recommendationsData = {
        list: [mockRecommendations],
      };
      const fetchRecommendationsMock = jest
        .spyOn(RecommendationAPI.prototype, "fetchRecommendations")
        .mockResolvedValue(recommendationsData);

      await widget.getRecommendations();

      expect(widget.isFetching).toBe(false);
      expect(widget.loaderElement.classList.contains("show")).toBe(false);
      expect(widget.recommendations).toEqual(recommendationsData.list);
      expect(fetchRecommendationsMock).toHaveBeenCalled();
    });

    it("should handle an empty response", async () => {
      const fetchRecommendationsMock = jest
        .spyOn(RecommendationAPI.prototype, "fetchRecommendations")
        .mockResolvedValue({ list: [] });

      await widget.getRecommendations();
      expect(widget.isFetching).toBe(false);
      expect(widget.loaderElement.classList.contains("show")).toBe(false);
    });

    it("should handle an error response", async () => {
      const fetchRecommendationsMock = jest
        .spyOn(RecommendationAPI.prototype, "fetchRecommendations")
        .mockRejectedValue(new Error("API error"));

      await widget.getRecommendations();
      expect(widget.loaderElement.classList.contains("show")).toBe(false);
    });
  });
});
