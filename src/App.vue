<template>
  <div id="content" :class="{'change-page':changePage}">
    <router-view class="v" :transition="effect" keep-alive></router-view>
  </div>
</template>

<script>
export default {
  data() {
    return {
      effect:'',
      changePage:false
    }
  },
  components: {

  },
  ready() {},
  methods: {}
}
</script>

<style lang="stylus">

</style>
