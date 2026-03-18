export function showCodeModal(kbId, kbTitle, rawHtml) {
    // 1. Wrap in structural HTML
    const fullHtml = `<html>\n<body>\n${rawHtml}\n</body>\n</html>`;

    // 2. Prettifier (Indentation Engine)
    let indentLevel = 0;
    const tab = "  "; // 2 spaces for cleaner look
    const indentedLines = fullHtml
        .replace(/>\s*</g, '>\n<') 
        .split('\n')
        .map(line => line.trim())
        .filter(line => line !== '')
        .map(line => {
            if (line.match(/^<\//)) indentLevel--;
            const spaces = tab.repeat(Math.max(0, indentLevel));
            // Basic indentation logic
            if (line.match(/^<[^/]/) && !line.match(/\/>$/) && !line.match(/<.*\/>/)) {
                if (!line.match(/<(\w+).*<\/ \1>/) && !line.startsWith("<!")) indentLevel++;
            }
            return spaces + line;
        });

    // 3. Syntax Highlighting (Classic Token System)
    const vault = [];
    
    // Helper to store tokens safely before re-assembling
    const hide = (str, cls) => {
        const placeholder = `##TOKEN_${vault.length}##`;
        vault.push(`<span class="${cls}">${str}</span>`);
        return placeholder;
    };

    const processLine = (text) => {
        // 1. Escape HTML entities first
        let escaped = text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
        
        // 2. Extract Values (Double Quotes) -> Blue
        escaped = escaped.replace(/"([^"]*)"/g, (m, p1) => hide(`"${p1}"`, 'code-val'));
        
        // 3. Extract Attributes (Word before =) -> Red
        // We look for a word followed immediately by an equals sign
        escaped = escaped.replace(/\b([a-zA-Z0-9-]+)(=)/g, (m, p1, p2) => {
            return `${hide(p1, 'code-attr')}${p2}`;
        });

        // 4. Extract Tags (Opening and Closing) -> Dark Red/Purple
        // Matches &lt;tag or &lt;/tag
        escaped = escaped.replace(/(&lt;\/?)([a-zA-Z0-9-]+)/g, (m, p1, p2) => {
            return `${p1}${hide(p2, 'code-tag')}`;
        });

        // 5. Restore tokens
        vault.forEach((html, i) => { 
            escaped = escaped.replace(`##TOKEN_${i}##`, html); 
        });
        vault.length = 0; 
        
        return escaped;
    };

    const finalCodeHtml = indentedLines.map((line, index) => {
        return `<div class="code-line"><span class="line-number">${index + 1}</span><span class="line-content">${processLine(line)}</span></div>`;
    }).join('');

    // 4. Build Modal
    const overlay = document.createElement('div');
    overlay.className = 'modal-overlay';

    overlay.innerHTML = `
        <div class="modal-window">
            <div class="modal-header">
                <div class="modal-title-group">
                    <span class="modal-kb-badge">${kbId}</span>
                    <span class="modal-kb-title">${kbTitle}</span>
                </div>
                <button class="modal-close-x" id="modalClose">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
            </div>
            <div class="modal-body">
                <div class="code-container">${finalCodeHtml}</div>
            </div>
            <div class="modal-footer">
                <button class="modal-btn primary" id="modalCopy">Copy Source</button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);

    // Close logic
    document.getElementById('modalClose').onclick = () => overlay.remove();
    overlay.onclick = (e) => { if(e.target === overlay) overlay.remove(); };

    // Copy logic
    document.getElementById('modalCopy').onclick = () => {
        navigator.clipboard.writeText(fullHtml).then(() => {
            const btn = document.getElementById('modalCopy');
            const oldText = btn.textContent;
            btn.textContent = "Copied!";
            btn.classList.add('success');
            setTimeout(() => { 
                btn.textContent = oldText; 
                btn.classList.remove('success'); 
            }, 2000);
        });
    };
}