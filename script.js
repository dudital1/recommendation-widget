// Globals
let isFetching = false;
const recommendationsContainer = document.getElementsByClassName(
  "recommendations-container"
)[0];

// Functions
const fetchRecommendations = async () => {
  isFetching = true;
  const response = await fetch(
    `http://api.taboola.com/1.0/json/taboola-templates/recommendations.get?app.type=desktop&app.apikey=f9040ab1b9c802857aa783c469d0e0ff7e7366e4&count=8&source.type=video&source.id=`
  );
  const recommendations = await response.json();
  updateDom(recommendations.list);
  isFetching = false;
};

const updateDom = (recommendations) => {
  recommendations.forEach((recommendation) => {
    const recommendationItem = document.createElement("div");
    recommendationItem.classList.add("recommendation-item");
    recommendationItem.innerHTML = `
    <div class="recommendation">
        <img
            alt="${recommendation.name}"
            src="${recommendation.thumbnail[0].url}"
            class="recommendation-image"
        />
        <div class="recommendation-content">${recommendation.name}</div>
    </div>
        `;

    recommendationsContainer.appendChild(recommendationItem);
  });
};

// fetch recommendation as long as the user scrolls
window.addEventListener("scroll", async () => {
  if (isFetching) return;
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight) {
    await fetchRecommendations();
  }
});

// run application
document.addEventListener("DOMContentLoaded", async () => {
  await fetchRecommendations();
});
