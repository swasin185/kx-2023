import 'primeflex/primeflex.css'
import 'primeicons/primeicons.css' //icons
import 'primevue/resources/primevue.min.css' //core css
// import 'primevue/resources/themes/bootstrap4-dark-blue/theme.css'
// import 'primevue/resources/themes/tailwind-light/theme.css'
// import 'primevue/resources/themes/nano/theme.css'
import 'primevue/resources/themes/soho-dark/theme.css'
// import 'primevue/resources/themes/fluent-light/theme.css'

import PrimeVue from 'primevue/config'
import { createApp } from 'vue'
import App from './App.vue'
import ToastService from 'primevue/toastservice';
import ConfirmationService from 'primevue/confirmationservice';

import './assets/main.css'

const app = createApp(App)
app.use(ToastService)
app.use(ConfirmationService);
app.use(PrimeVue);
app.mount('#app')
