<template>
  <div class="wrapper">
    <Header></Header>
    <vue-cropper 
      ref="cropper" 
      :fixed="option.fixed" 
      :img="option.img" 
      :outputSize="option.size" 
      :outputType="option.outputType"
      :info="option.info"
      :canMoveBox="option.canMoveBox"
      :autoCrop="option.autoCrop">
    </vue-cropper>
    <div class="tools">
      <label class="btn" for="uploads">上传头像</label>
      <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg"
        @change="uploadImg($event, 1)">
      <button @click="handleSubmit" class="btn">保存头像</button>
    </div>
  </div>
</template>

<script>
  import {mapState} from 'vuex'
  import VueCropper from 'vue-cropper';
  import { getItem } from '@utils/localStorage';
  import Alert from '@components/Alert';
  import Header from '@components/Header';
  import Confirm from '@components/Confirm';
  import loading from '@components/loading/loading';
  export default {

    components: {
      VueCropper: VueCropper,
      Header: Header
    },
    data() {
      return {
        option: {
          img: getItem('src'),
          size: 1,
          info: true,
          outputType: 'png',
          canMoveBox: true,
          fixed: true,
          autoCrop: true
        }
      };
    },

    mounted() {},

    methods: {
      postAvatar() {
        loading.show();
        this.$refs.cropper.getCropBlob(async (data) => {
          let files = new window.File([data], this.name, {type: this.type});
          const formdata = new window.FormData();
          formdata.append('file', files);
          formdata.append('username', getItem('userid'));
          const res = await this.$store.dispatch('uploadAvatar', formdata);
          loading.hide();
          if (res.errno === 0) {
            console.log(res);
            console.log(res.data.url);
            this.$store.commit('setUserInfo', {
              type: 'src',
              value: res.data.url
            });
            await Alert({
              content: '上传成功'
            });
            this.$router.push('/home');
          } else {
            Alert({
              content: '上传失败'
            })
          }
        })
      },
      async handleSubmit() {
        const res = await Confirm({
          title: '提示',
          content: '确定上传头像吗?'
        });
        if (res === 'submit') {
          this.postAvatar();
        }
      },
      uploadImg(e, num) {
        /* global FileReader Blob */
        // 上传图片
        // this.option.img
        const file = e.target.files[0];
        console.log(file);
        if (!/\.(jpg|jpeg|png|webp|GIF|JPG|PNG)$/.test(e.target.value)) {
          Alert({
            content: '图片类型必须是jpeg,jpg,png中的一种!'
          })
          return false;
        }

        if (file.size > 3 * 1024 * 1024) {
          Alert({
            content: '图片大小必须小于3M!'
          })
          return false;
        }

        this.name = file.name;
        this.type = file.type;
        const reader = new FileReader();
        reader.onload = (e) => {
          let data;
          if (typeof e.target.result === 'object') {
            data = window.URL.createObjectURL(new Blob([e.target.result]));
          } else {
            data = e.target.result;
          }
          if (num === 1) {
            this.option.img = data;
          }
        }
        reader.readAsArrayBuffer(file);
      }
    },
    computed: {
      ...mapState({
        userid: state => state.userInfo.userid,
        src: state => state.userInfo.src
      })
    }
  }
</script>
<style lang="stylus" rel="stylesheet/stylus" scoped>
  .wrapper {
    width: 375px;
    height: 375px;
  }
  .btn {
    display: inline-block;
    line-height: 1;
    white-space: nowrap;
    cursor: pointer;
    background: #fff;
    border: 1px solid #c0ccda;
    color: #1f2d3d;
    text-align: center;
    box-sizing: border-box;
    outline: none;
    margin: 20px 10px 0 0;
    padding: 9px 15px;
    font-size: 14px;
    border-radius: 4px;
    color: #fff;
    background-color: #50bfff;
    border-color: #50bfff;
    transition: all .2s ease;
    text-decoration: none;
    user-select: none;
  }
  .tools {
    display: flex;
    justify-content center;
  }
</style>
