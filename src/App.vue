<template>
  <div id="app" class="container container--nav">
    <Puppets msg="Amazing app"/>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Puppets from './components/Puppets.vue';

@Component({
  components: {
    Puppets,
  },
})
export default class App extends Vue {}
</script>

<style>
@import url('./assets/sundog.css');
@import url('./assets/sundog-grid.css');
@import url('./assets/patterns.css');
@import url('./assets/sundog-navigation.css');
#app {  
}
</style>
