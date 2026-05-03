const SVG_NS = "http://www.w3.org/2000/svg";
const XLINK_NS = "http://www.w3.org/1999/xlink";

const INTERACTIVE_COUNTRIES = [
  "Ireland",
  "Portugal",
  "Spain",
  "France",
  "Germany",
  "Austria",
  "Poland",
  "Romania",
  "Greece"
];

const LABEL_ADJUSTMENTS = {
  Ireland: { dx: 0, dy: -14 },
  Portugal: { dx: -4, dy: 22 },
  Spain: { dx: 6, dy: 28 },
  France: { dx: 0, dy: -16 },
  Germany: { dx: 0, dy: -16 },
  Austria: { dx: 0, dy: -14 },
  Poland: { dx: 0, dy: -18 },
  Romania: { dx: 0, dy: -18 },
  Greece: { dx: 8, dy: 34 }
};

const MARKER_ADJUSTMENTS = {
  Ireland: { dx: 0, dy: 8 },
  Portugal: { dx: -4, dy: 42 },
  Spain: { dx: 8, dy: 48 },
  France: { dx: 0, dy: 44 },
  Germany: { dx: 0, dy: 32 },
  Austria: { dx: 0, dy: 28 },
  Poland: { dx: 0, dy: 36 },
  Romania: { dx: 0, dy: 32 },
  Greece: { dx: 10, dy: 56 }
};

const levels = [
  {
    title: "Level 1: Animals",
    badge: "A",
    theme: "Save the animals.",
    next: "Next level",
    items: [
      { id: "lynx", name: "Iberian lynx", icon: "images/species/lynx.svg", photo: "images/1 Iberian lynx.jpg", type: "Animal", country: "Spain", clue: "It is a wild cat.", hint: "Look on the Iberian Peninsula in the southwest of Europe.", help: "Protect forests and rabbits." },
      { id: "bison", name: "European bison", icon: "images/species/bison.svg", photo: "images/2 European bison.jpg", type: "Animal", country: "Poland", clue: "It is very big.", hint: "Choose a large country in central-eastern Europe.", help: "Protect old forests." },
      { id: "seal", name: "Monk seal", icon: "images/species/seal.svg", photo: "images/3 Monk seal.jpg", type: "Animal", country: "Greece", clue: "It lives near the sea.", hint: "Find the country with many islands in the southeast of Europe.", help: "Keep beaches and seas clean." },
      { id: "bear", name: "Brown bear", icon: "images/species/bear.svg", photo: "images/4 Brown bear.jpg", type: "Animal", country: "Romania", clue: "It lives in mountains.", hint: "Look east of Hungary, near the Carpathian Mountains.", help: "Protect mountain habitats." }
    ]
  },
  {
    title: "Level 2: Plants",
    badge: "P",
    theme: "Save the plants.",
    next: "Next level",
    items: [
      { id: "edelweiss", name: "Edelweiss", icon: "images/species/edelweiss.svg", photo: "images/A Edelweiss.jpg", type: "Plant", country: "Austria", clue: "It grows in the Alps.", hint: "Pick the Alpine country just south of Germany.", help: "Do not pick rare flowers." },
      { id: "daffodil", name: "Sea daffodil", icon: "images/species/daffodil.svg", photo: "images/B Sea daffodil.jpg", type: "Plant", country: "Spain", clue: "It grows near sandy beaches.", hint: "This country shares the Iberian Peninsula with Portugal.", help: "Protect dunes and beaches." },
      { id: "orchid", name: "Lady's slipper orchid", icon: "images/species/orchid.svg", photo: "images/C Lady slipper orchid.jpg", type: "Plant", country: "Germany", clue: "It is a rare orchid.", hint: "Find the big country between France and Poland.", help: "Protect forests and do not pick orchids." },
      { id: "sundew", name: "Sundew", icon: "images/species/sundew.svg", photo: "images/D Sundew.JPG", type: "Plant", country: "Ireland", clue: "It grows in wet bogs.", hint: "Choose the island west of Great Britain.", help: "Protect bogs and wetlands." }
    ]
  },
  {
    title: "Level 3: Trees",
    badge: "T",
    theme: "Save the trees.",
    next: "Final mission",
    items: [
      { id: "cork", name: "Cork oak", icon: "images/species/cork.svg", photo: "images/1 Cork oak.jpg", type: "Tree", country: "Portugal", clue: "Its bark gives cork.", hint: "Look at the thin Atlantic country west of Spain.", help: "Protect old trees." },
      { id: "poplar", name: "Black poplar", icon: "images/species/poplar.svg", photo: "images/2 Black poplar.jpg", type: "Tree", country: "France", clue: "It likes rivers.", hint: "Choose the large western European country between Spain and Germany.", help: "Protect river banks." },
      { id: "fir", name: "Silver fir", icon: "images/species/fir.svg", photo: "images/3 Silver fir.jpg", type: "Tree", country: "Germany", clue: "It is a mountain tree.", hint: "It is north of Austria and east of France.", help: "Protect forests." },
      { id: "pine", name: "Macedonian pine", icon: "images/species/pine.svg", photo: "images/4 Macedoin pine.jpg", type: "Tree", country: "Greece", clue: "It grows in Balkan mountains.", hint: "Find the southern country with many islands and a long coastline.", help: "Protect mountain forests." }
    ]
  }
];

const totalItems = levels.reduce((sum, level) => sum + level.items.length, 0);
let currentLevel = 0;
let selectedCardId = null;
const completed = [];

const mapState = {
  ready: false,
  countries: [],
  svg: null,
  interactiveLayer: null
};

const els = {
  score: document.getElementById("score"),
  total: document.getElementById("total"),
  progressBar: document.getElementById("progressBar"),
  levelLabel: document.getElementById("levelLabel"),
  levelTitle: document.getElementById("levelTitle"),
  levelBadge: document.getElementById("levelBadge"),
  levelTheme: document.getElementById("levelTheme"),
  cardList: document.getElementById("cardList"),
  nextButton: document.getElementById("nextButton"),
  hintButton: document.getElementById("hintButton"),
  gameBoard: document.getElementById("gameBoard"),
  missionPanel: document.getElementById("missionPanel"),
  toast: document.getElementById("toast"),
  confetti: document.getElementById("confetti"),
  chosenSpecies: document.getElementById("chosenSpecies"),
  studentName: document.getElementById("studentName"),
  studentClass: document.getElementById("studentClass"),
  studentIdea: document.getElementById("studentIdea"),
  sheetName: document.getElementById("sheetName"),
  sheetClass: document.getElementById("sheetClass"),
  sentenceBox: document.getElementById("sentenceBox"),
  completedList: document.getElementById("completedList"),
  sheetSpeciesPhoto: document.getElementById("sheetSpeciesPhoto"),
  mapLoading: document.getElementById("mapLoading"),
  mapCanvas: document.getElementById("mapCanvas")
};

els.total.textContent = String(totalItems);
els.toast.addEventListener("click", hideToast);

function allItems() {
  return levels.flatMap((level) => level.items);
}

function itemById(id) {
  return allItems().find((item) => item.id === id);
}

function currentLevelItems() {
  return currentLevel < levels.length ? levels[currentLevel].items : [];
}

function currentLevelCountries() {
  return new Set(currentLevelItems().map((item) => item.country));
}

function gameCountries() {
  return new Set(allItems().map((item) => item.country));
}

function hideToast() {
  els.toast.classList.remove("show");
}

function showToast(kind, title, text, duration = 3200) {
  els.toast.className = `toast ${kind} show`;
  els.toast.innerHTML = `<strong>${title}</strong><p>${text}</p>`;
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(hideToast, duration);
}

function updateProgress() {
  const percentage = (completed.length / totalItems) * 100;
  els.score.textContent = String(completed.length);
  els.progressBar.style.width = `${percentage}%`;
  els.levelLabel.textContent = currentLevel < levels.length ? `Level ${currentLevel + 1} / ${levels.length}` : "Final mission";
}

function renderCards() {
  const level = levels[currentLevel];
  els.levelTitle.textContent = level.title;
  els.levelBadge.textContent = level.badge;
  els.levelTheme.textContent = level.theme;
  els.nextButton.textContent = level.next;
  els.nextButton.disabled = !level.items.every((item) => completed.some((done) => done.id === item.id));
  els.cardList.innerHTML = "";

  level.items.forEach((item) => {
    const done = completed.some((match) => match.id === item.id);
    const card = document.createElement("button");
    card.type = "button";
    card.className = `species-card ${done ? "done" : ""}`;
    card.draggable = !done;
    card.dataset.id = item.id;
    card.innerHTML = `
      <img class="species-thumb" src="${item.photo}" alt="" />
      <div>
        <div class="species-name">${item.name}</div>
        <div class="species-hint">${item.clue}</div>
      </div>
      <div class="tiny-pill">${item.type}</div>
    `;

    card.addEventListener("click", () => selectCard(item.id));
    card.addEventListener("dragstart", (event) => {
      if (done) {
        event.preventDefault();
        return;
      }
      event.dataTransfer.setData("text/plain", item.id);
      selectedCardId = item.id;
      refreshSelection();
    });

    els.cardList.appendChild(card);
  });

  refreshSelection();
  updateProgress();
}

function refreshSelection() {
  document.querySelectorAll(".species-card").forEach((card) => {
    card.classList.toggle("selected", card.dataset.id === selectedCardId);
  });
}

function selectCard(id) {
  if (completed.some((item) => item.id === id)) {
    return;
  }

  selectedCardId = selectedCardId === id ? null : id;
  refreshSelection();

  if (selectedCardId) {
    const item = itemById(selectedCardId);
    showToast("", "Card selected", `Now click the correct country for ${item.name}.`, 2600);
  } else {
    hideToast();
  }
}

function parseEuropeSvg(svgText) {
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgText, "image/svg+xml");
  return doc.documentElement;
}

function setSvgRootAttributes(svg) {
  const viewBox = svg.getAttribute("viewBox") || svg.getAttribute("viewbox") || "0 0 1000 684";
  svg.setAttribute("viewBox", viewBox);
  svg.removeAttribute("viewbox");
  svg.removeAttribute("width");
  svg.removeAttribute("height");
  svg.classList.add("europe-map");
  svg.setAttribute("role", "img");
  svg.setAttribute("aria-label", "Interactive map of Europe");
}

function getCombinedBBox(nodes) {
  const bounds = nodes.map((node) => node.getBBox());
  const minX = Math.min.apply(null, bounds.map((box) => box.x));
  const minY = Math.min.apply(null, bounds.map((box) => box.y));
  const maxX = Math.max.apply(null, bounds.map((box) => box.x + box.width));
  const maxY = Math.max.apply(null, bounds.map((box) => box.y + box.height));

  return {
    x: minX,
    y: minY,
    width: maxX - minX,
    height: maxY - minY
  };
}

function getLabelPosition(country, bbox) {
  const adjust = LABEL_ADJUSTMENTS[country] || { dx: 0, dy: -12 };
  return {
    x: bbox.x + bbox.width / 2 + adjust.dx,
    y: bbox.y + bbox.height / 2 + adjust.dy
  };
}

function getMarkerPosition(country, bbox) {
  const adjust = MARKER_ADJUSTMENTS[country] || { dx: 0, dy: 24 };
  return {
    x: bbox.x + bbox.width / 2 + adjust.dx,
    y: bbox.y + bbox.height / 2 + adjust.dy
  };
}

function createCountryGroup(svg, countryName) {
  const countryPaths = Array.from(svg.querySelectorAll(`path[name="${countryName}"]`));
  if (!countryPaths.length) {
    return null;
  }

  const group = document.createElementNS(SVG_NS, "g");
  group.classList.add("map-country");
  group.setAttribute("data-country", countryName);
  group.setAttribute("role", "button");
  group.setAttribute("tabindex", "-1");
  group.setAttribute("aria-label", countryName);
  group.setAttribute("aria-disabled", "true");

  mapState.interactiveLayer.appendChild(group);
  countryPaths.forEach((path) => {
    group.appendChild(path);
  });

  const bbox = getCombinedBBox(countryPaths);
  group.dataset.centerX = String(bbox.x + bbox.width / 2);
  group.dataset.centerY = String(bbox.y + bbox.height / 2);

  const labelPos = getLabelPosition(countryName, bbox);
  const markerPos = getMarkerPosition(countryName, bbox);

  const label = document.createElementNS(SVG_NS, "text");
  label.classList.add("map-label");
  label.setAttribute("x", String(labelPos.x));
  label.setAttribute("y", String(labelPos.y));
  label.textContent = countryName;

  const marker = document.createElementNS(SVG_NS, "g");
  marker.classList.add("map-marker");
  marker.setAttribute("transform", `translate(${markerPos.x} ${markerPos.y})`);

  group.appendChild(label);
  group.appendChild(marker);

  return group;
}

function renderPlacedMarkers() {
  mapState.countries.forEach((countryEl) => {
    const marker = countryEl.querySelector(".map-marker");
    const matches = completed.filter((item) => item.country === countryEl.dataset.country);
    while (marker.firstChild) {
      marker.removeChild(marker.firstChild);
    }

    countryEl.classList.toggle("has-match", matches.length > 0);

    const iconSize = 28;
    const gap = 6;
    const totalWidth = matches.length * iconSize + Math.max(0, matches.length - 1) * gap;
    const startX = -totalWidth / 2;

    matches.forEach((item, index) => {
      const x = startX + index * (iconSize + gap);

      const frame = document.createElementNS(SVG_NS, "rect");
      frame.classList.add("map-marker-frame");
      frame.setAttribute("x", String(x - 2));
      frame.setAttribute("y", "-2");
      frame.setAttribute("width", String(iconSize + 4));
      frame.setAttribute("height", String(iconSize + 4));
      frame.setAttribute("rx", "7");
      frame.setAttribute("ry", "7");
      marker.appendChild(frame);

      const image = document.createElementNS(SVG_NS, "image");
      image.setAttribute("href", item.icon);
      image.setAttributeNS(XLINK_NS, "xlink:href", item.icon);
      image.setAttribute("x", String(x));
      image.setAttribute("y", "0");
      image.setAttribute("width", String(iconSize));
      image.setAttribute("height", String(iconSize));
      image.setAttribute("preserveAspectRatio", "xMidYMid slice");

      const title = document.createElementNS(SVG_NS, "title");
      title.textContent = item.name;
      image.appendChild(title);
      marker.appendChild(image);
    });
  });
}

function renderMapAvailability() {
  if (!mapState.ready) {
    return;
  }

  const enabledCountries = gameCountries();
  mapState.countries.forEach((countryEl) => {
    const isEnabled = currentLevel < levels.length && enabledCountries.has(countryEl.dataset.country);
    countryEl.classList.toggle("is-active", isEnabled);
    countryEl.classList.toggle("is-disabled", !isEnabled);
    countryEl.classList.remove("active-drop", "wrong");
    countryEl.setAttribute("aria-disabled", String(!isEnabled));
    countryEl.setAttribute("tabindex", isEnabled ? "0" : "-1");
  });

  renderPlacedMarkers();
}

function flashWrongCountry(target) {
  target.classList.add("wrong");
  clearTimeout(target.flashTimer);
  target.flashTimer = setTimeout(() => target.classList.remove("wrong"), 520);
}

function tryPlace(cardId, country, target) {
  const item = itemById(cardId);
  if (!item || completed.some((done) => done.id === item.id)) {
    return;
  }

  if (item.country === country) {
    completed.push(item);
    selectedCardId = null;
    renderCards();
    renderMapAvailability();
    showToast("good", "Correct match", `${item.name} belongs to ${country}.`, 5200);

    if (completed.length === totalItems) {
      launchConfetti();
    }
    return;
  }

  flashWrongCountry(target);
  showToast("bad", "Try again", `${item.name} does not match ${country}.`, 3400);
}

function setupMapInteractions() {
  mapState.countries.forEach((target) => {
    target.addEventListener("dragover", (event) => {
      if (!target.classList.contains("is-active")) {
        return;
      }
      event.preventDefault();
      target.classList.add("active-drop");
    });

    target.addEventListener("dragleave", () => {
      target.classList.remove("active-drop");
    });

    target.addEventListener("drop", (event) => {
      if (!target.classList.contains("is-active")) {
        return;
      }
      event.preventDefault();
      target.classList.remove("active-drop");
      const cardId = event.dataTransfer.getData("text/plain");
      tryPlace(cardId, target.dataset.country, target);
    });

    target.addEventListener("click", () => {
      if (selectedCardId && target.classList.contains("is-active")) {
        tryPlace(selectedCardId, target.dataset.country, target);
      }
    });

    target.addEventListener("keydown", (event) => {
      if (!selectedCardId || !target.classList.contains("is-active")) {
        return;
      }
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        tryPlace(selectedCardId, target.dataset.country, target);
      }
    });
  });
}

async function initializeMap() {
  try {
    const response = await fetch("europe.svg");
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const svgText = await response.text();
    const svg = parseEuropeSvg(svgText);
    setSvgRootAttributes(svg);
    els.mapCanvas.innerHTML = "";
    els.mapCanvas.appendChild(svg);

    mapState.svg = svg;
    mapState.interactiveLayer = document.createElementNS(SVG_NS, "g");
    mapState.interactiveLayer.setAttribute("id", "interactive-countries");
    svg.appendChild(mapState.interactiveLayer);
    mapState.countries = INTERACTIVE_COUNTRIES
      .map((country) => createCountryGroup(svg, country))
      .filter(Boolean);

    setupMapInteractions();
    mapState.ready = true;
    els.mapCanvas.classList.add("is-ready");
    els.mapLoading.classList.add("hidden");
    renderMapAvailability();
  } catch (error) {
    els.mapLoading.textContent = "Unable to load europe.svg. Open the page from a local server if needed.";
    console.error(error);
  }
}

els.nextButton.addEventListener("click", () => {
  if (currentLevel < levels.length - 1) {
    currentLevel += 1;
    selectedCardId = null;
    renderCards();
    renderMapAvailability();
    showToast("good", "New level", levels[currentLevel].theme, 3600);
  } else {
    showFinalMission();
  }
});

els.hintButton.addEventListener("click", () => {
  const selectedItem = selectedCardId ? itemById(selectedCardId) : null;
  if (selectedItem && completed.some((done) => done.id === selectedItem.id)) {
    showToast("", "Hint", "Select a species card that is not matched yet.", 3200);
    return;
  }

  if (!selectedItem) {
    showToast("", "Hint", "Select one species card first to get its hint.", 3200);
    return;
  }

  const remaining = currentLevelItems().filter((item) => !completed.some((done) => done.id === item.id));
  if (!remaining.length) {
    showToast("good", "Level complete", "Click Next level to continue.", 3200);
    return;
  }

  showToast("", "Hint", `${selectedItem.name}: ${selectedItem.hint}`, 4200);
});

function showFinalMission() {
  els.gameBoard.classList.add("hidden");
  els.missionPanel.classList.remove("hidden");
  currentLevel = levels.length;
  updateProgress();

  els.chosenSpecies.innerHTML = "";
  completed.forEach((item, index) => {
    const option = document.createElement("option");
    option.value = item.id;
    option.textContent = `${item.name} - ${item.country}`;
    if (index === 0) {
      option.selected = true;
    }
    els.chosenSpecies.appendChild(option);
  });

  updateSheet();
  launchConfetti();
}

function updateSheet() {
  const item = itemById(els.chosenSpecies.value) || completed[0];
  const name = els.studentName.value.trim() || "__________";
  const klass = els.studentClass.value.trim() || "__________";
  const help = els.studentIdea.value.trim() || (item ? item.help : "protect nature");

  els.sheetName.textContent = name;
  els.sheetClass.textContent = klass;

  if (item) {
    els.sheetSpeciesPhoto.src = item.photo;
    els.sheetSpeciesPhoto.alt = item.name;
    els.sentenceBox.innerHTML = `
      This species is <strong>${item.name}</strong>.<br>
      It lives in <strong>${item.country}</strong>.<br>
      It is endangered or protected.<br>
      One way to help is <strong>${help}</strong>.
    `;
  }

  els.completedList.innerHTML = completed
    .map((item) => `<div class="mini-item"><img src="${item.icon}" alt="" /><span>${item.name} - ${item.country}</span></div>`)
    .join("");

  updateProgress();
}

document.getElementById("printButton").addEventListener("click", () => {
  updateSheet();
  window.print();
});
document.getElementById("resetButton").addEventListener("click", () => location.reload());

["input", "change"].forEach((eventName) => {
  els.studentName.addEventListener(eventName, updateSheet);
  els.studentClass.addEventListener(eventName, updateSheet);
  els.studentIdea.addEventListener(eventName, updateSheet);
  els.chosenSpecies.addEventListener(eventName, updateSheet);
});

function launchConfetti() {
  els.confetti.innerHTML = "";
  for (let i = 0; i < 42; i += 1) {
    const bit = document.createElement("i");
    bit.style.left = `${Math.random() * 100}%`;
    bit.style.top = `${-10 - Math.random() * 30}px`;
    bit.style.background = ["#f1ca60", "#97e5ae", "#80c7e8", "#f4a7a5"][i % 4];
    bit.style.animationDelay = `${Math.random() * 280}ms`;
    bit.style.transform = `rotate(${Math.random() * 180}deg)`;
    els.confetti.appendChild(bit);
  }
  setTimeout(() => {
    els.confetti.innerHTML = "";
  }, 1500);
}

renderCards();
renderMapAvailability();
initializeMap();
