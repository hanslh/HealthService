<template>
	<div id="map" style="width: 100%; height: 600px; margin: 0 auto; background: gray;"></div>
</template>

<script>
	export default{
		props:{
			editMarker:{
				type: Boolean,
				default: false
			}
		},
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
				address: null
			}
		},
		watch:{
			mousePosition:{
				handler(val){
					//console.log(this.mousePosition.latitude + ', ' + this.mousePosition.longitude);
				},
				deep: true
			},
			mouseClick:{
				handler(val){
					if(this.editMarker){
						this.clearMarkers();
						this.addMarker(this.mouseClick.latitude,this.mouseClick.longitude);
						this.addressLookup(this.mouseClick.latitude,this.mouseClick.longitude);
						this.$emit('selected', { 
							latitude: this.mouseClick.latitude,
							longitude: this.mouseClick.longitude
						});
					}
					
				},
				deep: true
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

				// Collect all placed markers in an array.
    			this.markerArray.push(marker);
			},
			clearMarkers(){
				for( var i = 0; i < this.markerArray.length; i++ ){
    				this.markerArray[i].setMap( null );
  				}
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

             google.maps.event.addListener(this.$map,'mousemove',function(event) {
                 self.mousePosition.latitude = event.latLng.lat();
                 self.mousePosition.longitude = event.latLng.lng();
             });
	
			
	      	this.$geocoder = new google.maps.Geocoder;
		}
	}
</script>

<style scoped>
	#map :hover{
		cursor: pointer
	}
</style>