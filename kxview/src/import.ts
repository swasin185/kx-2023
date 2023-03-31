// import Page component link to Client.MENU_ITEMS
import { defineAsyncComponent } from 'vue';

const Monty = defineAsyncComponent(() => import('./games/Monty.vue'))
const User = defineAsyncComponent(() => import('./pages/User.vue'))
const TestPanel = defineAsyncComponent(() => import('./pages/TestPanel.vue'))
const TestReport = defineAsyncComponent(() => import('./pages/TestReport.vue'))
const Permission = defineAsyncComponent(() => import('./pages/Permission.vue'))
const Mandelbrot = defineAsyncComponent(() => import('./games/Mandelbrot.vue'))
const TheMaze = defineAsyncComponent(() => import('./games/TheMaze.vue'))

export default {
    Monty, User, TestPanel, TestReport, Permission, Mandelbrot, TheMaze
}