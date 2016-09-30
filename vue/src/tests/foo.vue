<template>
    <h1>Foo</h1>
</template>

<script>
export default {
  data () {
    return {
      msg: 'Hello Foo !'
    }
  },

  beforeRouteEnter (to, from, next) {
    console.log("About to FOO!");
    next();
  },

  created () {
      console.log("Foo has been created", this.msg);
      this.msg = "Updated";
  }
}
</script>