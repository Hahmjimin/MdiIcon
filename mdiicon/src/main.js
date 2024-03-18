/**
 * @module main
 * @description manager vue main 함수
 */

//Vue3 모듈
import { createApp } from 'vue'

//Quasar Framework 모듈
import { Quasar } from 'quasar'

//Quasar Framework CSS 모듈
import 'quasar/dist/quasar.css'

// //Quasar Framework 언어 모듈
// import lang from 'quasar/lang/ko-KR.js'

//앱 화면 모듈
import App from '@/layout/App.vue'

createApp(App).use(Quasar).mount('#app');
