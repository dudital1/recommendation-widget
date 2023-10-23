export const RecommendationOriginHandler = {
  sponsored: (recommendationUrl) => {
    window.open(recommendationUrl, "_blank");
  },
  organic: (recommendationUrl) => {
    window.location.href = recommendationUrl;
  },
  defaultHandler: () => {},
};
