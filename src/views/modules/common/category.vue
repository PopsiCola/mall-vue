<template>
  <div>
    <el-tree :data="menus"
             :props="defaultProps"
             node-key="catId"
             ref="menuTree"
             @node-click="nodeClick">
    </el-tree>
  </div>
</template>

<script>
  // 这里可以导入其他文件(比如：组件，工具js，第三方js，json文件，图片文件等等)
  // 例如：imprt 《组件名》 from '《组件路径》'

  export default {
    // import引入的组件需要注入到对象中才能使用
    components: {},
    props: {},
    data() {
      return {
        menus: [],
        defaultProps: {
          children: 'children',
          label: 'name'
        },
        expandedKey: [],
      }
    },
    // 计算属性，类似于data概念
    computed: {},
    // 监控data中的数据变化
    watch: {},
    // 方法集合
    methods: {
      nodeClick(data, node, component) {
        console.log('树被点击了', data, node, component)
        // 向父组件发送事件
        this.$emit("tree-node-click", data, node, component);
      },
      getMenus() {
        this.$http({
          url: this.$http.adornUrl('/product/category/list/tree'),
          method: 'get'
        }).then(({data}) => {
          this.menus = data.data;
        })
      }
    },
    // 生命周期- 创建完成(可以访问当前this实例)
    created() {
      this.getMenus();
    },
    // 生命周期- 挂载完成(可以访问DOM元素)
    mounted() {
    },
    // 生命周期- 创建之前
    beforeCreate() {
    },
    // 生命周期- 挂在之前
    beforeMount() {
    },
    // 生命周期- 更新之前
    beforeUpdate() {
    },
    // 生命周期- 更新之后
    updated() {
    },
    // 生命周期- 销毁之前
    beforeDestroy() {
    },
    // 生命周期- 销毁完成
    destroyed() {
    },
    // 如果页面有keep-alive缓存功能，这个函数会触发
    activated() {
    }
  }
</script>

<style scoped>
  /*@import url(); 引入公共css*/
</style>
