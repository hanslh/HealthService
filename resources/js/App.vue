<template>
	
	<v-app class="application--toolbar application--footer application--footer-fixed">

		<app-navbar></app-navbar>

		<main>
			<router-view></router-view>
		</main>

	</v-app>

</template>

<script>
	import Navbar from './components/Navbar.vue'

	export default {
		components: {
			'app-navbar': Navbar,
		},
		created(){
			//this.$router.push({ name: 'Main' });
		}

	}

</script>

<style>
	.toolbar-margin-48{
		margin-top: 48px !important;
	}
	.toolbar-margin-56{
		margin-top: 56px !important;
	}
	.toolbar-margin-64{
		margin-top: 64px !important;
	}
	.bottomnav-margin{
		margin-bottom: 60px !important; /* Overrides color for disabled fields */
	}
	.input-group .input-group__input :disabled{
		color: #616161 !important;
	}
	.dialog{
		z-index: inherit; /* Required for showing v-select items within a fullscreen dialog in Safari */
	}
	.menuable__content__active{ /* Another hack for showing v-select items within dialog on Safari when touch scrolling is enabled */
		z-index: 250!important;
	}
	.touch-scrolling{
		overflow-y: auto;
		-webkit-overflow-scrolling: touch;
	}
</style>