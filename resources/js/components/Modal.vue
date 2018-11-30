<template>
	
	<v-dialog 
		v-model="show"
	    fullscreen 
	    transition="dialog-bottom-transition" 
	    :overlay="false"
	    hide-overlay>
		
		<v-toolbar 
			fixed
			dark 
			color="primary">
			<v-layout 
				fill-height 
				align-center>
          		<v-flex xs4>
          			<v-toolbar-title v-on:click="close()" class="my-link">
          				<v-icon>arrow_back</v-icon>
          				Tilbake
          			</v-toolbar-title>
          		</v-flex>
				<v-flex xs4 text-xs-center>
					<span class="my-subtitle">{{ title }}</span>
				</v-flex>
			</v-layout>
        </v-toolbar>

		<div 
			:class="modalClass">
			<v-card 
				flat
				:style="viewPortHeightString">
				<v-layout
					justify-center>
					<v-flex xs12>
						<slot>
						</slot>
					</v-flex>
				</v-layout>
			</v-card>
		</div>

    </v-dialog>

</template>

<script>
 	export default {
 		props: {
 			show: {
 				type: Boolean,
 				default: false
 			},
 			title: {
 				type: String,
 				default: '',
 				required: false
 			},
 			id: {
 				type: Number,
 				required: false
 			}
 		},
 		data(){
 			return{
 				slotHeight: 0,
 				slotOverflow: false
 			}
 		},
 		computed:{
 			breakpoint(){
				return this.$vuetify.breakpoint;
			},
			viewPortHeight(){
				if(this.breakpoint.width < 730){
					return this.breakpoint.height - 56;
				} else if(this.breakpoint.width < 960){
					return this.breakpoint.height - 48;
				} else {
					return this.breakpoint.height - 64;
				}
			},
			viewPortHeightString(){
				return 'height: ' + this.viewPortHeight + 'px;';
				//return 'height: ' + this.breakpoint.height + 'px;';
			},
			moduleHeight(){
				if(this.breakpoint.xsOnly){
					// Fill screen
					return this.viewPortHeight;
				} else {
					return this.breakpoint.height - 200;
				}
				
			},
			modalClass(){
				if(this.breakpoint.width < 730){
					return 'touch-scrolling toolbar-margin-56';
				} else if(this.breakpoint.width < 960){
					return 'touch-scrolling toolbar-margin-48';
				} else {
					return 'touch-scrolling toolbar-margin-64';
				}				
			}
 		},
    	methods: {
    		close() {
    			this.$emit('close');
    		}
    	}
  	}
</script>

<style scoped>
	.my-link:hover {
		cursor: pointer;
	}
	
	.content-center {
		display: flex;
		justify-content: center;
	}

	.content-right {
		display: flex;
		justify-content: right;
	}

	.my-title {
		font-size: 2.5em;
		font-weight: 700;
	}

	.my-subtitle {
		font-size: 1.4em;
		font-weight: 600;
	}

	.my-content {
		font-size: 1.2em;
		font-weight: 400;
	}
</style>