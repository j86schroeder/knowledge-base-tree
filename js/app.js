import { state } from './config.js';
import { loadData } from './api.js';
import { updateColumns, renderArticleList, renderPreview } from './ui.js';

// DOM Elements
const searchInput = document.getElementById("searchInput");
const searchClear = document.getElementById("searchClear");
const filterSelect = document.getElementById("filterSelect");
const filterContainer = document.getElementById("filterContainer");
const backBtn = document.getElementById("backBtn");
const mainContainer = document.getElementById("mainContainer");
const headerTagContainer = document.getElementById("headerTagContainer");
// NEW Element
const btnShowAll = document.getElementById("btnShowAll"); 

/* ================= INITIALIZATION ================= */
async function init() {
    const loaded = await loadData();
    if(loaded) {
        // UPDATED: Better Placeholder Text
        searchInput.placeholder = "Search by keyword or KB...";
        searchInput.disabled = false;
        updateColumns();
    } else {
        document.getElementById("articleList").innerHTML = `<div style="padding:20px; color:red; text-align:center;">Error connecting to Database.<br>Run: npx json-server data/kb_data.json --port 3000</div>`;
    }
}

/* ================= SEARCH & FILTER LOGIC ================= */
function applyFilters() {
    const term = searchInput.value.toLowerCase();
    const val = filterSelect.value;
    
    // 1. Map selection to CSS classes
    const typeClasses = {
        "How To": "howto",
        "FAQ": "faq",
        "KCS Article": "kcs",
        "What Is": "what"
    };
    const activeColorClass = typeClasses[val] || "";

    const closeIconSvg = `
        <svg class="filter-close-icon" width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round">
            <line x1="18" y1="6" x2="6" y2="18"></line>
            <line x1="6" y1="6" x2="18" y2="18"></line>
        </svg>
    `;

    headerTagContainer.innerHTML = (val === "All") 
        ? `<span class="header-filter-pill all-pill">All</span>`
        : `<span class="header-filter-pill badge active ${activeColorClass}">
            ${val}
            <span class="filter-remove-x">${closeIconSvg}</span>
        </span>`;
    
    // Add click event to remove X
    const removeX = headerTagContainer.querySelector(".filter-remove-x");
    if(removeX) {
        removeX.onclick = (e) => {
            e.stopPropagation();
            filterSelect.value = "All";
            applyFilters();
        };
    }

    // Filter Logic
    const results = (term.length > 0) 
        ? state.articles.filter(art => {
            const matchesSearch = art.title.toLowerCase().includes(term) || art.id.toLowerCase().includes(term) || art.tech.toLowerCase().includes(term);
            const matchesFilter = filterSelect.value === 'All' || art.type === filterSelect.value;
            return matchesSearch && matchesFilter;
          })
        : state.articles.filter(art => filterSelect.value === 'All' || art.type === filterSelect.value);

    renderArticleList(results);
}

function enterSearchMode() {
    mainContainer.classList.add('search-mode');
    filterContainer.style.display = 'block';
    backBtn.style.display = 'flex';
    searchClear.style.display = 'block';
    // Hide "Browse All" button when in search mode to reduce clutter? 
    // Or keep it visible? Let's keep it visible for consistency or hide it if space is tight.
    // btnShowAll.style.display = 'none'; // Optional: Toggle visibility
    
    applyFilters();
}

function exitSearchMode() {
    // 1. Reset UI Inputs
    searchInput.value = "";
    filterSelect.value = "All";
    
    // 2. Hide Search UI Elements
    mainContainer.classList.remove('search-mode');
    filterContainer.style.display = 'none';
    backBtn.style.display = 'none';
    searchClear.style.display = 'none';
    // btnShowAll.style.display = 'block'; // Optional: Restore if hidden
    
    // 3. FORCE EXIT FOCUS MODE (If active)
    mainContainer.classList.remove('focus-mode');

    // 4. Smart Restoration Logic
    if (state.selectedTech) {
        updateColumns(false); 
        if (window.currentArticleId) {
            const art = state.articles.find(a => a.id === window.currentArticleId);
            if(art) renderPreview(art);
        }
    } else {
        state.selectedProcess = null;
        state.selectedDomain = null;
        state.selectedTech = null;
        updateColumns();
        document.getElementById("previewPane").innerHTML = "";
    }

    searchInput.focus();
}

/* ================= EVENT LISTENERS ================= */

// ENTER KEY SEARCH
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        enterSearchMode();
    }
});

searchInput.addEventListener('input', (e) => {
    if(e.target.value.length > 0) enterSearchMode();
    else if(mainContainer.classList.contains('search-mode')) exitSearchMode();
});

// BACK BUTTON HANDLER
backBtn.addEventListener('click', () => {
    if (mainContainer.classList.contains('search-mode')) {
        exitSearchMode();
    } 
    else if (mainContainer.classList.contains('focus-mode')) {
        mainContainer.classList.remove('focus-mode');
        backBtn.style.display = 'none'; 
        
        if (window.currentArticleId) {
            const art = state.articles.find(a => a.id === window.currentArticleId);
            if(art) renderPreview(art); 
        }
    }
});

// NEW: BROWSE ALL BUTTON HANDLER
btnShowAll.addEventListener('click', () => {
    searchInput.value = ""; // Ensure search is empty to show ALL
    enterSearchMode();
});

searchClear.addEventListener('click', exitSearchMode);
filterSelect.addEventListener('change', applyFilters);

// Start App
init();