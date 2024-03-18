// extractIcons.js(추출)
const mdiIcons = require('@mdi/js');
const fs = require('fs');

const icons = Object.keys(mdiIcons).map(name => ({
  name,
  value: mdiIcons[name]
}));

fs.writeFileSync('./config.json', JSON.stringify(icons, null, 2));

console.log('Icon list extracted and saved to config.json');
