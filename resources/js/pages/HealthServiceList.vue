<template>
	<div>
	<v-container class="pa-0">
		<v-layout 
			justify-center 
			:class="breakpoint.xsOnly ? null : 'mt-3'">
			<v-flex xs12 lg8 text-xs-center>
				<v-card>
					<v-card-text>
						<v-layout>
							<v-flex>
								<span 
									:class="breakpoint.xsOnly ? 'display-1' : 'display-2'">
									10 Nærmeste Helsetjenester
								</span>
							</v-flex>
						</v-layout>
						<v-layout>
							<v-flex>
								<span class="">Trykk på helsetjeneste for veibeskrivelse</span>
							</v-flex>
						</v-layout>	
					</v-card-text>
				</v-card>
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

		<v-layout v-if="loadState === 1" class="mb-5">
			<v-flex xs12 text-xs-center>
				<span class="">Laster helsetjenester...</span>
			</v-flex>
		</v-layout>
		
		<v-layout justify-center>
			<v-flex xs12 lg8>
				<v-card v-if="loadState === 2">
					<v-card-text class="pa-0">
						<v-list dense three-line class="ma-0 pa-0">
					        <div v-for="(service, index) in services" :key="service.OrganizationNumber">
			
					            <v-list-tile @click="serviceSelected(index)">
			
					        	    <v-list-tile-avatar
					        	    	v-if="!breakpoint.xsOnly"
			                            class="mt-1"
			                            :tile="true">
					        	        <img src="redcross.png"/>
					        	    </v-list-tile-avatar>
					        	    
					        	    <v-list-tile-content>
					        	        <v-list-tile-title class="my-subtitle">
					        	        	{{index + 1}}. {{ service.DisplayName }}
					        	        </v-list-tile-title>
					        	        <v-list-tile-sub-title class="">
					        	        	
					        	        	{{ service.geoAddress }}
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
					        	    	<v-list-tile-action-text>
					        	    		<v-icon color="">
					        	    			phone
					        	    		</v-icon>
					        	    		{{ service.Phone }}
					        	    	</v-list-tile-action-text>
					        	    </v-list-tile-action>
			
					            </v-list-tile>
			
					            <v-divider
					            	:inset="!breakpoint.xsOnly">
					            </v-divider>
			
					        </div>
					    </v-list>
					    
					    <v-list dense v-if="services.length" class="endofcontent">
					    	 <v-list-tile text-xs-center>
								<v-list-tile-content text-xs-center>
									<span class="">Siste Oppføring</span>					
								</v-list-tile-content>
							</v-list-tile>
					    </v-list>
			
					    <v-list v-if="!services.length" class="endofcontent">
					    	 <v-list-tile>
								<v-list-tile-content>
									Listen er tom
								</v-list-tile-content>
							</v-list-tile>
					    </v-list>
			
					</v-card-text>
				</v-card>
			</v-flex>
		</v-layout>

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

		<v-layout justify-center>
			<v-flex xs12 lg8 class="mx-1">
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

	</v-container>

	<Directions
		v-if="showDirectionModal"
		:origin="{ latitude: originLatitude, longitude: originLongitude }"
		:service="selectedService"
		@close="showDirectionModal = false">
	</Directions>

	</div>

</template>

<script>
	import Directions from './Directions.vue';

	export default{
		components:{
			Directions
		},
		data(){
			return{
				loadState: 0,
				// 0 Init
				// 1 Loading started
				// 2 Loading successful
				// 3 Loading error

				pulledServices: 10,
				services: [],
				originLatitude: 0,
				originLongitude: 0,
				
				selectedService: null,
				showDirectionModal: false
			}
		},
		computed:{
			breakpoint(){
				return this.$vuetify.breakpoint;
			}
		},
		methods:{
			serviceSelected(index){
				this.selectedService = this.services[index];
				this.showDirectionModal = true;
			},
			getHealthServices(){
				// Load health services from API
				this.loadState = 1;

				// Hack to prevent CORS policy issues
				const proxyUrl = "https://cors-anywhere.herokuapp.com/";
				const apiUrl = "http://data.helsenorge.no/healthservices?$top="

				axios.get(proxyUrl + apiUrl + this.pulledServices + '&latitude=' + this.originLatitude + '&longitude=' + this.originLongitude)
					.then(response => {
						// Loading successful
						this.services = response.data;							
						// Calculate travel distances
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

				// Calculate distances with a single origin and multiple destinations
		    	this.$distanceService.getDistanceMatrix({
	        		origins: [{lat: self.originLatitude, lng: self.originLongitude}],
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

			        	// Add calculated distances and resolved addresses to existing service array
			        	for(var i = 0; i < self.services.length; i++){
			        		self.services[i].geoAddress = response.destinationAddresses[i];
			        		self.services[i].geoDistance = response.rows[0].elements[i].distance;
			        		self.services[i].geoDuration = response.rows[0].elements[i].duration;
			        	}

			        	// All data is collected and the services can be sorted
			        	self.sortServices();

			        }
			    });
			},
			sortServices(){
				// Sort by duration (shortest duration first)
				this.services.sort( function(a, b){
					return ( 
						( a.geoDuration.value === b.geoDuration.value) ? 0 : 
						( ( a.geoDuration.value > b.geoDuration.value) ? 1 : -1) 
					);
				});

				// End of promise chain. Set loading OK
				this.loadState = 2;
			}
		},
		created(){
			this.$distanceService = new google.maps.DistanceMatrixService;
			this.$geocoder = new google.maps.Geocoder;

			this.originLatitude = parseFloat(this.$route.params.latitude);
			this.originLongitude = parseFloat(this.$route.params.longitude);

			this.getHealthServices();
		}
	}
</script>

<style scoped>
	.my-subtitle {
		font-size: 1.0em;
		font-weight: bold;
	}
	.endofcontent {
		display: flex;
		justify-content: center;
	}
</style>