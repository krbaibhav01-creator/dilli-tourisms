

const places = [
  {
    name: "India Gate",
    category: "History",
    cost: 0,
    time: 1,
    description: "A famous war memorial and landmark of New Delhi.",
    image: "https://images.unsplash.com/photo-1587474260584-136574528ed5?w=600",
    map: "India Gate Delhi"
  },
  {
    name: "Qutub Minar",
    category: "History",
    cost: 40,
    time: 2,
    description: "Explore the magnificent UNESCO World Heritage monument.",
    image: "https://images.unsplash.com/photo-1606293926075-69a00dbfde81?w=600",
    map: "Qutub Minar Delhi"
  },
  {
    name: "Red Fort",
    category: "History",
    cost: 35,
    time: 2,
    description: "Discover the historic Mughal fort in Old Delhi.",
    image: "https://images.unsplash.com/photo-1598977054780-2dc700fdc9d3?w=600",
    map: "Red Fort Delhi"
  },
  {
    name: "Lotus Temple",
    category: "Spiritual",
    cost: 0,
    time: 1,
    description: "Experience peace and beautiful lotus-shaped architecture.",
    image: "https://images.unsplash.com/photo-1585211969224-3e992986159d?w=600",
    map: "Lotus Temple Delhi"
  },
  {
    name: "Humayun's Tomb",
    category: "History",
    cost: 40,
    time: 2,
    description: "Admire the beautiful Mughal garden tomb and architecture.",
    image: "https://images.unsplash.com/photo-1564507592333-c60657eea523?w=600",
    map: "Humayun Tomb Delhi"
  },
  {
    name: "Lodhi Garden",
    category: "Nature",
    cost: 0,
    time: 1,
    description: "Enjoy greenery, nature and historical tombs.",
    image: "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600",
    map: "Lodhi Garden Delhi"
  },
  {
    name: "Chandni Chowk",
    category: "Culture",
    cost: 200,
    time: 2,
    description: "Explore traditional markets and famous Delhi street food.",
    image: "https://images.unsplash.com/photo-1595658658481-d53d3f999875?w=600",
    map: "Chandni Chowk Delhi"
  },
  {
    name: "Agrasen Ki Baoli",
    category: "History",
    cost: 0,
    time: 1,
    description: "Discover a fascinating ancient stepwell in central Delhi.",
    image: "https://images.unsplash.com/photo-1605649487212-47bdab064df7?w=600",
    map: "Agrasen Ki Baoli Delhi"
  }
];

let favorites = JSON.parse(localStorage.getItem("dilliFavorites") || "[]");

function showPlaces() {
  const search = document.getElementById("search").value.toLowerCase();
  const category = document.getElementById("category").value;

  const filtered = places.filter(place =>
    place.name.toLowerCase().includes(search) &&
    (category === "all" || place.category === category)
  );

  const container = document.getElementById("place-list");

  if (filtered.length === 0) {
    container.innerHTML = "<p>No destinations found. Try another search.</p>";
    return;
  }

  container.innerHTML = filtered.map(place => {
    const saved = favorites.includes(place.name);

    return `
      <div class="place-card">
        <img src="${place.image}" alt="${place.name}" loading="lazy">
        <div class="place-info">
          <h3>${place.name}</h3>
          <p>${place.description}</p>
          <p>Category: ${place.category}</p>
          <p>Suggested visit: ${place.time} hour(s)</p>
          <button onclick="savePlace('${place.name}')">
            ${saved ? "❤️ Saved" : "♡ Save Place"}
          </button>
          <a class="map-link"
             href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.map)}"
             target="_blank" rel="noopener">📍 Directions</a>
        </div>
      </div>
    `;
  }).join("");
}

function savePlace(name) {
  if (favorites.includes(name)) {
    favorites = favorites.filter(item => item !== name);
  } else {
    favorites.push(name);
  }

  localStorage.setItem("dilliFavorites", JSON.stringify(favorites));
  showPlaces();
}

function makePlan() {
  const budget = Number(document.getElementById("budget").value);
  const hours = Number(document.getElementById("hours").value);
  const result = document.getElementById("plan-result");

  if (!Number.isFinite(budget) || budget < 0) {
    result.innerHTML = "<p>Please enter a valid budget.</p>";
    return;
  }

  let remainingMoney = budget;
  let remainingTime = hours;
  let total = 0;
  let itinerary = [];

  for (const place of places) {
    if (place.cost <= remainingMoney && place.time <= remainingTime) {
      itinerary.push(place);
      remainingMoney -= place.cost;
      remainingTime -= place.time;
      total += place.cost;
    }
  }

  if (itinerary.length === 0) {
    result.innerHTML = "<h3>No matching itinerary found.</h3><p>Try increasing your budget or available time.</p>";
    return;
  }

  result.innerHTML = `
    <h3>🎉 Your Delhi Travel Plan</h3>
    <p>Here is a suggested plan based on your budget and time.</p>
    <ol>
      ${itinerary.map(place =>
        `<li><strong>${place.name}</strong> – ${place.time} hour(s), estimated entry ₹${place.cost}
        <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(place.map)}" target="_blank" rel="noopener">Map</a></li>`
      ).join("")}
    </ol>
    <h3>Estimated listed entry total: ₹${total}</h3>
    <p>Remaining budget: ₹${remainingMoney}</p>
    <p>Unallocated time: ${remainingTime} hour(s)</p>
    <p>Note: Travel, food and other expenses are extra. This is a suggested plan, not a live route-optimized itinerary.</p>
  `;
}

document.getElementById("search").addEventListener("input", showPlaces);
document.getElementById("category").addEventListener("change", showPlaces);

showPlaces();
