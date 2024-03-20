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

<!-- <template>
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
</script> -->

<!-- 
<template>
  <div class="container">
    <header>
      <!-- 회사 로고 -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="120"
        height="30"
        viewBox="0 0 120 30"
      >
        <text x="0" y="15" font-size="15" fill="#333">Pictogrammers</text>
        <!-- 로고 이미지 -->
        <image xlink:href="logo.svg" x="80" y="0" height="30" width="30" />
      </svg>
    </header>
    <div class="sidebar">
    </div>
    <div class="icons">
      <!-- 아이콘 반복 -->
      <div v-for="(icon, index) in icons" :key="index" class="icon">
        <!-- 주석 처리된 코드의 SVG 아이콘 -->
        <!-- <svg xmlns="http://www.w3.org/2000/svg" :width="icon.width" :height="icon.height" viewBox="0 0 24 24">
          <path :d="icon.path" fill="currentColor"/>
        </svg> -->
        <!-- 주석 해제된 코드의 아이콘 이름과 값 -->
        <span>{{ icon.name }}: {{ icon.value }}</span>
      </div>
    </div>
    <footer>
      <!-- 회사 로고 -->
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="120"
        height="30"
        viewBox="0 0 120 30"
      >
        <image xlink:href="logo.svg" x="80" y="0" height="30" width="30" />
      </svg>
    </footer>
  </div>
</template>

<script>
export default {
  data() {
    return {
      icons: [
        { name: '아이콘1', value: '값1' },
        { name: '아이콘2', value: '값2' },
        // 다른 아이콘들을 이곳에 추가하세요
      ]
    };
  }
};
</script>

<style scoped>
/* 스타일을 이곳에 추가하세요 */
</style> -->


<!-- <script setup>
// import * as mdiIcons from '@mdi/font';

// const icons = Object.values(mdiIcons);
// const iconClass = 'icon';

import mdiIcons from '@/assets/config.json';

// 필요한 경우 개별 아이콘에 접근할 수 있습니다.
mdiIcons.forEach(icon => {
  console.log(`Icon name: ${icon.name}`);
  console.log(`Icon value: ${icon.value}`);
});

</script> -->

<template>
  <div>
    <!-- 아이콘 이름을 전달하여 SVG로 변환 -->
    <div v-html="convertToSVG('yourIconName')"></div>
  </div>
</template>


import json
import svgwrite

def json_to_svg(input_file, output_file):
    with open(input_file, 'r', encoding='utf-8') as f:
        data = json.load(f)
    
    # SVG 파일 생성
    dwg = svgwrite.Drawing(output_file, profile='full')
    
    # 텍스트를 SVG에 추가
    for item in data:
        text = item['text']
        x = item['x']
        y = item['y']
        font_size = item['font_size']
        font_family = item['font_family']
        fill = item['fill']
        
        dwg.add(dwg.text(text, insert=(x, y), font_size=font_size, font_family=font_family, fill=fill))
    
    # SVG 파일 저장
    dwg.save()

# 예시로 input.json 파일에서 데이터를 읽어와 output.svg 파일로 SVG로 변환
json_to_svg('input.json', 'output.svg')



<template>
  <div>
    <!-- SVG를 표시할 영역 -->
    <svg width="400" height="400">
      <!-- 텍스트를 표시할 위치에 v-for 디렉티브를 사용하여 반복적으로 추가 -->
      <text v-for="(item, index) in jsonData" :key="index" :x="item.x" :y="item.y" :font-size="item.font_size" :fill="item.fill">
        {{ item.text }}
      </text>
    </svg>
  </div>
</template>

<script>
export default {
  data() {
    return {
      jsonData: null // JSON 데이터를 저장할 변수
    };
  },
  mounted() {
    // JSON 파일을 가져와 jsonData 변수에 할당하는 비동기 함수 호출
    this.loadJSONData();
  },
  methods: {
    async loadJSONData() {
      try {
        // JSON 파일을 가져오는 비동기 요청
        const response = await fetch('config.json');
        // JSON 데이터를 읽어와 jsonData 변수에 할당
        this.jsonData = await response.json();
      } catch (error) {
        console.error('Error fetching JSON data:', error);
      }
    }
  }
};
</script>



<template>
  <div class="nav-bottom">
    <div class="search-icon">
      <svg viewBox="0 0 24 24" role="presentation" style="width: 1.5rem; height: 1.5rem;">
        <path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z"></path>
      </svg>
    </div>
    <input id="searchInput" placeholder="Search 7447 Icons..." type="text" class="search-input" v-model="searchText">
    <div class="container">
      <div v-for="icon in filteredIcons" :key="icon.name" class="icon">
        <svg role="presentation" :class="iconClass" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path :d="icon.value"></path>
        </svg>
        <span>{{ icon.name }}</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';

// 아이콘 데이터
const icons = [
  { name: 'icon1', value: '...' },
  { name: 'icon2', value: '...' },
  // 아이콘 데이터 계속...
];

// 검색어 상태
const searchText = ref('');

// 검색된 아이콘 계산된 속성
const filteredIcons = computed(() => {
  const lowercaseSearchText = searchText.value.toLowerCase();
  return icons.filter(icon => icon.name.toLowerCase().includes(lowercaseSearchText));
});

// 아이콘 클래스 계산된 속성 (필요에 따라 추가)
const iconClass = '';

</script>
