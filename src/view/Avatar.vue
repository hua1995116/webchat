<template>
  <div class="wrapper">
    <vueCropper 
      ref="cropper" 
      :fixed="option.fixed" 
      :img="option.img" 
      :outputSize="option.size" 
      :outputType="option.outputType"
      :info="option.info"
      :canMoveBox="option.canMoveBox"
      :autoCrop="option.autoCrop">
    </vueCropper>
    <label class="btn" for="uploads">upload</label>
    <input type="file" id="uploads" style="position:absolute; clip:rect(0 0 0 0);" accept="image/png, image/jpeg, image/gif, image/jpg"
      @change="uploadImg($event, 1)">
    <button @click="handleSubmit" class="btn">上传图片</button>
  </div>
</template>

<script>
  import VueCropper from 'vue-cropper';
  import Alert from '../components/Alert';
  import { getItem, setItem } from '../utils/localStorage';
  export default {

    components: {
      VueCropper: VueCropper
    },
    data() {
      return {
        option: {
          img: '',
          size: 1,
          info: true,
          outputType: 'png',
          canMoveBox: true,
          fixed: true,
          autoCrop: true
        }
      };
    },

    computed: {},

    mounted() {},

    methods: {
      handleSubmit() {
        this.$refs.cropper.getCropBlob(async (data) => {
          let files = new window.File([data], this.name, {type: this.type})
          const formdata = new window.FormData()
          formdata.append('file', files);
          formdata.append('username', getItem('userid'));
          const res = await this.$store.dispatch('uploadAvatar', formdata);
          if (res.code === 0) {
            setItem('src', res.data.url);
          } else {
            Alert({
              content: '请输入100字以内'
            })
          }
        })
      },
      uploadImg(e, num) {
        /* global FileReader Blob */
        // 上传图片
        // this.option.img
        const file = e.target.files[0];
        if (!/\.(jpg|jpeg|png|webp|GIF|JPG|PNG)$/.test(e.target.value)) {
          Alert({
            content: '图片类型必须是jpeg,jpg,png中的一种!'
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
</style>
