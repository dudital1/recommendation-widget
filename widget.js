import { createDivWithClassName, appendMany } from "./utils.js";
import { RecommendationAPI } from "./recommendations-api.js";
import { RecommendationOrigin } from "./enums.js";
import {
  API_KEY,
  APP_TYPE,
  COUNT,
  EMPTY_STATE_TITLE,
  ERROR_STATE_TITLE,
  SOURCE_ID,
  SOURCE_TYPE,
} from "./constants.js";

export class Widget {
  // dom elements references
  widgetHeaderElement;
  widgetContainerElement;
  widgetErrorsContainerElement;
  loaderElement;
  listToggleButton;
  gridToggleButton;
  recommendationCardDescription;

  // flags
  isFetching = false;
  isGridView = true;

  // service
  recommendationApiService;

  // data
  recommendations;

  constructor() {
    this.widgetElement = document.getElementById("recommendations-widget");
    this.initDomElements();
    this.initRecommendationApiService();
    this.buildHeader();
    this.getHeaderLayoutButtons();
    this.initEventListeners();
    this.getRecommendations();
  }

  initDomElements() {
    this.widgetHeaderElement = createDivWithClassName("widget-header");
    this.widgetContainerElement = createDivWithClassName(
      "recommendations-container"
    );
    this.widgetErrorsContainerElement = createDivWithClassName(
      "recommendations-errors"
    );
    this.loaderElement = createDivWithClassName("loader");
    appendMany(this.widgetElement, [
      this.widgetHeaderElement,
      this.widgetContainerElement,
      this.widgetErrorsContainerElement,
      this.loaderElement,
    ]);
  }

  initRecommendationApiService() {
    this.recommendationApiService = new RecommendationAPI(
      APP_TYPE,
      API_KEY,
      SOURCE_TYPE,
      COUNT,
      SOURCE_ID
    );
  }

  buildHeader() {
    this.widgetHeaderElement.innerHTML = `
    <img src="./assets/Taboola_logo.svg" alt="taboola-header-logo" />
    <div class="header-toggle-layout" loading="lazy">
      <button id="grid-toggle" class="header-toggle-btn selected">
        <img
          src="./assets/grid.svg"
          height="20px"
          alt="toggle-option-grid"
        />
      </button>
      <button id="list-toggle" class="header-toggle-btn">
        <img
          src="./assets/list.svg"
          height="20px"
          alt="toggle-option-row"
        />
      </button>
    </div>
    `;
  }

  getHeaderLayoutButtons() {
    this.listToggleButton = document.getElementById("list-toggle");
    this.gridToggleButton = document.getElementById("grid-toggle");
  }

  async getRecommendations() {
    try {
      this.isFetching = true;
      this.loaderElement.classList.add("show");
      const { list } =
        await this.recommendationApiService.fetchRecommendations();
      this.isFetching = false;
      this.loaderElement.classList.remove("show");
      this.recommendations = list;
      if (this.recommendations.length) {
        this.recommendations.map((recommendation) => {
          this.createRecommendation(recommendation);
        });
      } else {
        this.buildEmptyState();
      }
    } catch (error) {
      this.loaderElement.classList.remove("show");
      this.buildErrorState();
    }
  }

  createRecommendation(recommendation) {
    const recommendationCard = createDivWithClassName("recommendation-card");
    recommendationCard.innerHTML = this.buildRecommendationCard(recommendation);
    this.recommendationCardDescription = document.getElementsByClassName(
      "recommendation-description"
    );
    recommendationCard.addEventListener("click", () => {
      recommendationClickHandler(recommendation);
    });
    this.widgetContainerElement.appendChild(recommendationCard);
  }

  recommendationClickHandler(recommendation) {
    switch (recommendation.origin) {
      case RecommendationOrigin.SPONSORED:
        window.open(recommendation.url, "_blank");
        break;

      case RecommendationOrigin.ORGANIC:
        window.location.href = recommendation.url;
        break;

      // add another switch case for other types of recommendation
      default:
        break;
    }
  }

  buildRecommendationCard(recommendation) {
    return `
    <a href=${recommendation.url} target="_blank" class="recommendation-link">
        <img
            alt="${recommendation.name}"
            src="${recommendation.thumbnail[0].url}"
            class="recommendation-image"
            onerror="this.classList.add('fallback-image');"
        />
        <div class="recommendation-content">
          <span class="recommendation-title">${recommendation.name}</span>
          <span class="recommendation-description ${
            this.isGridView ? "" : "show"
          }" >${recommendation.description || ""}</span>
        </div>
    </a>
`;
  }

  buildErrorState() {
    this.errorsStateLogic(
      ERROR_STATE_TITLE,
      "./assets/error.svg",
      "error-logo"
    );
  }

  buildEmptyState() {
    this.errorsStateLogic(
      EMPTY_STATE_TITLE,
      "./assets/warning.svg",
      "no-recommendations-logo"
    );
  }

  errorsStateLogic(title, imageSrc, imgAlt) {
    const errorsWrapper = createDivWithClassName("errors-wrapper");
    errorsWrapper.innerHTML = `
      <h1 class="title">
        ${title}
      </h1>
      <img height="50px" src=${imageSrc} alt=${imgAlt} />
    `;
    window.removeEventListener("scroll", this.scrollHandler);
    this.widgetErrorsContainerElement.appendChild(errorsWrapper);
  }

  initEventListeners() {
    this.addListToggleButtonClickListener();
    this.addGridToggleButtonClickListener();
    this.addWidgetScrollListener();
  }

  scrollHandler = async () => {
    if (this.isFetching) return;
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
      await this.getRecommendations();
    }
  };

  addWidgetScrollListener() {
    window.addEventListener("scroll", this.scrollHandler);
  }

  addGridToggleButtonClickListener() {
    this.gridToggleButton.addEventListener("click", () => {
      this.listToggleButton.classList.remove("selected");
      this.gridToggleButton.classList.add("selected");
      this.widgetContainerElement.classList.remove("list-view");
      Array.from(this.recommendationCardDescription).forEach(
        (recommendation) => {
          recommendation.classList.remove("show");
        }
      );
      this.isGridView = true;
    });
  }

  addListToggleButtonClickListener() {
    this.listToggleButton.addEventListener("click", () => {
      this.gridToggleButton.classList.remove("selected");
      this.listToggleButton.classList.add("selected");
      this.widgetContainerElement.classList.add("list-view");
      Array.from(this.recommendationCardDescription).forEach(
        (recommendation) => {
          recommendation.classList.add("show");
        }
      );
      this.isGridView = false;
    });
  }
}
