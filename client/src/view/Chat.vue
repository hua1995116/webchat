<template>
  <div>
    <div class="container">
      <div class="title">
        <mu-appbar color="primary">
          <mu-button icon slot="left" @click="goback">
            <mu-icon value="chevron_left"></mu-icon>
          </mu-button>
          <div class="center">
            {{roomType === 'group' ? `聊天(${(roomUsers[roomId] || []).length})` : friendName}}
          </div>
          <mu-button v-if="roomType === 'group'" icon slot="right" @click="openSimpleDialog">
            <mu-icon value="people"></mu-icon>
          </mu-button>
          <mu-button v-else icon slot="right"></mu-button>
        </mu-appbar>
      </div>
      <!-- <div class="notice" v-if="noticeList.length > 0" :class="[noticeBar ? 'notice-hidden' : '']">
        <div class="notice-container">
          <div class="notice-li" v-for="(item, key) in noticeList" :key="key">
            <a :href="item.href">{{key + 1}}. {{item.title}}</a>
          </div>
        </div>
        <div class="notice-tool-bar" @click="handleNotice">
          {{noticeBar ? '显示通知' : '关闭通知'}}
        </div>
      </div> -->
      <div class="chat-inner" @scroll="bindScroll">
        <div class="chat-container">
          <div v-if="(roomdetail[roomId] || []).length === 0" class="chat-no-people">暂无消息,赶紧来占个沙发～</div>
          <div v-if="(roomdetail[roomId] || []).length !== 0 && isloading" class="chat-loading">
            <div class="lds-css ng-scope">
              <div class="lds-rolling">
                <div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="isEnd && (roomdetail[roomId] || []).length !== 0" class="chat-top">到顶啦~</div>
          <Message
            v-for="(obj, index) in (roomdetail[roomId] || [])"
            @avatarClick="handleInfo"
            @flexTouch="hadnleTouch"
            @retry="handleRetry"
            :key="obj._id"
            :is-self="obj.userInfo.username === username"
            :id="obj._id"
            :username="obj.userInfo.username"
            :avatar="obj.userInfo.avatar"
            :msg="obj.msg"
            :clientId="obj.clientId"
            :groupId="obj.groupId"
            :msgType="obj.msgType"
            :loading="obj.loading"
            :status="obj.status"
            :mytime="obj.time"
            :obj="obj"
            :container="container"
            :isLast="roomdetail[roomId].length - 1 === index"
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
            <div class="emoji-content" v-show="false">
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
          <mu-button class="demo-raised-button" color="primary" @click="submess">发送</mu-button>
        </div>
        <input id="inputFile" name='inputFile' type='file' multiple='mutiple' accept="image/gif,image/jpeg,image/png,image/webp,image/jpg;capture=camera"
                style="display: none" @change="fileup">
      </div>
    </div>
  </div>
</template>

<script type="text/ecmascript-6" scoped>
  import {mapGetters, mapState} from 'vuex';
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
  import { setTimeout } from 'timers';
  import ios from '@utils/ios';
  import { v4 as uuid } from 'uuid';

  let isMore = false;

  export default {
    name: 'Chat',
    data() {
      const notice = getItem('notice') || {};
      const {noticeBar, noticeVersion} = notice;
      return {
        isloading: false,
        roomId: '',
        roomType: 'group',
        container: {},
        chatValue: '',
        emoji: emoji,
        openSimple: false,
        noticeBar: !!noticeBar,
        noticeList: [],
        noticeVersion: noticeVersion || '20181222',
        isEnd: false,
        to: '',
        from: '',
        friendName: '',
      };
    },
    async created() {
      const roomId = queryString(window.location.href, 'roomId');
      const roomType = queryString(window.location.href, 'type');
      const to = queryString(window.location.href, 'to');
      const from = queryString(window.location.href, 'from');
      const friendName = queryString(window.location.href, 'friendName');
      this.roomId = roomId;
      this.roomType = roomType;
      this.to = to;
      this.from = from;
      this.friendName = friendName;
      if (!roomId) {
        this.$router.push({path: '/'});
      }
      if (!this.token) {
        // 防止未登录
        this.$router.push({path: '/login'});
      }
      // const res = await url.getNotice();
      // this.noticeList = res.data.noticeList;
      // if (res.data.version !== res.data.version) {
      //   this.noticeBar = false;
      // }
      // this.noticeVersion = res.data.version;
    },
    async mounted() {
      loading.show({
        marginTop: '56px',
        background: '#f1f5f8'
      });
      // 微信 回弹 bug
      ios();
      this.container = document.querySelector('.chat-inner');
      // socket内部，this指针指向问题
      this.isloading = true;
      if(!this.roomdetail[this.roomId]) {
        console.log('获取详情')
        await this.getRoomMessage();
      }
      this.isloading = false;
      loading.hide();

      // this.bindEmoji();
    },
    methods: {
      handleRetry(obj) {
        if(obj.img) {
          Alert({
            content: '图片暂时不支持重新发送'
          })
          return;
        }
        const clientId = uuid();
        this.$store.commit('setRoomDetailStatus', {
          clientId: obj.clientId,
          newClientId: clientId,
          groupId: obj.roomId,
          status: 'loading',
          typeList: ['status']
        })
        socket.emit('message', {
          ...obj,
          clientId,
          status: 'loading'
        });
      },
      handleInfo(item) {
        this.$router.push({ path: "/persionDetail", query: { id: item.id } });
      },
      hadnleTouch(data) {
        this.chatValue = this.chatValue + data;
      },
      bindScroll: debounce(async function (e) {
        if (e.target.scrollTop >= 0 && e.target.scrollTop < 150) {
          this.handleScroll();
        }
      }, 30),
      async handleScroll() {
        if(!isMore && !this.isEnd) {
          this.isloading = true;
          isMore = true;
          await this.getRoomMessage();
          isMore = false;
          this.isloading = false;
        }
      },
      bindEmoji() {
        this.$refs.emoji.addEventListener('click', (e) => {
          var target = e.target || e.srcElement;
          if (!!target && target.tagName.toLowerCase() === 'span') {
            this.chatValue = this.chatValue + target.innerHTML;
          }
          e.stopPropagation();
        });
      },
      async getRoomMessage() {
        const data = {
          groupId: this.roomId
        };
        if(this.roomdetail[this.roomId] && this.roomdetail[this.roomId].length > 0) {
          const id = this.roomdetail[this.roomId][0]._id;
          data.msgId = id;
        }
        try {
          const result = await this.$store.dispatch('getAllMessHistory', data);
          if(!result.data.length) {
            this.isEnd = true;
          }
        } catch(e) {

        }
      },
      handleNotice() {
        this.noticeBar = !this.noticeBar;
        setItem('notice', {
          noticeBar: this.noticeBar,
          noticeVersion: this.noticeVersion
        });
      },
      openSimpleDialog () {
        this.$router.push({ path: "/groupDetail", query: { roomId: this.roomId} });
      },
      handleGithub() {
        Alert({
          content: 'https://github.com/hua1995116/webchat'
        });
      },
      handleTips() {
        Alert({
          title: '请我喝杯奶茶',
          html: '<div><img style="width: 150px" src="//s3.qiufengh.com/money/WechatIMG64.jpeg" /><br><img style="width: 150px" src="https://s3.qiufengh.com/webchat/wechat-pay.jpeg"></div>'
        });
      },
      goback () {
        this.$router.isBack = true;
        this.$router.goBack();
      },
      setLog() {
        // 版本更新日志
      },
      async fileup() {
        const _this = this;
        const file1 = document.getElementById('inputFile').files[0];
        if (file1) {
          const formdata = new window.FormData();
          formdata.append('file', file1);
          const fr = new window.FileReader();
          fr.onload = function () {
            const img = new Image();
            img.src = fr.result;
            img.onload = async function() {
              const obj = {
                ...(_this.createMsg('img', `${fr.result}?width=${img.width}&height=${img.height}`)),
                 userInfo: {
                  avatar: _this.avatar,
                  username: _this.username,
                },
                status: 'loading',
                loading: 5,
              }
               // 传递消息信息
              _this.$store.commit('setRoomDetailInfosAfter', {
                groupId: _this.roomId,
                msgs: [obj]
              });

              const imgurl = await _this.$store.dispatch('uploadImg', formdata);
              if(imgurl.code == 500) {
                Alert({
                  content: imgurl.data
                })
                _this.$store.commit('delRoomDetailImg', {
                  roomId: _this.roomId,
                  clientId: obj.clientId
                })
                return;
              }
              obj.msg = `${imgurl.data}?width=${img.width}&height=${img.height}`;

              socket.emit('message', obj);
            }

          };
          fr.readAsDataURL(file1);
          this.$nextTick(() => {
            this.container.scrollTop = 10000;
          });
        } else {
          console.log('必须有文件');
        }
      },
      imgupload() {
        const file = document.getElementById('inputFile');
        file.click();
      },
      createMsg(type, msg) {
        const obj = {
          userId: this.userId,
          groupId: this.roomId,
          msg,
          // to: this.to,
          roomType: this.roomType,
          msgType: type,
          clientId: uuid(),
          time: Date.now()
        };
        return obj;
      },
      submess() {
        // 判断发送信息是否为空
        if (this.chatValue !== '') {
          if (this.chatValue.length > 200) {
            Alert({
              content: '请输入200字以内'
            });
            return;
          }
          // msgType、msg、groupId、userId、roomType
          // img / text/ video/ audio/ code / emjio
          const msg = inHTMLData(this.chatValue); // 防止xss

          const obj = {
            ...(this.createMsg('text', msg)),
            status: 'loading',
            userInfo: {
              avatar: this.avatar,
              username: this.username,
            },
          }
          // 传递消息信息
          this.$store.commit('setRoomDetailInfosAfter', {
            groupId: this.roomId,
            msgs: [obj]
          });

          socket.emit('message', obj);
          this.chatValue = '';
        } else {
          Alert({
            content: '内容不能为空'
          });
        }
      }
    },
    computed: {
      // ...mapGetters([
      //   'getEmoji',
      // ]),
      ...mapState({
        roomUsers: state => state.roomInfo.roomUsers,
        roomdetail: state => state.roomInfo.roomdetail,
      }),
      ...mapState({
        token: state => state.userInfo.token,
        username: state => state.userInfo.username,
        userId: state => state.userInfo.userId,
        avatar: state => state.userInfo.avatar,
      })
    },
    components: {
      Message
    }
  };
</script>

<style lang="stylus" rel="stylesheet/stylus" src="./Chat.styl" scoped></style>
