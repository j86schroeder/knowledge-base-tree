import { state } from '../config.js';
import { unique, filter } from './utils.js';
import { getBadgeClass } from '../templates.js';
import { renderPreview, getPlaceholder } from './viewer.js';

export function renderList(ulId, items, onSelect, selectedVal) {
    const ul = document.getElementById(ulId);
    ul.innerHTML = "";
    if (items.length === 0) {
        ul.innerHTML = `<li class="no-data">None</li>`;
    }
    
    items.forEach(txt => {
        const li = document.createElement("li");
        li.textContent = txt;
        if(txt === selectedVal) li.classList.add("selected");
        li.onclick = () => {
            Array.from(ul.children).forEach(c => c.classList.remove("selected"));
            li.classList.add("selected");
            onSelect(txt);
        };
        ul.appendChild(li);
    });
}

export function updateColumns(refreshPreview = true) {
    // 1. Render Process
    renderList("processList", unique(state.articles, "process"), (val) => {
        state.selectedProcess = val; state.selectedDomain = null; state.selectedTech = null;
        updateColumns();
    }, state.selectedProcess);

    // 2. Render Domain
    const domainData = state.selectedProcess ? filter(state.articles, "process", state.selectedProcess) : [];
    renderList("domainList", unique(domainData, "domain"), (val) => {
        state.selectedDomain = val; state.selectedTech = null;
        updateColumns();
    }, state.selectedDomain);

    // 3. Render Tech
    const techData = state.selectedDomain ? filter(domainData, "domain", state.selectedDomain) : [];
    renderList("techList", unique(techData, "tech"), (val) => {
        state.selectedTech = val;
        updateColumns();
    }, state.selectedTech);

    // 4. Render Articles
    if(state.selectedTech) {
        renderArticleList(filter(techData, "tech", state.selectedTech));
        const headerTag = document.getElementById("headerTagContainer");
        if(headerTag) {
            headerTag.innerHTML = `<span class="header-filter-pill all-pill">All</span>`;
        }
        if(refreshPreview) document.getElementById("previewPane").innerHTML = getPlaceholder();
    } else {
        document.getElementById("articleList").innerHTML = "<div style='padding:20px; color:#94a3b8; text-align:center; font-size:13px;'>Select a technology...</div>";
        document.getElementById("articleCountBadge").style.display = "none";
        const headerTag = document.getElementById("headerTagContainer");
        if(headerTag) headerTag.innerHTML = ""; 
        if(refreshPreview) document.getElementById("previewPane").innerHTML = ""; 
    }
}

export function renderArticleList(articleData) {
    const elArticles = document.getElementById("articleList");
    const container = document.getElementById('mainContainer');
    const isSearchMode = container.classList.contains('search-mode');
    const isFocusMode = container.classList.contains('focus-mode');
    const showTags = isSearchMode || isFocusMode;

    elArticles.innerHTML = "";
    const badge = document.getElementById("articleCountBadge");
    badge.textContent = articleData.length;
    badge.style.display = articleData.length > 0 ? "inline-block" : "none";

    if(articleData.length === 0) {
        elArticles.innerHTML = `<div class="no-results-wrapper"><div class="no-results-text">No article found</div></div>`;
        return; 
    }

    articleData.forEach(art => {
        const div = document.createElement("div");
        div.className = "article-item";
        div.dataset.id = art.id; 
        if(art.id === window.currentArticleId) div.classList.add("selected");

        const badgeClass = getBadgeClass(art.type);
        const techTagHtml = `<span class="tech-tag">${art.tech}</span>`;

        div.innerHTML = `
            <div class="art-title-row">${art.title}</div>
            <div class="art-meta-row">
                <span class="list-badge ${badgeClass}">${art.type}</span>
                <span class="list-id">${art.id}</span>
                ${techTagHtml}
            </div>
        `;
        
        div.onclick = () => { 
            document.querySelectorAll(".article-item").forEach(x => x.classList.remove("selected")); 
            div.classList.add("selected"); 
            renderPreview(art); 
        };
        elArticles.appendChild(div);
    });
}

export function jumpToContext(art) {
    const container = document.getElementById('mainContainer');
    state.selectedProcess = art.process;
    state.selectedDomain = art.domain;
    state.selectedTech = art.tech;
    document.getElementById("searchInput").value = "";
    document.getElementById("filterSelect").value = "All";
    container.classList.remove('search-mode');
    document.getElementById("filterContainer").style.display = 'none';
    document.getElementById("backBtn").style.display = 'none';
    document.getElementById("searchClear").style.display = 'none';
    updateColumns(false);
    renderPreview(art);
}