const reviewsCounter = document.getElementById("reviewsCounter");

let reviews = parseInt(JSON.parse(localStorage.getItem("reviews"))) || 0;
    reviews++;
localStorage.setItem("reviews", JSON.stringify(reviews));
reviewsCounter.textContent = parseInt(reviews) || 0;