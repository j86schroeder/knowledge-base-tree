import { saveArticle } from '../api.js';
import { fieldLabels } from './utils.js';
import { renderPreview } from './viewer.js';
import { updateColumns } from './browser.js';
import { getBadgeClass } from '../templates.js';

export function enableEditMode(art) {
    const badgeClass = getBadgeClass(art.type);
    document.getElementById("displayMode").style.display = "none";
    
    const editDiv = document.getElementById("editMode");
    editDiv.style.display = "block";
    editDiv.className = "edit-container";

    // Icons mapping to match templates.js exactly
    const icons = {
        intro: `<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
        instr: `<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>`,
        issue: `<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`,
        res: `<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
        // fallback icons
        default: `<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path></svg>`
    };

    let fieldsHtml = "";
    for (const [key, value] of Object.entries(art.fields)) {
        const labelText = fieldLabels[key] || key.toUpperCase(); 
        const icon = icons[key] || icons.default;
        
        fieldsHtml += `
            <div class="edit-field-group" style="margin-bottom: 24px;">
                <div class="sn-label ${badgeClass}" style="margin-bottom: 8px; display: flex; align-items: center; gap: 8px;">
                    ${icon} ${labelText}
                </div>
                <textarea id="field_${key}" class="edit-textarea" 
                    style="width: 100%; min-height: 120px; padding: 12px; border: 1px solid #e2e8f0; border-radius: 6px; font-family: inherit; font-size: 14px; line-height: 1.6; resize: vertical;"
                >${value}</textarea>
            </div>
        `;
    }

    editDiv.innerHTML = `
        <div class="preview-header-strip" style="margin-bottom: 20px; padding-bottom: 15px; border-bottom: 1px solid #f1f5f9;">
            <div class="meta-group">
                <span class="preview-id">${art.id}</span>
                <span class="badge ${badgeClass}">${art.type} (Editing)</span>
            </div>
            <div class="action-group">
                <button id="btnCancel" class="action-btn">Cancel</button>
                <button id="btnSave" class="action-btn success" style="display: flex; align-items: center; gap: 6px;">
                    <svg width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z"></path><path d="M17 21v-8H7v8"></path><path d="M7 3v5h8"></path></svg>
                    Save Changes
                </button>
            </div>
        </div>

        <div style="margin-bottom: 30px;">
            <label class="edit-label" style="font-size: 11px; text-transform: uppercase; color: #94a3b8; font-weight: 700; margin-bottom: 4px; display: block;">Article Title</label>
            <input type="text" id="editTitle" class="edit-input" value="${art.title}" 
                style="width: 100%; font-size: 24px; font-weight: 800; border: none; border-bottom: 2px solid #e2e8f0; padding: 8px 0; outline: none; color: #1e293b;"
                onfocus="this.style.borderBottomColor='#3b82f6'" 
                onblur="this.style.borderBottomColor='#e2e8f0'">
        </div>

        <div class="edit-fields-container">
            ${fieldsHtml}
        </div>
    `;

    // Button Logic
    document.getElementById('btnSave').onclick = async () => {
        const btn = document.getElementById('btnSave');
        btn.disabled = true;
        btn.textContent = "Saving...";

        art.title = document.getElementById("editTitle").value;
        for (const key of Object.keys(art.fields)) {
            art.fields[key] = document.getElementById(`field_${key}`).value;
        }

        const success = await saveArticle(art);
        if(success) {
            renderPreview(art); 
            updateColumns(false); 
        } else {
            alert("Error saving article.");
            btn.disabled = false;
            btn.textContent = "Save Changes";
        }
    };
    
    document.getElementById('btnCancel').onclick = () => {
        if(confirm("Discard unsaved changes?")) {
            renderPreview(art);
        }
    };
}