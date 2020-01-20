<template>
    <div class="clear" :class="[isSelf ? 'right' : 'left']" ref="msg">
        <div class="item">
            <div class="name">
                <span v-if="mytime">{{getdate}}</span> &nbsp;&nbsp;{{name}}
            </div>
            <Avatar
              @click.native="handleClick"
              class="head-place"
              size="small"
              :src="avatar"
              v-flex-touch="handleTouch"
              ></Avatar>
            <div v-if="img">
                <img
                    v-imgSize="pic.src"
                    :width="pic.width"
                    :height="pic.height"
                    alt=""
                    :data-item="isLast && 'last'"
                    class="img"
                    v-preview="img"
                    preview-title-enable="true"
                    preview-nav-enable="true">
            </div>
            <span v-if="msg">
                <span v-html="linkMsg" class="msg"></span>
                <!-- {{msg | link}} -->
            </span>
        </div>
    </div>
</template>

<script type="text/ecmascript-6">
import Avatar from "@components/Avatar";
import dateFormat from "../../utils/date";
import { inHTMLData, uriInUnQuotedAttr } from "xss-filters-es6";
const maxWidth = 200;
const maxHeight = 200;

export default {
  components: {
    Avatar,
  },
  props: ["id", "name", "img", "msg", "head", "mytime", "is-self", "container", "isNeedScroll", "firstNode", 'isLast'],
  computed: {
    getdate() {
      return dateFormat(new Date(this.mytime), "yyyy-MM-dd HH:mm:ss");
    },
    linkMsg() {
      // 防止xss
      const filterValue = inHTMLData(this.msg);
      return filterValue.replace(
        /(http:\/\/|https:\/\/)((\w|=|\?|\.|\/|&|-)+)/g,
        function($0) {
          const url = $0;
          return `<a style="color: #b374ff" href="${uriInUnQuotedAttr(
            url
          )}" target="_blank">${uriInUnQuotedAttr(url)}</a>`;
        }
      );
    },
    avatar() {
      let avatar = this.head;
      const reg = /\.\/static\/img\/(\d+)\.jpg/;
      const matches = this.head.match(reg);
      if (matches) {
        avatar = `//s3.qiufengh.com/avatar/${matches[1]}.jpeg`;
      }
      if(avatar.indexOf('?') > -1) {
        return `${avatar}&imageView2/2/w/120/h/120`;
      } else {
        return `${avatar}?imageView2/2/w/120/h/120`;
      }
    },
    pic() {
      let pic = this.img;
      let width = 200;
      let height = 200;
      const picParse = /width=([0-9]+)&height=([0-9]+)/.exec(pic);
      if(picParse) {
        const natureWidth = +picParse[1];
        const naturehHeight = +picParse[2];
        let scale = 1;
        if (natureWidth * scale > maxWidth) {
            scale = maxWidth / natureWidth;
        }
        if (naturehHeight * scale > maxHeight) {
            scale = maxHeight / naturehHeight;
        }
        width = natureWidth * scale;
        height = naturehHeight * scale;
      }
      if (pic.indexOf("data:image") > -1) {
        return {
          src: pic,
          width,
          height
        };
      }
      if(pic.indexOf('?') > -1) {
        return {
          src: `${pic}&imageView2/2/w/360`,
          width,
          height
        };
      } else {
        return {
          src: `${pic}?imageView2/2/w/360`,
          width,
          height
        };
      }
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.msg.scrollIntoView();
    })
  },
  methods: {
    handleClick() {
      this.$emit('avatarClick', {
        id: this.name,
      });
    },
    handleTouch(e) {
      console.log(e);
      this.$emit('flexTouch', `@${this.name}，`);
    }
  }
};
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped src="./index.styl"></style>
