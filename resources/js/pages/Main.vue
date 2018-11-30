<template>
	<v-container class="mt-5">
		<v-layout>
			<v-flex xs12 text-xs-center>
				<span class="display-2">Lokaliser Nærmeste Helsetjeneste</span>
			</v-flex>
		</v-layout>

		<v-layout>
			<v-flex xs12 text-xs-center>
				<span class="">Denne tjenesten lister opp nærmeste helsetjenester fra angitt posisjon på kartet</span>
			</v-flex>
		</v-layout>

		<v-layout justify-center class="my-3">
			<v-flex xs12 lg8>
				<GoogleMap
					:editMarker="true"
					@selected="getCoordinates"
					@addressLookup="getAddress">
				</GoogleMap>
			</v-flex>
		</v-layout>

		<v-layout v-if="!positionSet">
			<v-flex xs12 text-xs-center>
				<span class="display-1">Angi din egen posisjon på kartet</span>
			</v-flex>
		</v-layout>

		<v-layout justify-center>
			<v-flex xs12 lg8>
				<v-card v-if="positionSet">
					<v-card-text>
						<v-layout class="mb-3">
							<v-flex xs12>
								<span class="my-subtitle">Valgt posisjon:</span>
							</v-flex>
						</v-layout>
				
						<v-layout class="my-1">
							<v-flex xs12>
								<v-icon 
									class="ml-4"
									color="info">
									my_location
								</v-icon>
								<span class="my-subtitle">lat: {{ latitude }}, lng: {{ longitude }}</span>
							</v-flex>
						</v-layout>
				
						<v-layout class="my-1">
							<v-flex xs12>
								<v-icon 
									class="ml-4"
									color="red darken-1">
									place
								</v-icon>
								<span class="my-subtitle">{{ address.formatted_address }}</span>
							</v-flex>
						</v-layout>
				
						<v-layout
							class="mt-3"
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
	import GoogleMap from '../components/GoogleMap.vue';

	export default{
		components:{
			GoogleMap
		},
		data(){
			return{
				positionSet: false,
				latitude: 59.931,
				longitude: 10.318,
				address: {}
			}
		},
		methods:{
			getCoordinates(coordinates){
				this.positionSet = true;

				this.latitude = coordinates.latitude;
				this.longitude = coordinates.longitude;
/*
				this.$router.push({ 
					name: 'HealthServiceList', 
					params: {
						latitude: coordinates.latitude,
						longitude: coordinates.longitude
					}
				});
*/
			},
			getAddress(address){
				if(address){
					this.address = address;
				} else {
					this.address.formatted_address = 'Ingen adresse funnet på disse koordinatene';
				}
			}
		}
	}
</script>

<style scoped>
	.my-subtitle{
		font-size: 1.2em;
		font-weight: 500;
	}
</style>