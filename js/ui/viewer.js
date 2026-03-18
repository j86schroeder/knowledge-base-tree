import { generatePreviewHTML, generateClipboardHTML, getBadgeClass } from '../templates.js';
import { enableEditMode } from './editor.js';
import { jumpToContext } from './browser.js';
import { showCodeModal } from './modal.js';

export function renderPreview(art) {
    const elPreview = document.getElementById("previewPane");
    const container = document.getElementById('mainContainer');
    const badgeClass = getBadgeClass(art.type);
    const contentHtml = generatePreviewHTML(art);

    const isFocused = container.classList.contains('focus-mode');
    const isSearchMode = container.classList.contains('search-mode');
    const isActiveState = isFocused || isSearchMode;

    // Icons
    const sourceIcon = `
        <svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <polyline points="7 8 3 12 7 16"></polyline>
            <polyline points="17 8 21 12 17 16"></polyline>
            <line x1="14" y1="4" x2="10" y2="20"></line>
        </svg>
    `;
    
    const expandIcon = `<svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"></path></svg>`;
    const backIcon = `<svg width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M11 19l-7-7 7-7m8 14l-7-7 7-7"></path></svg>`;
    const focusIcon = isActiveState ? backIcon : expandIcon;
    
    let focusTitle = "Maximize View";
    if (isSearchMode) focusTitle = "Exit Search (Go Back)";
    else if (isFocused) focusTitle = "Exit Focus Mode (Go Back)";

    window.currentArticleId = art.id;

    elPreview.innerHTML = `
        <div id="displayMode">
            <div class="preview-header-strip">
                <div class="meta-group">
                    <span class="preview-id">${art.id}</span>
                    <span class="badge ${badgeClass}">${art.type}</span>
                </div>
                <div class="action-group">
                    <button id="btnEdit" class="action-btn" title="Edit Article">
                        <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path></svg>
                        Edit
                    </button>
                    
                    <button id="btnCopy" class="action-btn primary icon-only" title="View Source Code">
                        ${sourceIcon}
                    </button>

                    <button id="btnFocus" class="action-btn icon-only ${isActiveState ? 'active' : ''}" title="${focusTitle}">
                        ${focusIcon}
                    </button>
                </div>
            </div>
            <div class="preview-title">${art.title}</div>
            <div id="artContent">${contentHtml}</div>
        </div>
        <div id="editMode" style="display:none;"></div>
    `;

    // Listeners
    document.getElementById('btnEdit').onclick = () => enableEditMode(art);
    
    // NEW: Open Modal instead of alert
    document.getElementById('btnCopy').onclick = () => {
        const htmlToCopy = generateClipboardHTML(art);
        showCodeModal(art.id, art.title, htmlToCopy);
    };

    document.getElementById('btnFocus').onclick = () => {
        if (container.classList.contains('search-mode')) jumpToContext(art);
        else {
            container.classList.toggle('focus-mode');
            renderPreview(art); 
        }
    };
}

export function getPlaceholder() {
    return `<div class="preview-placeholder">
        <div class="placeholder-circle">
            <svg width="32" height="32" fill="none" stroke="currentColor" stroke-width="1.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path></svg>
        </div>
        <div class="placeholder-title">No Article Selected</div>
    </div>`;
}