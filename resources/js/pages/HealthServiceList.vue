<template>
	<v-container>
		<v-layout class="my-3">
			<v-flex xs12 text-xs-center>
				<span class="display-2">Helsetjenester i Nærheten</span>
			</v-flex>
		</v-layout>

		<v-layout class="my-3">
			<v-flex xs12 text-xs-center>
				<span class="">Velg helsetjeneste for detaljert veibeskrivelse</span>
			</v-flex>
		</v-layout>

		<v-layout v-if="loadState === 1" class="my-3">
			<v-flex xs12 text-xs-center>
				<v-progress-circular 
					indeterminate 
					:size="70" 
					:width="7" 
					color="primary">
				</v-progress-circular>
			</v-flex>
		</v-layout>

		<v-layout v-if="loadState === 1" class="my-3 mb-5">
			<v-flex xs12 text-xs-center>
				<span class="">Laster helsetjenester i nærheten...</span>
			</v-flex>
		</v-layout>

		<v-card v-if="loadState === 2">
			<v-card-text class="pa-0">
				<v-list dense three-line class="ma-0 pa-0">
			        <div v-for="(service, index) in sortedServices" :key="service.OrganizationNumber">
	
			            <v-list-tile @click="serviceSelected(index)">
	
			        	    <v-list-tile-avatar
			        	    	v-if="!smallScreen"
	                            class="mt-1"
	                            :tile="true">
			        	        <img src="redcross.png"/>
			        	    </v-list-tile-avatar>
			        	    
			        	    <v-list-tile-content>
			        	        <v-list-tile-title class="">{{index + 1}}. {{ service.DisplayName }}</v-list-tile-title>
			        	        <v-list-tile-sub-title class="">
			        	        	<v-icon color="">place</v-icon>
			        	        	{{ service.geoAddress }}
			        	        </v-list-tile-sub-title>
			        	        <v-list-tile-sub-title class="">
			        	        	<v-icon color="">phone</v-icon>
			        	    		{{ service.Phone }}
			        	        </v-list-tile-sub-title>
			        	    </v-list-tile-content>
			        	    
			        	    <v-list-tile-action>
			        	    	<v-list-tile-action-text>
			        	    		{{ service.geoDistance.text }}
			        	    	</v-list-tile-action-text>
			        	    	<v-list-tile-action-text>
			        	    		<v-icon color="">
			        	    			directions_car
			        	    		</v-icon>
			        	    		{{ service.geoDuration.text }}
			        	    	</v-list-tile-action-text>
			        	    </v-list-tile-action>
	
			            </v-list-tile>
	
			            <v-divider inset></v-divider>
	
			        </div>
			    </v-list>
			    
			    <v-list dense v-if="servicesLength" class="endofcontent">
			    	 <v-list-tile>
						<v-list-tile-content>
							Siste Oppføring
						</v-list-tile-content>
					</v-list-tile>
			    </v-list>
	
			    <v-list v-if="!servicesLength" class="endofcontent">
			    	 <v-list-tile>
						<v-list-tile-content>
							{{ emptyText }}
						</v-list-tile-content>
					</v-list-tile>
			    </v-list>
	
			</v-card-text>
		</v-card>

		<v-layout v-if="loadState === 3" class="my-3">
			<v-flex xs12>
				<v-alert 
					class="mx-1"
					:value="true" 
					type="error">
					Beklager, men det har skjedd en feil under innlastingen.
				</v-alert>
			</v-flex>
		</v-layout>

		<v-layout>
			<v-flex xs12 text-xs-center>
				<v-btn 
					color="info"
					large
					block
					router
					to="/">
					Nytt Søk
				</v-btn>
			</v-flex>
		</v-layout>

		<Directions
			v-if="showDirections"
			:origin="{ latitude: latitude, longitude: longitude }"
			:service="selectedService"
			@close="showDirections = false">
		</Directions>

	</v-container>
</template>

<script>
	import Directions from './Directions.vue';

	export default{
		components:{
			Directions
		},
		data(){
			return{
				smallScreen: false,
				loadState: 0,
				// 0 Init
				// 1 Loading started
				// 2 Loading successful
				// 3 Loading error

				services: [],
				sortedServices: [],
				length: 10,
				latitude: 59.931,
				longitude: 10.318,
				emptyText: 'Listen er tom',
				showDirections: false,
				selectedService: null,
				distances: null
			}
		},
		computed:{
			servicesLength(){
				return this.services.length;
			}
		},
		methods:{
			serviceSelected(index){

				this.selectedService = this.services[index];
				this.showDirections = true;

				console.log(index);
				/*
				this.$router.push({
					name: 'Directions',
					params: {
						latitude: this.latitude,
						longitude: this.longitude
					}
				});
				*/
			},
			getHealthServices(){
				// Load health services from API
				this.loadState = 1;

				axios.get('http://data.helsenorge.no/healthservices?$top=' + this.length + '&latitude=' + this.latitude + '&longitude=' + this.longitude)
					.then(response => {
						console.log(response.data);
						// Loading successful
						this.loadState = 2;
						this.services = response.data;
							
						this.calculateDistances();

					})
					.catch(error => {
						// Loading error
						this.loadState = 3;
						console.log(error);
					});
			},
			calculateDistances(){
				var self = this;

				// Build destination coordinate array from collected services
				var destinationArray = [];
				for(var i = 0; i < this.services.length; i++){
					destinationArray.push({
						lat: this.services[i].Latitude,
						lng: this.services[i].Longitude
					});
				}

				console.log(destinationArray);


				// Calculate distances with a single origin and multiple destinations
		    	this.$distanceService.getDistanceMatrix({
	        		origins: [{lat: self.latitude, lng: self.longitude}],
	        		destinations: destinationArray,
	        		travelMode: 'DRIVING',
	        		unitSystem: google.maps.UnitSystem.METRIC,
	        		avoidHighways: false,
	        		avoidTolls: false
	        	}, 
	        	function(response, status) {
			        if (status !== 'OK') {
			        	alert('Error was: ' + status);
			        } else {

			        	console.log(response);

			        	// Add calculated distances and resolved addresses to existing service array
			        	for(var i = 0; i < self.services.length; i++){
			        		self.services[i].geoAddress = response.destinationAddresses[i];
			        		self.services[i].geoDistance = response.rows[0].elements[i].distance;
			        		self.services[i].geoDuration = response.rows[0].elements[i].duration;
			        	}

			        	self.sortedServices = self.services;

			        	console.log(self.services);

			        }
			    });
			},
			sortArray(){

			},
			addressLookup(latitude, longitude){
				var self = this;
			
				var latlng = {
					lat: parseFloat(latitude), 
					lng: parseFloat(longitude)
				};
	
	            this.$geocoder.geocode({'location': latlng }, function(results, status){
	                // At least one good address is returned
	                if (status === 'OK') {
	    	            // Get best match
	    	            self.address = results[0];
	    	            self.$emit('addressLookup', self.address);
	                } else if(status === 'ZERO_RESULTS'){
	                	// No matches found
	                	self.address = null;
	                } else {
	                	// Error
	                	window.alert('Geocoder failed due to: ' + status);
	                }
	            });
			}
		},
		created(){
			this.$distanceService = new google.maps.DistanceMatrixService;
			this.$geocoder = new google.maps.Geocoder;

			this.latitude = this.$route.params.latitude;
			this.longitude = this.$route.params.longitude;

			this.getHealthServices();
		}
	}
</script>

<style scoped>

</style>