// extractIcons.js

const mdiIcons = require('@mdi/js');
const fs = require('fs');

// Extracting icon names and values
const icons = Object.keys(mdiIcons).map(name => ({
  name,
  value: mdiIcons[name]
}));

// Writing to JSON file
fs.writeFileSync('./config.json', JSON.stringify(icons, null, 2));

console.log('Icon list extracted and saved to config.json');



<!-- App.vue -->

<template>
  <div>
    <div v-for="icon in icons" :key="icon.name" class="icon">
      {{ icon.name }}: {{ icon.value }}
    </div>
  </div>
</template>

<script setup>
import mdiIcons from './config.json';

const props = defineProps({
  icons: {
    type: Array,
    default: () => mdiIcons
  }
});
</script>
