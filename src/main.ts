import Vue from 'vue'
import App from './App.vue'
import EloquentPlugin from "@/eloquent";

Vue.config.productionTip = false;
Vue.use(EloquentPlugin);


new Vue({
    render: h => h(App),
}).$mount('#app')
