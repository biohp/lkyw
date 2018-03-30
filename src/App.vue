<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {
      
    }
  },
  created() {
  	this.$Message.config({
	    top: 70,
	    duration: 2
	  });
  }
}
</script>

<style>
ul,li{
	list-style-type: none;
}
</style>
