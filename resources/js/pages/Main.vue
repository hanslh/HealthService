<template>
	<v-container fluid class="pa-0">
		<v-layout
			justify-center 
			:class="">
			<v-flex xs12 text-xs-center>
				<v-card>
					<v-card-text
						:class="breakpoint.smAndDown ? 'py-1' : 'py-3'">
						<v-layout>
							<v-flex>
								<span 
									:class="breakpoint.smAndDown ? 'my-title' : 'display-2'">
									Lokaliser Nærmeste Helsetjeneste
								</span>
							</v-flex>
						</v-layout>
						<v-layout>
							<v-flex>
								<span 
									:class="breakpoint.smAndDown ? 'my-content-sm' : null">
									Plott inn din posisjon på kartet
								</span>
							</v-flex>
						</v-layout>	
					</v-card-text>
				</v-card>
			</v-flex>
		</v-layout>

		<v-layout justify-center class="">
			<v-flex xs12>
				<div id="map" :style="mapStyle"></div>
				
			</v-flex>
		</v-layout>

		<v-layout justify-center>
			<v-flex xs12>
				<v-card v-if="positionSet">
					<v-card-text class="py-1">		
						<v-layout wrap class="my-1">
							<v-flex xs12 md6>
								<v-icon 
									class=""
									color="red darken-1">
									place
								</v-icon>
								<span class="my-subtitle">{{ address.formatted_address }}</span>
							</v-flex>
							<v-flex xs12 md6>
								<v-icon 
									class=""
									color="info">
									my_location
								</v-icon>
								<span class="my-subtitle">{{ latitude.toFixed(10) }}, {{ longitude.toFixed(10) }} [lat,lng]</span>
							</v-flex>
						</v-layout>
				
						<v-layout
							class="mt-1"
							justify-center>
							<v-flex xs12 text-xs-center>
								<v-btn 
									color="info"
									large
									block
									router
									:to="{ name: 'HealthServiceList', params: { 'latitude': latitude, 'longitude': longitude}}">
									Finn nærmeste helsetjeneste
								</v-btn>
							</v-flex>
						</v-layout>
					</v-card-text>
					
				</v-card>
			</v-flex>
		</v-layout>

	</v-container>
</template>

<script>
	export default{
		data(){
			return{
				initialZoom: 10,
				centerCoordinates: {
					latitude: 63.42868975991935,
    				longitude: 10.400892054389715
				},
				mousePosition: {
					latitude: 0,
					longitude: 0
				},
				mouseClick:{
					latitude: 0,
					longitude: 0
				},
				markerArray: [],
				positionSet: false,
				latitude: 59.931,
				longitude: 10.318,
				address: {}
			}
		},
		watch:{
			mouseClick:{
				handler(val){
					this.clearMarkers();
					this.addMarker(this.mouseClick.latitude,this.mouseClick.longitude);
					this.addressLookup(this.mouseClick.latitude,this.mouseClick.longitude);

					this.latitude = this.mouseClick.latitude;
					this.longitude = this.mouseClick.longitude;
					this.positionSet = true;
				},
				deep: true
			}
		},
		computed:{
			breakpoint(){
				return this.$vuetify.breakpoint;
			},
			mapStyle(){
				// Set height of map so total content always fill screen
				var toolbarHeigth;
				var topCardHeight;
				var bottomCardHeight;

				if(this.breakpoint.smAndDown){
					toolbarHeigth = 56;
					topCardHeight = 60;
					this.positionSet ? bottomCardHeight = 124 : bottomCardHeight = 0;
				} else {
					toolbarHeigth = 64;
					topCardHeight = 101;
					this.positionSet ? bottomCardHeight = 98 : bottomCardHeight = 0;
				}

				var mapHeight = this.breakpoint.height - toolbarHeigth - topCardHeight - bottomCardHeight;

				return "width: 100%; height: " + mapHeight + "px; margin: 0 auto; background: gray;";
			}
		},
		methods:{
			addMarker(latitude, longitude){
				var marker = new google.maps.Marker({
     				position: { 
     					lat: parseFloat( latitude ), 
     					lng: parseFloat( longitude )
     				},
     				map: this.$map
    			});

				// Collect all placed markers in an array. Required for clearMarkers function
    			this.markerArray.push(marker);
			},
			clearMarkers(){
				for( var i = 0; i < this.markerArray.length; i++ ){
    				this.markerArray[i].setMap( null );
  				}
			},
			// Get address from latitude and longitude coordinates
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
	                	self.address = 'Ingen adresse funnet på disse koordinatene';
	                } else {
	                	// Error
	                	window.alert('Geocoder failed due to: ' + status);
	                }
	            });
			}
		},
		mounted(){
			var self = this;

			// Create map object
			this.$map = new google.maps.Map(document.getElementById('map'), {
	        	center: {
	        		lat: this.centerCoordinates.latitude, 
	        		lng: this.centerCoordinates.longitude
	        	},
	        	zoom: this.initialZoom
	      	});

			// Add eventlisteners for mouse click and movement
	      	google.maps.event.addListener(this.$map,'click',function(event) {
                 self.mouseClick.latitude = event.latLng.lat();
                 self.mouseClick.longitude = event.latLng.lng();
             });
	
			// Create geoCoder object for address lookup
	      	this.$geocoder = new google.maps.Geocoder;
		}
	}
</script>

<style scoped>
	.my-title{
		font-size: 1.5em;
		font-weight: 500;
	}
	.my-subtitle{
		font-size: 1.0em;
		font-weight: 400;
	}
	.my-content-sm{
		font-size: 0.8em;
		font-weight: 400;
	}
	#map :hover{
		cursor: pointer
	}
</style>