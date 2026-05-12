import { createRoot } from 'react-dom/client'

console.log("🚀 Entry point loaded");

const root = document.getElementById('app');
console.log("🔍 app element:", root);

if (root) {
    createRoot(root).render(
        <div style={{padding: 40, background: '#e8f5e9', borderRadius: 8}}>
            <h1 style={{color: '#2e7d32'}}>✅ REACT MOUNTED</h1>
            <p>Time: {new Date().toLocaleTimeString()}</p>
        </div>
    );
    console.log("Rendered");
} else {
    console.error("#app not found in DOM");
}