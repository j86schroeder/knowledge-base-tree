/* ================= HELPERS ================= */
export const unique = (arr, key) => [...new Set(arr.map(x => x[key]))].sort();
export const filter = (arr, key, val) => arr.filter(x => x[key] === val);

export const fieldLabels = {
    intro: "Introduction",
    instr: "Instructions",
    q: "Question",
    a: "Answer",
    issue: "Issue",
    env: "Environment",
    cause: "Cause",
    res: "Resolution",
    expl: "Explanation"
};