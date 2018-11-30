<template>
	<Modal
		:show="true"
	    title="Veibeskrivelse"
	    @close="goBack">
		<v-container fluid class="pa-0">
	
			<v-layout justify-center class="">
				<v-flex xs12>
					<div id="map" :style="mapStyle"></div>
				</v-flex>
			</v-layout>

			<v-layout class="">
				<v-flex xs12>
					<v-card>
						<v-card-text>
							<v-layout wrap>
								<v-flex xs12 sm6>
									<v-icon color="red darken-1">place</v-icon>
									<span class="my-subtitle">{{ service.DisplayName }} </span>
								</v-flex>
								<v-flex xs6 sm3>
									<v-icon color="black">arrow_right_alt</v-icon>
									<span class="">{{ service.geoDistance.text }}</span>
								</v-flex>
								<v-flex xs6 sm3>
									<v-icon color="black" class="mr-0 pr-0">directions_car</v-icon>
									<span class="">{{ service.geoDuration.text }}</span>
								</v-flex>
							</v-layout>
						</v-card-text>
					</v-card>
				</v-flex>
			</v-layout>
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

			}
		},
		computed:{
			breakpoint(){
				return this.$vuetify.breakpoint;
			},
			mapStyle(){
				var mapHeight;

				if(this.breakpoint.xsOnly){
					mapHeight = this.breakpoint.height - 56 - 85;
				} else {
					mapHeight = this.breakpoint.height - 64 - 59;
				}

				return "width: 100%; height: " + mapHeight + "px; margin: 0 auto; background: gray;";
			}
		},
		methods:{
			calculateAndDisplayRoute() {
				var self = this;

        		this.$directionsService.route({
        			origin: { lat: this.origin.latitude, lng: this.origin.longitude },
        			destination: { lat: this.service.Latitude, lng: this.service.Longitude },
        			travelMode: 'DRIVING'
        		}, function(response, status) {
        		  	if (status === 'OK') {
        		    	self.$directionsDisplay.setDirections(response);
        			} else {
        				window.alert('Directions request failed due to ' + status);
        			}
        		});
      		},
			goBack(){
				this.$emit('close');
			}
		},
		mounted(){
			this.$directionsService = new google.maps.DirectionsService;
			this.$directionsDisplay = new google.maps.DirectionsRenderer;

			// Create map object
			this.$map = new google.maps.Map(document.getElementById('map'), {
	        	center: {
	        		lat: this.origin.latitude, 
	        		lng: this.origin.longitude
	        	},
	        	zoom: 7
	      	});
	      	this.$directionsDisplay.setMap(this.$map);
			this.calculateAndDisplayRoute();
		}
	}
</script>

<style scoped>
	.my-subtitle{
		font-size: 1.2em;
		font-weight: 400;
	}
</style>