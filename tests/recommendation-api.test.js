const { RecommendationAPI } = require("../api/recommendations-api.js");

describe("RecommendationAPI", () => {
  test("fetchRecommendations should fetch recommendations", async () => {
    // Mock the fetch function
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ recommendations: [] }),
    });

    const appType = "yourAppType";
    const apiKey = "yourAPIKey";
    const sourceType = "yourSourceType";
    const count = 10;
    const sourceId = "yourSourceId";

    const recommendationAPI = new RecommendationAPI(
      appType,
      apiKey,
      sourceType,
      count,
      sourceId
    );

    const recommendations = await recommendationAPI.fetchRecommendations();

    expect(fetch).toHaveBeenCalledWith(
      `http://api.taboola.com/1.0/json/taboola-templates/recommendations.get?app.type=${appType}&app.apikey=${apiKey}&count=${count}&source.type=${sourceType}&source.id=${sourceId}`
    );
    expect(recommendations).toEqual({ recommendations: [] });
  });

  test("fetchRecommendations should handle errors", async () => {
    // Mock the fetch function to simulate an error
    global.fetch = jest.fn().mockRejectedValue(new Error("Fetch error"));

    const appType = "yourAppType";
    const apiKey = "yourAPIKey";
    const sourceType = "yourSourceType";
    const count = 10;
    const sourceId = "yourSourceId";

    const recommendationAPI = new RecommendationAPI(
      appType,
      apiKey,
      sourceType,
      count,
      sourceId
    );

    const errorSpy = jest.spyOn(console, "error");
    const recommendations = await recommendationAPI.fetchRecommendations();

    expect(fetch).toHaveBeenCalledWith(
      `http://api.taboola.com/1.0/json/taboola-templates/recommendations.get?app.type=${appType}&app.apikey=${apiKey}&count=${count}&source.type=${sourceType}&source.id=${sourceId}`
    );
    expect(recommendations).toBeUndefined();
    expect(errorSpy).toHaveBeenCalledWith(
      "Error fetching recommendations:",
      expect.any(Error)
    );
  });
});
