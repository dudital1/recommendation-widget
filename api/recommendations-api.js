export class RecommendationAPI {
  constructor(appType, apiKey, sourceType, count, sourceId) {
    this.baseUrl =
      "https://api.taboola.com/1.0/json/taboola-templates/recommendations.get";
    this.query = `?app.type=${appType}&app.apikey=${apiKey}&count=${count}&source.type=${sourceType}&source.id=${sourceId}`;
  }

  async fetchRecommendations() {
    try {
      const response = await fetch(`${this.baseUrl}${this.query}`);
      return await response.json();
    } catch (error) {
      console.error("Error fetching recommendations:", error);
    }
  }
}
