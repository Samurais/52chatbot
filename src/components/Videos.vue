<template>
  <div class="videos">
    <h1 class="ui teal huge header">Chatbot Master</h1>
    <h2 class="ui grey small header">Noble is not born, but trained.</h2>
      <div class="social-videos">
        <h4>SuperScript: A dialog system and bot engine</h4> 
        <p><a href="http://www.leiphone.com/news/201704/JvBW78wfyvcfB4xW.html" target="_blank">@Leiphone Talk</a> / Apr. 7, 2017</p>
        <iframe frameborder="0" width="320" height="249" src="https://v.qq.com/iframe/player.html?vid=u0392y7e4xo&tiny=0&auto=0"
          allowfullscreen></iframe>
        <br><br>

        <h4>Get started with DeepLearning and TensorFlow</h4> 
        <p><a href="https://github.com/rockq-org/chatbot-master-core" target="_blank">@Chatbot Master</a> / Feb. 26, 2017</p>
        <iframe frameborder="0" width="320" height="249" src="https://v.qq.com/iframe/player.html?vid=u0380c9l3qg&tiny=0&auto=0"
          allowfullscreen></iframe>
        <br><br>

        <h4>Artificial Intelligence and Chatbot</h4> 
        <p><a href="https://github.com/rockq-org/node-party" target="_blank">@NodeParty</a> / Jul. 23, 2016</p>
        <iframe frameborder="0" width="320" height="249" src="http://v.qq.com/iframe/player.html?vid=v0318almc1k&tiny=0&auto=0" allowfullscreen></iframe>
        <br><br>
      </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      posts: []
    }
  },
  methods: {
  },
  ready () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.ui.segment {
  max-width: 400px;
  margin: auto;
}
.ui.piled.segments {
  padding-bottom: 4em;
}

img {
  min-height: 290px;
}

.social-videos {
    text-align:center;
    width:100%;
}
</style>
