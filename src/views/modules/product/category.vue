<template>
  <div>
    <el-tree :data="menus" :props="defaultProps"
             show-checkbox node-key="catId"
             :expand-on-click-node="false"
             :default-expanded-keys="expandedKey"
             draggable
             :allow-drop="allowDrop">
    <span class="custom-tree-node" slot-scope="{ node, data }">
        <span>{{ node.label }}</span>
        <span>
          <el-button
            v-if="node.level <= 2"
            type="text"
            size="mini"
            @click="() => append(data)">
            添加
          </el-button>
          <el-button
            type="text"
            size="mini"
            @click="() => edit(data)">
            编辑
          </el-button>
          <el-button
            v-if="node.childNodes.length == 0"
            type="text"
            size="mini"
            @click="() => remove(node, data)">
            删除
          </el-button>
        </span>
      </span>
    </el-tree>

    <el-dialog
      :title="title"
      :visible.sync="dialogVisible"
      :closeOnClickModal="false"
      width="30%">
      <el-form :model="category">
        <el-form-item label="分类名称">
          <el-input v-model="category.name" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="图标">
          <el-input v-model="category.icon" autocomplete="off"></el-input>
        </el-form-item>
        <el-form-item label="计量单位">
          <el-input v-model="category.productUnit" autocomplete="off"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="submitData()">确 定</el-button>
      </span>
    </el-dialog>
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
        dialogVisible: false,
        category: {
          catId: null,
          name: '',
          parentCid: 0,
          catLevel: 0,
          showStatus: 1,
          sort: 0,
          icon: '',
          productUnit: ''
        },
        dialogType: '',
        title: '',
        maxLevel: 0
      }
    },
    // 计算属性，类似于data概念
    computed: {},
    // 监控data中的数据变化
    watch: {},
    // 方法集合
    methods: {
      getMenus() {
        this.$http({
          url: this.$http.adornUrl('/product/category/list/tree'),
          method: 'get'
        }).then(({data}) => {
          this.menus = data.data;
        })
      },
      // 拖动判断
      allowDrop(draggingNode, dropNode, type) {
        this.countNodeLevel(draggingNode.data);
        // 当前正在拖拽的节点+父节点所在深度不大于3即可
        let deep = this.maxLevel - draggingNode.data.catLevel + 1;
        if (type === 'inner') {
          return (deep + dropNode.level) <= 3;
        } else {
          return (deep + dropNode.parent.level) <= 3;
        }
      },
      countNodeLevel(node) {
        // 求出最大深度
        if (node.children != null && node.children.length > 0) {
          for (let i = 0; i < node.children.length; i++) {
            if (node.children[i].catLevel > this.maxLevel) {
              this.maxLevel = node.children[i].catLevel;
            }
            this.countNodeLevel(node.children[i]);
          }
        }
      },
      submitData() {
        if (this.dialogType === 'add') {
          this.addCategory();
        } else if (this.dialogType === 'edit') {
          this.editCategory();
        }
      },
      editCategory() {
        let {catId, name, icon, productUnit} = this.category;
        this.$http({
          url: this.$http.adornUrl('/product/category/update'),
          method: 'post',
          data: this.$http.adornData({catId, name, icon, productUnit}, false)
        }).then(({data}) => {
          this.$message({
            message: '菜单修改成功',
            type: 'success'
          })
          this.dialogVisible = false;
          // 刷新出新的菜单
          this.getMenus();
          // 设置默认展开的菜单
          this.expandedKey = [this.category.parentCid];
        })
      },
      edit(data) {
        // 弹出框，填写表单项修改菜单
        this.dialogVisible = true;

        // 修改
        this.dialogType = 'edit';
        this.title = '修改菜单';
        // 回显数据，发送请求获取节点最新的数据
        this.$http({
          url: this.$http.adornUrl(`/product/category/info/${data.catId}`),
          method: 'get'
        }).then(({data}) => {
          this.category.name = data.data.name;
          this.category.catId = data.data.catId;
          this.category.icon = data.data.icon;
          this.category.productUnit = data.data.productUnit;
          this.category.parentCid = data.data.parentCid;
          this.category.catLevel = data.data.catLevel;
          this.category.sort = data.data.sort;
          this.category.showStatus = data.data.showStatus;
        })
      },
      append(data) {
        // 弹出框，填写表单项保存菜单
        this.dialogVisible = true;

        // 添加
        this.dialogType = 'add';
        this.title = '添加菜单';
        // 绑定表单
        this.category.parentCid = data.catId;
        this.category.catLevel = data.catLevel * 1 + 1;
        this.category.name = '';
        this.category.icon = '';
        this.category.productUnit = '';
        this.category.catId = null;
        this.category.sort = 0;
        this.category.showStatus = 1;
      },
      remove(node, data) {
        this.$confirm(`是否删除【${data.name}】菜单?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          let ids = [data.catId];
          this.$http({
            url: this.$http.adornUrl('/product/category/delete'),
            method: 'post',
            data: this.$http.adornData(ids, false)
          }).then(({data}) => {
            this.$message({
              message: '菜单删除成功',
              type: 'success'
            })
            // 刷新出新的菜单
            this.getMenus();
            // 设置默认展开的菜单
            this.expandedKey = [node.parent.data.catId];
          })
        }).catch(() => {

        });
      },
      // 添加分类标签
      addCategory() {
        this.$http({
          url: this.$http.adornUrl('/product/category/save'),
          method: 'post',
          data: this.$http.adornData(this.category, false)
        }).then(({data}) => {
          this.$message({
            message: '保存成功',
            type: 'success'
          })
          // 关闭对话框
          this.dialogVisible = false;
          this.getMenus();
          // 设置默认展开的菜单
          this.expandedKey = [this.category.parentCid];
        })
      }
    },
    // 生命周期- 创建完成(可以访问当前this实例)
    created() {
      this.getMenus()
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
