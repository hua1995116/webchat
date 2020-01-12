<template>
  <i class="icon iconfont" :class="[sex === 'nan' ? 'icon-nan' : sex === 'nv' ? 'icon-nv': 'icon-weizhi']"></i>
</template>

<script>
export default {
  props: ['sex']
}

</script>
<style>
.icon-nan {
  color: rgb(90, 167, 249);
}
.icon-nv {
  color: rgb(153, 158, 168);
}
</style>