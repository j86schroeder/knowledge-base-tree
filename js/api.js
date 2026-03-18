import { API_URL, state } from './config.js';

export async function loadData() {
    try {
        const [artRes, taxRes] = await Promise.all([
            fetch(`${API_URL}/articles`),
            fetch(`${API_URL}/taxonomy`)
        ]);

        state.articles = await artRes.json();
        state.taxonomy = await taxRes.json();
        return true;
    } catch (error) {
        console.error("Database Error:", error);
        return false;
    }
}

export async function saveArticle(updatedArticle) {
    try {
        await fetch(`${API_URL}/articles/${updatedArticle.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(updatedArticle)
        });
        
        // Update local state
        const index = state.articles.findIndex(a => a.id === updatedArticle.id);
        if (index !== -1) state.articles[index] = updatedArticle;
        
        return true;
    } catch (e) {
        alert("Error saving: " + e.message);
        return false;
    }
}