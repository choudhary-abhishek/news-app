const API_KEY = "2db67afae4f949f8a01db973e93ec9a7";
const url = "https://newsapi.org/v2/everything?q=";

window.addEventListener("load", () => {
    console.log("Page loaded. Fetching news for 'Education'...");
    fetchNews("Education");
});

function reload() {
    console.log("Reloading the page...");
    window.location.reload();
}

async function fetchNews(query) {
    console.log(`Fetching news for query: "${query}"`);
    try {
        const res = await fetch(`${url}${query}&apiKey=${API_KEY}`);
        if (!res.ok) {
            console.error(`HTTP Error: ${res.status} - ${res.statusText}`);
            return;
        }
        const data = await res.json();
        console.log("News fetched successfully:", data);
        bindData(data.articles);
    } catch (error) {
        console.error("Error fetching news:", error);
    }
}

function bindData(articles) {
    console.log("Binding data to cards...");
    const cardsContainer = document.getElementById("cards-container");
    const newsCardTemplate = document.getElementById("template-news-card");

    if (!cardsContainer || !newsCardTemplate) {
        console.error("Error: Cards container or news card template not found.");
        return;
    }

    cardsContainer.innerHTML = "";

    articles.forEach((article, index) => {
        console.log(`Processing article ${index + 1}:`, article);
        if (!article.urlToImage) {
            console.warn(`Skipping article ${index + 1}: Missing 'urlToImage'`);
            return;
        }

        const cardClone = newsCardTemplate.content.cloneNode(true);
        try {
            fillDataInCard(cardClone, article);
            cardsContainer.appendChild(cardClone);
            console.log(`Article ${index + 1} added to the container.`);
        } catch (error) {
            console.error(`Error binding article ${index + 1}:`, error);
        }
    });
}

function fillDataInCard(cardClone, article) {
    console.log("Filling data into card:", article);
    try {
        const newsImg = cardClone.querySelector("#news-img");
        const newsTitle = cardClone.querySelector("#news-title");
        const newsSource = cardClone.querySelector("#news-source");
        const newsDesc = cardClone.querySelector("#news-desc");

        if (!newsImg || !newsTitle || !newsSource || !newsDesc) {
            console.error("Error: Card template structure is invalid.");
            return;
        }

        newsImg.src = article.urlToImage;
        newsTitle.innerHTML = article.title || "No title available";
        newsDesc.innerHTML = article.description || "No description available";

        const date = new Date(article.publishedAt).toLocaleString("en-US", {
            timeZone: "Asia/Jakarta",
        });

        newsSource.innerHTML = `${article.source.name || "Unknown Source"} · ${date}`;

        cardClone.firstElementChild.addEventListener("click", () => {
            console.log(`Opening article: ${article.url}`);
            window.open(article.url, "_blank");
        });
    } catch (error) {
        console.error("Error filling card data:", error);
    }
}

let curSelectedNav = null;

function onNavItemClick(id) {
    // console.log(`Navigation item clicked: ${id}`);
    fetchNews(id);
    const navItem = document.getElementById(id);

    if (!navItem) {
        console.warn(`Navigation item with id "${id}" not found.`);
        return;
    }

    curSelectedNav?.classList.remove("active");
    curSelectedNav = navItem;
    curSelectedNav.classList.add("active");
}

const searchButton = document.getElementById("search-button");
const searchText = document.getElementById("search-text");

searchButton.addEventListener("click", () => {
    const query = searchText.value;
    // console.log(`Search button clicked. Query: "${query}"`);
    if (!query) {
        console.warn("Search query is empty. Aborting search.");
        return;
    }
    fetchNews(query);
    curSelectedNav?.classList.remove("active");
    curSelectedNav = null;
});
