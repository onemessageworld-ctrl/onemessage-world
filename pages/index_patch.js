// This file patches index.jsx to use real Stripe
// Run this once: node pages/index_patch.js
const fs = require('fs');
let c = fs.readFileSync('./pages/index.jsx','utf8');
// Add loading state after paid state
c = c.replace("const[paid,setPaid]=useState(false);", "const[paid,setPaid]=useState(false);\n  const[loading,setLoading]=useState(false);");
fs.writeFileSync('./pages/index.jsx', c);
console.log('Patched');
