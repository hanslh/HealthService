/*
|--------------------------------------------------------------------------------------------
| routes.js
|--------------------------------------------------------------------------------------------
| Contains all of the routes for the application
*/

import Vue from 'vue';
import VueRouter from 'vue-router';

Vue.use(VueRouter);

/*
	Makes new VueRouter that we will use to run all of the routes for the app
*/
export default new VueRouter({

	base: '/',
	// Removes # from browser url
	//mode: 'history',

	routes: [
		/*
		|------------------------------------------------------------------------
		| Public routes
		|------------------------------------------------------------------------
		*/
		{
			path: '/',
			name: 'Main',
			component: Vue.component( 'Main', require('./pages/Main.vue'))
		},
		{
			path: '/healthservicelist?latitude=:latitude&longitude=:longitude',
			name: 'HealthServiceList',
			component: Vue.component( 'HealthServiceList', require('./pages/HealthServiceList.vue'))
		},
		{
			path: '/directions?latitude=:latitude&longitude=:longitude',
			name: 'Directions',
			component: Vue.component( 'Direction', require('./pages/Directions.vue'))
		},
		
	]

});