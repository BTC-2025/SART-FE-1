const fs = require('fs');

let file = fs.readFileSync('src/components/tabs/store/StoreBuySellPortalOverview.tsx', 'utf8');

const target1 = "  return (\r\n                {carbike360PageMode === 'portal_home' && (\r\n                  <div className=\"cardekho-content-sections-wrap\">";
const target1LF = "  return (\n                {carbike360PageMode === 'portal_home' && (\n                  <div className=\"cardekho-content-sections-wrap\">";

const replace1 = "  return (\n    <div className=\"cardekho-content-sections-wrap\">";

if (file.includes(target1)) {
  file = file.replace(target1, replace1);
} else if (file.includes(target1LF)) {
  file = file.replace(target1LF, replace1);
}

const target2 = "                })()}\r\n\r\n  );\r\n}";
const target2LF = "                })()}\n\n  );\n}";
const replace2 = "                })()}\n    </div>\n  );\n}";

if (file.includes(target2)) {
  file = file.replace(target2, replace2);
} else if (file.includes(target2LF)) {
  file = file.replace(target2LF, replace2);
}

fs.writeFileSync('src/components/tabs/store/StoreBuySellPortalOverview.tsx', file, 'utf8');
console.log('Fixed StoreBuySellPortalOverview tags cleanly');
