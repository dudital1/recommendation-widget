import { RecommendationAPI } from "./recommendations-api.js";
import {
  API_KEY,
  APP_TYPE,
  COUNT,
  SOURCE_ID,
  SOURCE_TYPE,
} from "../utils/constants.js";

describe("RecommendationAPI", () => {
  test("fetchRecommendations should fetch recommendations", async () => {
    global.fetch = jest.fn().mockResolvedValue({
      json: jest.fn().mockResolvedValue({ recommendations: [] }),
    });

    const recommendationAPI = new RecommendationAPI(
      APP_TYPE,
      API_KEY,
      SOURCE_TYPE,
      COUNT,
      SOURCE_ID
    );

    const recommendations = await recommendationAPI.fetchRecommendations();

    expect(fetch).toHaveBeenCalledWith(
      `https://api.taboola.com/1.0/json/taboola-templates/recommendations.get?app.type=${APP_TYPE}&app.apikey=${API_KEY}&count=${COUNT}&source.type=${SOURCE_TYPE}&source.id=${SOURCE_ID}`
    );
    expect(recommendations).toEqual({ recommendations: [] });
  });

  test("fetchRecommendations should handle errors", async () => {
    global.fetch = jest.fn().mockRejectedValue(new Error("Fetch error"));

    const recommendationAPI = new RecommendationAPI(
      APP_TYPE,
      API_KEY,
      SOURCE_TYPE,
      COUNT,
      SOURCE_ID
    );

    const errorSpy = jest.spyOn(console, "error");
    const recommendations = await recommendationAPI.fetchRecommendations();

    expect(fetch).toHaveBeenCalledWith(
      `https://api.taboola.com/1.0/json/taboola-templates/recommendations.get?app.type=${APP_TYPE}&app.apikey=${API_KEY}&count=${COUNT}&source.type=${SOURCE_TYPE}&source.id=${SOURCE_ID}`
    );
    expect(recommendations).toBeUndefined();
    expect(errorSpy).toHaveBeenCalledWith(
      "Error fetching recommendations:",
      expect.any(Error)
    );
  });
});
