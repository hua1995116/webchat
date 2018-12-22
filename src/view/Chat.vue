<template>
  <div>
    <div class="container">
      <mu-dialog width="360" :open.sync="openSimple">
        <div class="all-chat">
          <div slot="title">在线人员</div>
          <div v-for="(obj,index) in getUsers" class="online" :key="index">
            <img :src="obj.src" alt="">
          </div>
        </div>
        <mu-button slot="actions" flat color="primary" @click="closeSimpleDialog">关闭</mu-button>
      </mu-dialog>
      <div class="title">
        <mu-appbar title="Title">
          <mu-icon-button icon="chevron_left" slot="left" @click="goback"/>
          <div class="center">
            聊天({{Object.keys(getUsers).length}})
          </div>
          <mu-icon-button icon="people" slot="right" @click="openSimpleDialog"/>
        </mu-appbar>
      </div>
      <div class="notice" v-if="noticeList.length > 0" :class="[noticeBar ? 'notice-hidden' : '']">
        <div class="notice-container">
          <div class="notice-li" v-for="(item, key) in noticeList" :key="key">
            <a :href="item.href">{{key + 1}}. {{item.title}}</a>
          </div>
        </div>
        <div class="notice-tool-bar" @click="handleNotice"> 
          {{noticeBar ? '显示通知' : '关闭通知'}}
        </div>
      </div>
      <div class="chat-inner">
        <div class="chat-container" v-if="isLoadingAchieve">
          <div v-if="getInfos.length === 0 && getMessHistoryInfos.length === 0" class="chat-no-people">暂无消息,赶紧来占个沙发～</div>
          <div v-if="getInfos.length > 0" class="chat-top">到顶啦~</div>
          <Message 
            v-for="obj in getInfos" :key="obj._id"
            :is-self="obj.username === userid" 
            :name="obj.username" 
            :head="obj.src" 
            :msg="obj.msg"
            :img="obj.img" 
            :mytime="obj.time"
            :container="container"
            ></Message>
          <div class="clear"></div>
        </div>
      </div>
      <div class="bottom">
        <div class="functions">
          <div class="fun-li" @click="imgupload">
            <i class="icon iconfont icon-camera"></i>
          </div> 
          <div class="fun-li emoji">
            <i class="icon iconfont icon-emoji"></i>
            <div class="emoji-content" v-show="getEmoji">
              <div class="emoji-tabs">
                <div class="emoji-container" ref="emoji">
                  <div class="emoji-block" :style="{width: Math.ceil(emoji.people.length / 5) * 48 + 'px'}">
                    <span v-for="(item, index) in emoji.people" :key="index">{{item}}</span>
                  </div>
                  <div class="emoji-block" :style="{width: Math.ceil(emoji.nature.length / 5) * 48 + 'px'}">
                    <span v-for="(item, index) in emoji.nature" :key="index">{{item}}</span>
                  </div>
                  <div class="emoji-block" :style="{width: Math.ceil(emoji.items.length / 5) * 48 + 'px'}">
                    <span v-for="(item, index) in emoji.items" :key="index">{{item}}</span>
                  </div>
                  <div class="emoji-block" :style="{width: Math.ceil(emoji.place.length / 5) * 48 + 'px'}">
                    <span v-for="(item, index) in emoji.place" :key="index">{{item}}</span>
                  </div>
                  <div class="emoji-block" :style="{width: Math.ceil(emoji.single.length / 5) * 48 + 'px'}">
                    <span v-for="(item, index) in emoji.single" :key="index">{{item}}</span>
                  </div>
                </div>
                <div class="tab">
                  <!-- <a href="#hot"><span>热门</span></a>
                  <a href="#people"><span>人物</span></a> -->
                </div>
              </div>
            </div>
          </div>
          <div class="fun-li" @click="handleTips">
            <i class="icon iconfont icon-zanshang"></i>
          </div>
          <div class="fun-li" @click="handleGithub">
            <i class="icon iconfont icon-wenti"></i>
          </div>
        </div>
        <div class="chat">
          <div class="input" @keyup.enter="submess">
            <input type="text" v-model="chatValue">
          </div>
          <mu-raised-button label="发送" class="demo-raised-button" primary @click="submess"/>
        </div>
        <input id="inputFile" name='inputFile' type='file' multiple='mutiple' accept="image/*;capture=camera"
                style="display: none" @change="fileup">
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6" scoped>
  import {mapGetters, mapState} from 'vuex'
  import {inHTMLData} from 'xss-filters-es6';
  import socket from '../socket';
  import emoji from '@utils/emoji';
  import {setItem, getItem} from '@utils/localStorage';
  import {queryString} from '@utils/queryString';
  import Message from '@components/Message';
  import loading from '@components/loading/loading';
  import Alert from '@components/Alert';
  import debounce from 'lodash/debounce';
  import url from '@api/server';

  export default{
    data() {
      const notice = getItem('notice') || {};
      const {noticeBar, noticeVersion} = notice;
      return {
        roomid: '',
        isLoadingAchieve: false,
        container: {},
        chatValue: '',
        emoji: emoji,
        current: 1,
        openSimple: false,
        noticeBar: !!noticeBar,
        noticeList: [],
        noticeVersion: noticeVersion || '20181222'
      }
    },
    async created() {
      const roomId = queryString(window.location.href, 'roomId')
      this.roomid = roomId
      if (!roomId) {
        this.$router.push({path: '/'})
      }
      if (!this.userid) {
        // 防止未登录
        this.$router.push({path: '/login'})
      }
      const res = await url.getNotice();
      this.noticeList = res.data.noticeList;
      if (res.data.version !== res.data.version) {
        this.noticeBar = false;
      }
      this.noticeVersion = res.data.version;
    },
    mounted() {
      this.container = document.querySelector('.chat-inner')
      // socket内部，this指针指向问题
      const that = this
      this.$store.commit('setRoomDetailInfos')
      const obj = {
        name: this.userid,
        src: this.src,
        roomid: this.roomid
      }
      socket.emit('room', obj)
      socket.on('room', function (obj) {
        that.$store.commit('setUsers', obj)
      })
      socket.on('roomout', function (obj) {
        that.$store.commit('setUsers', obj)
      })
      loading.show()
      setTimeout(async () => {
        const data = {
          current: +this.current,
          roomid: this.roomid
        }
        await this.$store.dispatch('getAllMessHistory', data)
        loading.hide()
        this.isLoadingAchieve = true
        this.$nextTick(() => {
          this.container.scrollTop = 10000
        })
      }, 500);

      this.container.addEventListener('scroll', debounce(async (e) => {
        // console.log(e.target.scrollTop, e.target.scrollHeight);
        if (e.target.scrollTop === 0) {
          this.current++
          const data = {
            current: +this.current,
            roomid: this.roomid
          }
          await this.$store.dispatch('getAllMessHistory', data);
        }
      }, 100))

      this.$refs.emoji.addEventListener('click', function(e) {
        var target = e.target || e.srcElement;
        if (!!target && target.tagName.toLowerCase() === 'span') {
          that.chatValue = that.chatValue + target.innerHTML;
        }
        e.stopPropagation();
      });
    },
    methods: {
      handleNotice() {
        this.noticeBar = !this.noticeBar;
        setItem('notice', {
          noticeBar: this.noticeBar,
          noticeVersion: this.noticeVersion
        })
      },
      openSimpleDialog () {
        this.openSimple = true;
      },
      closeSimpleDialog () {
        this.openSimple = false;
      },
      handleGithub() {
        Alert({
          content: 'https://github.com/hua1995116/webchat'
        });
      },
      handleTips() {
        Alert({
          title: '请我喝杯奶茶',
          html: '<div><img style="width: 200px" src="//s3.qiufengh.com/money/WechatIMG64.jpeg" /></div>'
        })
      },
      goback () {
        const obj = {
          name: this.userid,
          roomid: this.roomid
        }
        socket.emit('roomout', obj)
        this.$router.goBack()
        this.$store.commit('setTab', true)
      },
      setLog() {
        // 版本更新日志
      },
      fileup() {
        const that = this
        const file1 = document.getElementById('inputFile').files[0]
        if (file1) {
          const formdata = new window.FormData()
          formdata.append('file', file1)
          formdata.append('username', this.userid)
          formdata.append('src', this.src)
          formdata.append('roomid', that.roomid)
          formdata.append('time', new Date())
          this.$store.dispatch('uploadImg', formdata)
          const fr = new window.FileReader()
          fr.onload = function () {
            const obj = {
              username: that.userid,
              src: that.src,
              img: fr.result,
              msg: '',
              roomid: that.roomid,
              time: new Date()
            }
            socket.emit('message', obj)
          }
          fr.readAsDataURL(file1)
          this.$nextTick(() => {
            this.container.scrollTop = 10000
          })
        } else {
          console.log('必须有文件')
        }
      },
      imgupload() {
        const file = document.getElementById('inputFile')
        file.click()
      },
      submess() {
        // 判断发送信息是否为空
        if (this.chatValue !== '') {
          if (this.chatValue.length > 200) {
            Alert({
              content: '请输入100字以内'
            })
            return
          }
          const msg = inHTMLData(this.chatValue); // 防止xss

          const obj = {
            username: this.userid,
            src: this.src,
            img: '',
            msg,
            roomid: this.roomid,
            time: new Date()
          }
          // 传递消息信息
          socket.emit('message', obj)
          this.chatValue = ''
        } else {
          Alert({
            content: '内容不能为空'
          })
        }
      }
    },
    computed: {
      ...mapGetters([
        'getEmoji',
        'getInfos',
        'getUsers',
        'getMessHistoryInfos'
      ]),
      ...mapState([
        'isbind'
      ]),
      ...mapState({
        userid: state => state.userInfo.userid,
        src: state => state.userInfo.src
      })
    },
    components: {
      Message
    }
  }
</script>

<style lang="stylus" rel="stylesheet/stylus" src="./Chat.styl" scoped></style>
