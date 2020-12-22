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
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容"
                    v-model="queryParams.query"
                    clearable
                    @change="getGoodList"
                    @clear="getGoodList">
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="getGoodList"></el-button>
          </el-input>
        </el-col>
        <el-col :span="16">
          <el-button type="primary" @click="toAddGood">添加商品</el-button>
        </el-col>
      </el-row>

      <!-- 商品展示表格 -->
      <el-table :data="goodList" border stripe>
        <el-table-column type="index" label="#"></el-table-column>
        <el-table-column label="商品名称" prop="goods_name"></el-table-column>
        <el-table-column label="商品价格(元)" prop="goods_price" width="105"></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight" width="80"></el-table-column>
        <el-table-column label="创建时间" prop="add_time" width="160">
          <template slot-scope="scope">
            {{scope.row.add_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template slot-scope="scope">
            <el-button size="mini" type="primary" icon="el-icon-edit"></el-button>
            <el-button size="mini" type="danger" icon="el-icon-delete" @click="deleteGoodById(scope.row.goods_id)"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部分页模块 -->
      <el-pagination
        @size-change="sizeChange"
        @current-change="currentChange"
        :current-page.sync="queryParams.pagenum"
        :page-sizes="[5, 10, 15, 20]"
        :page-size="queryParams.pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total" background>
      </el-pagination>
      
    </el-card>
  </div>

</template>

<script>
import {request} from '../../network/request'
export default {
  data() {
    return {
      //查询商品列表参数
      queryParams: {
        query: '',
        // 当前页
        pagenum: 1,
        // 每页显示条目
        pagesize: 5,
      },
      //商品列表
      goodList: [],
      //商品总条目
      total: 0
    }
  },
  created() {
    this.getGoodList()
  },
  methods: {
    // 获取商品列表数据
    async getGoodList() {
      let {data: res} = await request({
        url: 'goods',
        params: this.queryParams
      });
      // console.log(res)
      if(res.meta.status !== 200) return this.$message.error('获取商品列表失败！');
      this.goodList = res.data.goods;
      this.total = res.data.total
    },
    // 每页显示条目改变时调用该方法
    sizeChange(pagesize) {
      this.queryParams.pagesize = pagesize;
      this.getGoodList()
    },
    // 当前页数发生改变时出发此函数
    currentChange(pagenum) {
      this.queryParams.pagenum = pagenum;
      this.getGoodList()
    },
    // 去添加商品页面
    toAddGood() {
      this.$router.push('/home/add');
    },
    async deleteGoodById(id) {
      let confirm = await this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
      }).catch((err) => console.log(err));
      if(!confirm) return this.$message.info('取消删除成功！');
      let {data: res} = await request({
        url: `goods/${id}`,
        method: 'delete'
      });
      if(res.meta.status !== 200) return this.$message.error('删除商品失败！');
      this.$message.success('删除商品成功！');
      this.getGoodList()
    }
  }
}
</script>
<style lang="less" scoped>
.el-card {
  margin-top: 20px;
}
.el-table {
  margin: 20px 0
}
</style>
