import { createDivWithClassName } from "./utils.js";
import { RecommendationAPI } from "./recommendations-api.js";

// consts
const APP_TYPE = "desktop";
const API_KEY = "f9040ab1b9c802857aa783c469d0e0ff7e7366e4";
const SOURCE_TYPE = "video";
const COUNT = "12";
const SOURCE_ID = "dudi tal";

const EMPTY_STATE_TITLE = "No Recommendations Found!";
const ERROR_STATE_TITLE = "Error occured while fetching recommendations";

// Globals
const widgetContainer = document.getElementById("widget-container");
const loader = document.getElementById("loader");
const listToggle = document.getElementById("list-toggle");
const gridToggle = document.getElementById("grid-toggle");
let isGridView = true;

class Widget {
  constructor() {
    this.isFetching = false;
    this.addWidgetScrollListener();
    this.recommendationAPI = new RecommendationAPI(
      APP_TYPE,
      API_KEY,
      SOURCE_TYPE,
      COUNT,
      SOURCE_ID
    );
    this.recommendations = null;
    this.fetchRecommendations();
  }

  addWidgetScrollListener() {
    window.addEventListener("scroll", async () => {
      if (this.isFetching) return;
      if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
        await this.fetchRecommendations();
      }
    });
  }

  async fetchRecommendations() {
    try {
      this.isFetching = true;
      loader.classList.add("show");
      const { list } = await this.recommendationAPI.fetchRecommendations();
      this.isFetching = false;
      loader.classList.remove("show");
      this.recommendations = list;
    } catch (error) {
      this.buildErrorState();
    }

    if (this.recommendations.length) {
      this.recommendations.map((recommendation) => {
        this.buildRecommendationCard(recommendation);
      });
    } else {
      this.buildEmptyState();
    }
  }

  buildErrorState() {
    const errorState = createDivWithClassName("error-state");
    errorState.innerHTML = `
      <h1 class="title">
        ${ERROR_STATE_TITLE}
      </h1>
    `;
    widgetContainer.appendChild(errorState);
  }

  buildEmptyState() {
    const emptyState = createDivWithClassName("empty-state");
    emptyState.innerHTML = `
      <h1 class="title">
        ${EMPTY_STATE_TITLE}
      </h1>
    `;
    widgetContainer.appendChild(emptyState);
  }

  buildRecommendationCard(recommendation) {
    const recommendationCard = createDivWithClassName("recommendation-card");
    recommendationCard.innerHTML = `
          <a href=${recommendation.url} target="_blank" class="recommendation">
              <img
                  alt="${recommendation.name}"
                  src="${recommendation.thumbnail[0].url}"
                  class="recommendation-image"
              />
              <div class="recommendation-content">
                <span class="recommendation-title">${recommendation.name}</span>
                <div >${
                  isGridView || !recommendation.description
                    ? ""
                    : recommendation.description
                }</div>
              </div>
          </a>
      `;
    recommendationCard.addEventListener("click", () => {
      switch (recommendation.origin) {
        case "sponsored":
          window.open(recommendation.url, "_blank");
          break;

        case "organic":
          window.location.href = recommendation.url;
          break;

        // add another switch case for other types of recommendation
        default:
          break;
      }
    });
    widgetContainer.appendChild(recommendationCard);
  }
}

gridToggle.addEventListener("click", () => {
  listToggle.classList.remove("selected");
  gridToggle.classList.add("selected");
  widgetContainer.classList.remove("list-view");
  isGridView = true;
});

listToggle.addEventListener("click", () => {
  // handle buttons ui
  gridToggle.classList.remove("selected");
  listToggle.classList.add("selected");

  // change recommendations layout
  widgetContainer.classList.add("list-view");
  isGridView = false;
});

// run application
document.addEventListener("DOMContentLoaded", async () => {
  new Widget();
});
