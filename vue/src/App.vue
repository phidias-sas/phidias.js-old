<template>

  <div id="app">

    <nav>
      <router-link to="/foo">Foo</router-link>
      <router-link to="/bar">Bar</router-link>
      <router-link to="/Inbox">Inbox</router-link>
    </nav>

    <div id="main-view" :class="'move-'+transitionDirection">
      <transition name="fade">
        <keep-alive> <!-- this prevents components from being re-created on each navigation hit -->
          <router-view></router-view>
        </keep-alive>
      </transition>
    </div>

  </div>

</template>


<script>
export default {
  data () {
    return {
      msg: 'Hello Vue !',
      transitionDirection: 'left'
    }
  },

  watch: {
    $route (to, from) {
      this.transitionDirection = (to.meta.order - from.meta.order) > 0 ? 'left' : 'right'; 
    }
  }
}
</script>


<style lang="sass" scoped>

$transition-duration:     .420s;
$transition-displacement: 420px;

nav {
  text-align: center;

  & > a {
    display: inline-block;
    margin: 0.5em;
    text-decoration: none;
    padding: 12px 24px;
    border-radius: 4px;
    color: #444;
    background: rgba(0, 0, 0, 0.1);
    font-weight: bold;

    transition: background $transition-duration, 
                color $transition-duration;

    &.router-link-active {
      background: #4fc08d;
      color: #fff;
    }

  }
}

#main-view {
  position: relative;

  margin: auto;
  max-width: 1048px;

}

.fade-enter-active, .fade-leave-active {
  transition: transform $transition-duration, 
              opacity $transition-duration;

  position: absolute;
  max-width: 1048px;
}

.fade-enter, .fade-leave-active {
  opacity: 0;
}

.move-left {
  .fade-enter {
    transform: translate3d($transition-displacement, 0, 0);
  }

  .fade-leave-active {
    transform: translate3d(-$transition-displacement, 0, 0);
  }
}

.move-right {
  .fade-enter {
    transform: translate3d(-$transition-displacement, 0, 0);
  }

  .fade-leave-active {
    transform: translate3d($transition-displacement, 0, 0);
  }
}


</style>
