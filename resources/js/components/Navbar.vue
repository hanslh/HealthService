<template>
	<v-toolbar 
		dark 
		color="primary">
		
		<router-link to="/" tag="span" style="cursor: pointer">
			<v-icon large dark>local_hospital</v-icon>
		</router-link>
	    <v-toolbar-title class="white--text ml-2">
	    	<router-link to="/" tag="span" style="cursor: pointer">
	    		{{ appName }}
	    	</router-link>
	    </v-toolbar-title>
	

	</v-toolbar>
</template>

<script>
	export default{
		computed:{
			appName(){
				return 'HelseService';
			}
		}
	}
</script>

<style scoped>

</style>