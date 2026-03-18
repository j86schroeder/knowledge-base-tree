/* 
   This file ensures the preview pane matches the original styling exactly.
   It exports two functions: one for the local preview (using CSS classes)
   and one for the clipboard (using inline styles for ServiceNow).
*/

export function getBadgeClass(type) {
    if(type === "FAQ") return "faq";
    if(type === "KCS Article") return "kcs";
    if(type === "What Is") return "what";
    return "howto";
}

// 1. GENERATE LOCAL PREVIEW (Uses CSS Classes defined in style.css and your SVGs)
export function generatePreviewHTML(art) {
    const badgeClass = getBadgeClass(art.type);
    
    // Exact SVGs from your original file
    const icons = {
        intro: `<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
        instr: `<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path></svg>`,
        alert: `<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path></svg>`,
        help: `<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`,
        check: `<svg width="14" height="14" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>`
    };

    const build = (label, content, iconKey) => {
        const val = content || "No information provided.";
        return `<div class="sn-field"><div class="sn-label ${badgeClass}">${icons[iconKey]} ${label}</div><div class="sn-content" style="white-space: pre-line;">${val}</div></div>`;
    };

    let html = "";
    if(art.type === "How To") html = build("Introduction", art.fields.intro, "intro") + build("Instructions", art.fields.instr, "instr");
    else if(art.type === "KCS Article") html = build("Issue", art.fields.issue, "alert") + build("Environment", art.fields.env, "intro") + build("Cause", art.fields.cause, "help") + build("Resolution", art.fields.res, "check");
    else if(art.type === "What Is") html = build("Introduction", art.fields.intro, "intro") + build("Explanation", art.fields.expl, "instr");
    else if(art.type === "FAQ") html = build("Question", art.fields.q, "help") + build("Answer", art.fields.a, "check");
    
    return html;
}

// 2. GENERATE CLIPBOARD HTML (For ServiceNow, using Emojis and Inline Styles to be safe)
export function generateClipboardHTML(art) {
    const icons = { intro: 'ℹ️', instr: '📝', alert: '⚠️', help: '❓', check: '✅' };
    
    const build = (label, content, iconKey) => {
        const val = content || "No information provided.";
        return `
        <div style="margin-bottom: 32px;">
            <div style="padding: 10px 14px; background-color: #f8fafc; border-left: 4px solid #94a3b8; font-weight: 800; text-transform: uppercase; margin-bottom: 12px; font-size: 11px;">
                ${icons[iconKey] || ''} ${label}
            </div>
            <div style="font-size: 15px; line-height: 1.6; color: #334155; padding-left: 14px;">
                ${val}
            </div>
        </div>`;
    };

    let html = "";
    if(art.type === "How To") html = build("Introduction", art.fields.intro, "intro") + build("Instructions", art.fields.instr, "instr");
    else if(art.type === "KCS Article") html = build("Issue", art.fields.issue, "alert") + build("Environment", art.fields.env, "intro") + build("Cause", art.fields.cause, "help") + build("Resolution", art.fields.res, "check");
    else if(art.type === "What Is") html = build("Introduction", art.fields.intro, "intro") + build("Explanation", art.fields.expl, "instr");
    else if(art.type === "FAQ") html = build("Question", art.fields.q, "help") + build("Answer", art.fields.a, "check");
    
    return html;
}