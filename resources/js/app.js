/**
 * First we will load all of this project's JavaScript dependencies which
 * includes Vue and other libraries. It is a great starting point when
 * building robust, powerful web applications using Vue and Laravel.
 */
require('./bootstrap');
window.Vue = require('vue');

//Config Vue Router
import VueRouter from 'vue-router'
Vue.use(VueRouter)
let routes = [
    { path: '/home', component:  require('./components/Dashboard.vue').default},
    { path: '/dashboard', component:  require('./components/Dashboard.vue').default},
    { path: '/users', component: require('./components/Users.vue').default },
    { path: '/profile', component: require('./components/Profile.vue').default },
    { path: '/developer', component: require('./components/Developer.vue').default },
    { path: '*', component: require('./components/404.vue').default },
]
const router = new VueRouter({
    mode: 'history',
    routes // short for `routes: routes`
})

//Config Vue Progress Bar
import VueProgressBar from 'vue-progressbar'
Vue.use(VueProgressBar, {
    color: 'rgb(143, 255, 199)',
    failedColor: 'red',
    height: '3px'
})

//Config Momentjs filters
import moment from 'moment'
Vue.filter('myDate', function(created) {
    return moment(created).format('MMMM Do YYYY');
});

//Config SweetAlert
import Swal from 'sweetalert2'
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 2000,
    timerProgressBar: true,
    onOpen: (toast) => {
      toast.addEventListener('mouseenter', Swal.stopTimer)
      toast.addEventListener('mouseleave', Swal.resumeTimer)
    }
})
window.Swal = Swal;
window.Toast = Toast;

//Config VFrom 
import { Form, HasError, AlertError } from 'vform'
window.Form = Form;
Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)

//Declare Passport Vue Components 
Vue.component(
    'passport-clients',
    require('./components/passport/Clients.vue').default
);
Vue.component(
    'passport-authorized-clients',
    require('./components/passport/AuthorizedClients.vue').default
);
Vue.component(
    'passport-personal-access-tokens',
    require('./components/passport/PersonalAccessTokens.vue').default
);

//Add Component communication 
window.Fire = new Vue();

//Add Laravel Pagination component 
Vue.component('pagination', require('laravel-vue-pagination'));

/**
 * Next, we will create a fresh Vue application instance and attach it to
 * the page. Then, you may begin adding components to this application
 * or customize the JavaScript scaffolding to fit your unique needs.
 */

const app = new Vue({
    el: '#app',
    router,
    data: {
        s: ""
    },
    methods: {
        search() {
            Fire.$emit('searching')
        }
    }
});
