webpackJsonp([6,4],{0:function(t,e,a){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}var s=a(265),i=o(s),r=a(264),n=o(r),c=a(257),l=o(c),u=a(258),d=o(u),v=a(261),p=o(v),f=a(260),h=o(f),g=a(259),m=o(g),y=a(262),_=o(y);i.default.use(n.default);var b=new n.default({hashbang:!1,history:!0,linkActiveClass:"active"});b.map({"/":{component:l.default,subRoutes:{"/home":{component:h.default},"/categories":{component:m.default},"/tags":{component:_.default},"/archives":{component:d.default},"/:category/:year/:month/:day/:title/":{component:p.default},"/:category/:year/:month/:day/":{component:p.default}}}}),b.redirect({"/":"/home"}),b.start(i.default.extend({}),"#app")},30:function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={data:function(){return{show:!1}},methods:{toggle:function(){this.show=!this.show}}}},31:function(t,e,a){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}function s(t){var e={},a=!0,o=!1,s=void 0;try{for(var i,n=(0,r.default)(t);!(a=(i=n.next()).done);a=!0){var c=i.value;c.year in e||(e[c.year]=[]),e[c.year].push(c)}}catch(t){o=!0,s=t}finally{try{!a&&n.return&&n.return()}finally{if(o)throw s}}var l=[];for(var u in e)l.push([u,e[u]]);return l.sort(function(t,e){return parseInt(e[0])>parseInt(t[0])?1:-1}),l}Object.defineProperty(e,"__esModule",{value:!0});var i=a(10),r=o(i);e.default={data:function(){return{archives:[],yearSelected:""}},methods:{select:function(t){this.$router.go({path:"/archives",query:{year:t}})}},computed:{yearArchive:function(){var t=this,e=this.archives.find(function(e){return e[0]===t.yearSelected});return e?e[1]:[]}},route:{data:function(t){var e=t.to.query.year;a.e(0,function(o){var i=a(3),r=s(i);e||(e=r[0][0]),t.next({archives:r,yearSelected:e})})}}}},32:function(t,e,a){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}function s(t){var e={},a=!0,o=!1,s=void 0;try{for(var i,r=(0,c.default)(t);!(a=(i=r.next()).done);a=!0){var n=i.value;n.category in e||(e[n.category]=[]),e[n.category].push(n)}}catch(t){o=!0,s=t}finally{try{!a&&r.return&&r.return()}finally{if(o)throw s}}return e}Object.defineProperty(e,"__esModule",{value:!0});var i=a(18),r=o(i),n=a(10),c=o(n);e.default={data:function(){return{categories:[],categorySelected:""}},methods:{select:function(t){this.$router.go({path:"/categories",query:{category:t}})}},route:{data:function(t){var e=t.to.query.category;a.e(0,function(o){var i=a(3),n=s(i);e||(e=(0,r.default)(n)[0]),t.next({categories:n,categorySelected:e})})}}}},33:function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={data:function(){return{posts:[]}},methods:{},ready:function(){}}},34:function(t,e,a){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}Object.defineProperty(e,"__esModule",{value:!0});var s=a(249),i=o(s),r=a(263),n=o(r),c=new i.default.Renderer;c.heading=function(t,e){return"<h"+e+' class="ui dividing header">'+t+"</h"+e+">"},c.image=function(t,e,a){return'<img class="ui image" src="'+t+'" alt="'+a+'" >'},i.default.setOptions({renderer:c,gfm:!0,tables:!0,breaks:!1,pedantic:!1,sanitize:!1,smartLists:!0,smartypants:!1,highlight:function(t,e){return a(76).highlightAuto(t,[e]).value}}),e.default={components:{Disqus:n.default},data:function(){return{content:"<h1>loading...</h1>",year:"",month:"",day:"",title:"",shortname:"chatbot-master-core"}},route:{data:function(t){var e=t.to.params.year,o=t.to.params.month,s=t.to.params.day,r=t.to.params.title,n=e+"-"+o+"-"+s+"-"+(r?String(r):"");a(266)("./"+n+".md")(function(a){t.next({content:(0,i.default)(a.rawContent),year:e,month:o,day:s,title:a.metaData.title})})}}}},35:function(t,e,a){"use strict";function o(t){return t&&t.__esModule?t:{default:t}}function s(t){var e={},a=!0,o=!1,s=void 0;try{for(var i,r=(0,c.default)(t);!(a=(i=r.next()).done);a=!0){var n=i.value,l=!0,u=!1,d=void 0;try{for(var v,p=(0,c.default)(n.tags);!(l=(v=p.next()).done);l=!0){var f=v.value;f in e||(e[f]=[]),e[f].push(n)}}catch(t){u=!0,d=t}finally{try{!l&&p.return&&p.return()}finally{if(u)throw d}}}}catch(t){o=!0,s=t}finally{try{!a&&r.return&&r.return()}finally{if(o)throw s}}return e}Object.defineProperty(e,"__esModule",{value:!0});var i=a(18),r=o(i),n=a(10),c=o(n);e.default={data:function(){return{tags:[],tagSelected:""}},methods:{select:function(t){this.$router.go({path:"/tags",query:{tag:t}})}},route:{data:function(t){var e=t.to.query.tag;a.e(0,function(o){var i=a(3),n=s(i);e||(e=(0,r.default)(n)[0]),t.next({tags:n,tagSelected:e})})}}}},36:function(t,e){"use strict";Object.defineProperty(e,"__esModule",{value:!0}),e.default={props:{shortname:{type:String,required:!0}},ready:function(){return window.DISQUS?void this.reset(window.DISQUS):void this.init()},methods:{reset:function(t){var e=this;t.reset({reload:!0,config:function(){this.page.identifier=e.$route.path||window.location.pathname,this.page.url=e.$el.baseURI}})},init:function(){var t=this,e=this;window.disqus_config=function(){this.page.url=e.$route.path||window.location.pathname,this.page.url=e.$el.baseURI},setTimeout(function(){var e=document,a=e.createElement("script");a.type="text/javascript",a.async=!0,a.setAttribute("id","embed-disqus"),a.setAttribute("data-timestamp",+new Date),a.src="//"+t.shortname+".disqus.com/embed.js",(e.head||e.body).appendChild(a)},0)}}}},37:function(t,e,a){var o,s=[];t.exports=function(t){s?s.push(t):t(o)},a.e(3,function(t){o=a(246);var e=s;s=null;for(var i=0,r=e.length;i<r;i++)e[i](o)})},38:function(t,e,a){var o,s=[];t.exports=function(t){s?s.push(t):t(o)},a.e(2,function(t){o=a(247);var e=s;s=null;for(var i=0,r=e.length;i<r;i++)e[i](o)})},39:function(t,e,a){var o,s=[];t.exports=function(t){s?s.push(t):t(o)},a.e(1,function(t){o=a(248);var e=s;s=null;for(var i=0,r=e.length;i<r;i++)e[i](o)})},69:function(t,e){},70:function(t,e){},71:function(t,e){},72:function(t,e){},73:function(t,e){},74:function(t,e){},250:function(t,e){t.exports=' <div class="ui container"> <div class="ui large secondary teal pointing menu" :class="{\'stackable\': show}"> <a class="toc item"> <i class="sidebar icon" @click=toggle></i> </a> <a class=item v-link="{path: \'/home\'}">Home</a> <a class=item v-link="{path: \'/archives\'}">Archives</a> <a class=item v-link="{path: \'/categories\'}">Categories</a> <a class=item v-link="{path: \'/tags\'}">Tags</a> <a class=item href=/atom.xml>RSS</a> </div> <router-view></router-view> <div class="ui center aligned segment"> <p> Copyright＠2017 <a href=https://github.com/Samurais>Samurais.</a> All rights reversed. </p> <p>Built with <a href=https://github.com/reverland/blog-next>blog-next</a>.</p> </div> </div> '},251:function(t,e){t.exports=" <div id=disqus_thread></div> "},252:function(t,e){t.exports=' <div class=tags _v-07812490=""> <template v-if=!$loadingRouteData> <h1 class="ui teal huge header" _v-07812490="">Chatbot Master Core</h1> <h2 class="ui grey small header" _v-07812490="">bot.reply("Hello World.")</h2> <div class="ui labels" _v-07812490=""> <a class="ui label" v-for="(tag, posts) of tags" :class="{\'teal\': tag == tagSelected}" @click=select(tag) _v-07812490="">{{ tag }} <span class=detail _v-07812490="">{{ posts.length }}</span></a> </div> <div class="ui cards" _v-07812490=""> <div class="ui card" v-for="post in tags[tagSelected]" _v-07812490=""> <div class=content _v-07812490=""> <a class=header v-link="{\n          path: \'/\' + post.category + \'/\' + post.year + \'/\' + post.month + \'/\' + post.day + \'/\' + (post._title ? post._title + \'/\' : \'\')\n        }" _v-07812490=""> {{post.title}} </a> <div class=meta _v-07812490=""> <span _v-07812490=""> {{ post.year }}-{{ post.month }}-{{ post.day }} </span> <i class="heartbeat icon" _v-07812490=""></i> <a v-link="{path: \'/categories\', query: { category: post.category } }" _v-07812490=""> {{ post.category }} </a> </div> <div class=description _v-07812490=""> <span _v-07812490=""> {{ post.excerpt }} </span> </div> </div> <div class="extra content" _v-07812490=""> <a v-for="tag in post.tags" class="ui tag label" v-link="{path: \'/tags\', query: { tag: tag } }" _v-07812490=""> {{ tag }} </a> </div> </div> </div> </template> <div v-if=$loadingRouteData class="ui myloading segment" _v-07812490=""> <div class="ui active loader" _v-07812490=""></div> </div> </div> '},253:function(t,e){t.exports=' <div class=home _v-0bc05b7e=""> <div class="ui piled segments" _v-0bc05b7e=""> <div class="ui clearing segment" _v-0bc05b7e=""> <h1 class="ui teal huge header" _v-0bc05b7e="">Chatbot Master Core</h1> <div class="ui grey small right floated header" _v-0bc05b7e=""> <a href=https://zh.wikipedia.org/wiki/%E8%8E%B1%E7%89%B9%E5%85%84%E5%BC%9F _v-0bc05b7e=""> Noble is not born, but trained.</a> </div> </div> <div class="ui centered card" _v-0bc05b7e=""> <div class=image _v-0bc05b7e=""> <img :src="\'https://unsplash.it/320/240?random&amp;\' + Math.random()" _v-0bc05b7e=""> </div> <div class=content _v-0bc05b7e=""> <div class=meta _v-0bc05b7e=""> <span class=date _v-0bc05b7e="">Blog since Mar. 2017</span> </div> <div class=description _v-0bc05b7e=""> <a href=https://samurais.github.io/implementation/2017/03/01/chatbot-age-is-coming/ target=_blank _v-0bc05b7e="">The answer to life, the universe and everything</a> </div> </div> <div class="extra content" _v-0bc05b7e=""> <a href=/ _v-0bc05b7e=""> <i class="bug icon" _v-0bc05b7e=""></i> x = x =&gt; x(x) </a> </div> </div> </div> </div> '},254:function(t,e){t.exports=' <div class="posts ui raised segments" _v-55da36bf=""> <template v-if=!$loadingRouteData> <div class="ui ribbon label" _v-55da36bf=""> <h1 _v-55da36bf="">{{ title }}</h1> <div class=small _v-55da36bf=""><i class="history icon" _v-55da36bf=""></i>{{year}}-{{month}}-{{day}}</div> </div> <div class="ui segment" _v-55da36bf=""> {{{ content }}} </div> <div class="ui segment" _v-55da36bf=""> <disqus :shortname=shortname _v-55da36bf=""></disqus> </div> </template> <div v-if=$loadingRouteData class="load ui segment" _v-55da36bf=""> <div class="ui active loader" _v-55da36bf=""></div> </div> </div> '},255:function(t,e){t.exports=' <div class=postsList _v-7380abe0=""> <template v-if=!$loadingRouteData> <h1 class="ui teal huge header" _v-7380abe0="">Chatbot Master Core</h1> <h2 class="ui grey small header" _v-7380abe0="">bot.reply("Hello World.")</h2> <div class="ui labels" _v-7380abe0=""> <a class="ui label" v-for="keyvalue of archives" :class="{\'teal\': keyvalue[0] == yearSelected}" @click=select(keyvalue[0]) _v-7380abe0="">{{ keyvalue[0] }} <span class=detail _v-7380abe0="">{{ keyvalue[1].length }}</span></a> </div> <div class="ui cards" _v-7380abe0=""> <div class="ui card" v-for="post in yearArchive" _v-7380abe0=""> <div class=content _v-7380abe0=""> <a class=header v-link="{\n          path: \'/\' + post.category + \'/\' + post.year + \'/\' + post.month + \'/\' + post.day + \'/\' + (post._title ? post._title + \'/\' : \'\')\n        }" _v-7380abe0=""> {{post.title}} </a> <div class=meta _v-7380abe0=""> <span _v-7380abe0=""> {{ post.year }}-{{ post.month }}-{{ post.day }} </span> <i class="heartbeat icon" _v-7380abe0=""></i> <a v-link="{path: \'/categories\', query: { category: post.category } }" _v-7380abe0=""> {{ post.category }} </a> </div> <div class=description _v-7380abe0=""> <span _v-7380abe0=""> {{ post.excerpt }} </span> </div> </div> <div class="extra content" _v-7380abe0=""> <a v-for="tag in post.tags" class="ui tag label" v-link="{path: \'/tags\', query: { tag: tag } }" _v-7380abe0=""> {{ tag }} </a> </div> </div> </div> </template> <div v-if=$loadingRouteData class="ui myloading segment" _v-7380abe0=""> <div class="ui active loader" _v-7380abe0=""></div> </div> </div> '},256:function(t,e){t.exports=' <div class=categories _v-fa9a760a=""> <template v-if=!$loadingRouteData> <h1 class="ui teal huge header" _v-fa9a760a="">Chatbot Master Core</h1> <h2 class="ui grey small header" _v-fa9a760a="">bot.reply("Hello World.")</h2> <div class="ui labels" _v-fa9a760a=""> <a class="ui label" v-for="(category, posts) of categories" :class="{\'teal\': category == categorySelected}" @click=select(category) _v-fa9a760a="">{{ category }} <span class=detail _v-fa9a760a="">{{ posts.length }}</span></a> </div> <div class="ui cards" _v-fa9a760a=""> <div class="ui card" v-for="post in categories[categorySelected]" _v-fa9a760a=""> <div class=content _v-fa9a760a=""> <a class=header v-link="{\n          path: \'/\' + post.category + \'/\' + post.year + \'/\' + post.month + \'/\' + post.day + \'/\' + (post._title ? post._title + \'/\' : \'\')\n        }" _v-fa9a760a=""> {{post.title}} </a> <div class=meta _v-fa9a760a=""> <span _v-fa9a760a=""> {{ post.year }}-{{ post.month }}-{{ post.day }} </span> <i class="heartbeat icon" _v-fa9a760a=""></i> <a v-link="{path: \'/categories\', query: { category: post.category } }" _v-fa9a760a=""> {{ post.category }} </a> </div> <div class=description _v-fa9a760a=""> <span _v-fa9a760a=""> {{ post.excerpt }} </span> </div> </div> <div class="extra content" _v-fa9a760a=""> <a v-for="tag in post.tags" class="ui tag label" v-link="{path: \'/tags\', query: { tag: tag} }" _v-fa9a760a=""> {{ tag }} </a> </div> </div> </div> </template> <div v-if=$loadingRouteData class="ui myloading segment" _v-fa9a760a=""> <div class="ui active loader" _v-fa9a760a=""></div> </div> </div> '},257:function(t,e,a){var o,s,i={};a(69),o=a(30),s=a(250),t.exports=o||{},t.exports.__esModule&&(t.exports=t.exports.default);var r="function"==typeof t.exports?t.exports.options||(t.exports.options={}):t.exports;s&&(r.template=s),r.computed||(r.computed={}),Object.keys(i).forEach(function(t){var e=i[t];r.computed[t]=function(){return e}})},258:function(t,e,a){var o,s,i={};a(73),o=a(31),s=a(255),t.exports=o||{},t.exports.__esModule&&(t.exports=t.exports.default);var r="function"==typeof t.exports?t.exports.options||(t.exports.options={}):t.exports;s&&(r.template=s),r.computed||(r.computed={}),Object.keys(i).forEach(function(t){var e=i[t];r.computed[t]=function(){return e}})},259:function(t,e,a){var o,s,i={};a(74),o=a(32),s=a(256),t.exports=o||{},t.exports.__esModule&&(t.exports=t.exports.default);var r="function"==typeof t.exports?t.exports.options||(t.exports.options={}):t.exports;s&&(r.template=s),r.computed||(r.computed={}),Object.keys(i).forEach(function(t){var e=i[t];r.computed[t]=function(){return e}})},260:function(t,e,a){var o,s,i={};a(71),o=a(33),s=a(253),t.exports=o||{},t.exports.__esModule&&(t.exports=t.exports.default);var r="function"==typeof t.exports?t.exports.options||(t.exports.options={}):t.exports;s&&(r.template=s),r.computed||(r.computed={}),Object.keys(i).forEach(function(t){var e=i[t];r.computed[t]=function(){return e}})},261:function(t,e,a){var o,s,i={};a(72),o=a(34),s=a(254),t.exports=o||{},t.exports.__esModule&&(t.exports=t.exports.default);var r="function"==typeof t.exports?t.exports.options||(t.exports.options={}):t.exports;s&&(r.template=s),r.computed||(r.computed={}),Object.keys(i).forEach(function(t){var e=i[t];r.computed[t]=function(){return e}})},262:function(t,e,a){var o,s,i={};a(70),o=a(35),s=a(252),t.exports=o||{},t.exports.__esModule&&(t.exports=t.exports.default);var r="function"==typeof t.exports?t.exports.options||(t.exports.options={}):t.exports;s&&(r.template=s),r.computed||(r.computed={}),Object.keys(i).forEach(function(t){var e=i[t];r.computed[t]=function(){return e}})},263:function(t,e,a){var o,s,i={};o=a(36),s=a(251),t.exports=o||{},t.exports.__esModule&&(t.exports=t.exports.default);var r="function"==typeof t.exports?t.exports.options||(t.exports.options={}):t.exports;s&&(r.template=s),r.computed||(r.computed={}),Object.keys(i).forEach(function(t){var e=i[t];r.computed[t]=function(){return e}})},266:function(t,e,a){function o(t){return a(s(t))}function s(t){return i[t]||function(){throw new Error("Cannot find module '"+t+"'.")}()}var i={"./2017-03-01-chatbot-age-is-coming.md":37,"./2017-03-02-1506.05869-A%20Neural%20Conversational%20Model.md":38,"./2017-03-03-1601.04589-Combining%20Markov%20Random%20Fields%20and%20Convolutional%20Neural%20Networks%20for%20Image%20Synthesis.md":39};o.keys=function(){return Object.keys(i)},o.resolve=s,t.exports=o,o.id=266}});