<template>
  <div class="good_wrap">
    <!-- 头部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片主体 -->
    <el-card>
      <!-- 头部搜索栏 -->
      <el-row>
        <el-input placeholder="请输入内容"
                  suffix-icon="el-icon-search"
                  v-model="queryParams.query">
        </el-input>
      </el-row>

    </el-card>
  </div>

</template>

<script>
export default {
  data() {
    return {
      //查询商品列表参数
      queryParams: {
        query: '',
        // 当前页
        pagenum: 1,
        // 每页显示条目
        pagesize: 5
      }
    }
  }
}
</script>
<style lang="less" scoped>
</style>
