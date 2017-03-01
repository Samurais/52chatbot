<template>
  <div class="postsList">
    <template v-if="!$loadingRouteData">
    <h1 class="ui teal huge header">Chatbot Master Core</h1>
    <h2 class="ui grey small header">bot.reply("Hello World.")</h2>

    <div class="ui segment">
    <a class="ui label" v-for="keyvalue of archive" @click="scrollIntoView(keyvalue[0])">{{ keyvalue[0] }} </a>
    </div>

    <template v-for="keyvalue of archive">
    <h3 class="ui cyan year header" :id="keyvalue[0]">{{ keyvalue[0] }}</h3>
    <div class="ui cards">
      <div class="ui card" v-for="post in keyvalue[1]">
        <!--a class="ui image" v-link="{
          path: '/' + post.category + '/' + post.year + '/' + post.month + '/' + post.day + '/' + (post._title ? post._title + '/' : '')
        }">
          <img :src="'http://lorempixel.com/400/200?' + Math.random()">
        </a-->
        <div class="content">
          <a class="header" v-link="{
            path: '/' + post.category + '/' + post.year + '/' + post.month + '/' + post.day + '/' + (post._title ? post._title + '/' : '')
          }">
            {{post.title}}
          </a>
          <div class="meta">
            <span>
              {{ post.year }}-{{ post.month }}-{{ post.day }}
            </span>
            <i class="heartbeat icon"></i>
            <a>
              {{ post.category }}
            </a>
          </div>
          <div class="description">
            <span>
              {{ post.excerpt }}
            </span>
          </div>
        </div>
        <div class="extra content">
          <a v-for="tag in post.tags" class="ui tag label">
            {{ tag }}
          </a>
        </div>
      </div> 
    </div>
    </template>
    </template>
    <div v-if="$loadingRouteData" class="ui myloading segment">
      <div class="ui active loader"></div>
    </div>
  </div>
</template>

<script>
function extractArchive (posts) {
  let archive = {}
  for (let post of posts) {
    if (!(post.year in archive)) {
      archive[post.year] = []
    }
    archive[post.year].push(post)
  }
  let ret = []
  for (let year in archive) {
    ret.push([year, archive[year]])
  }
  ret.sort((a, b) => parseInt(b[0]) > parseInt(a[0]) ? 1 : -1)
  return ret
}

export default {
  data () {
    return {
      // note: changing this line won't causes changes
      // with hot-reload because the reloaded component
      // preserves its current state and we are modifying
      // its initial state.
      archive: []
    }
  },
  methods: {
    scrollIntoView (year) {
      let target = document.getElementById(year)
      window.scrollTo(0, target.offsetTop - 30)
    }
  },
  route: {
    data (transition) {
      require.ensure('../posts/meta.json', (require) => {
        let posts = require('../posts/meta.json')
        let archive = extractArchive(posts)
        transition.next({
          archive
        })
      })
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
.ui.segment.myloading {
  padding: 3em 0;
}

ul, li {
  font-size: 1rem;
}

ul {
  list-style: none;
}

li {
  margin-left: 0;
}
</style>
