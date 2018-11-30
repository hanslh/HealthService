<template>
	<Modal
		:show="true"
	    title="Veibeskrivelse"
	    @close="goBack">
		<v-container class="mt-5">
			<v-layout>
				<v-flex xs12 text-xs-center>
					<span class="display-2">Veibeskrivelse</span>
				</v-flex>
			</v-layout>
	
			<v-layout class="my-3">
				<v-flex xs12>
					<GoogleMap
						:editMarker="false"
						@selected="getCoordinates"
						@addressLookup="getAddress">
					</GoogleMap>
				</v-flex>
			</v-layout>

			{{ service.Name }}
	
		</v-container>
	</Modal>
</template>

<script>
	import Modal from '../components/Modal.vue';
	import GoogleMap from '../components/GoogleMap.vue';

	export default{
		components:{
			GoogleMap,
			Modal
		},
		props:{
			origin:{
				type: Object,
				default: {}
			},
			service:{
				type: Object,
				default: {}
			}
		},
		data(){
			return{
				showModal: true
			}
		},
		methods:{
			getCoordinates(){

			},
			getAddress(){

			},
			goBack(){
				this.showModal = false;
				this.$emit('close');
			}
		}
	}
</script>

<style scoped>

</style>