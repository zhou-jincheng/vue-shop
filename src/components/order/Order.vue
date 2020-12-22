<template>
  <div class="order_container">
    <!-- 头部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 卡片区域 -->
    <el-card>
      <!-- 顶部搜索栏 -->
      <el-row>
        <el-col :span="8">
          <el-input placeholder="请输入内容"
                    v-model="queryParams.query"
                    @change="queryOrder"
                    clearable>
            <el-button slot="append"
                       icon="el-icon-search"
                       @click="queryOrder"></el-button>
          </el-input>
        </el-col>
      </el-row>

      <!-- 订单表格区域 -->
      <el-table :data="orderList"
                border
                stripe>
        <el-table-column type="index"
                         label="#"></el-table-column>
        <el-table-column label="订单编号"
                         prop="order_number"
                         width="240"></el-table-column>
        <el-table-column label="订单价格"
                         prop="order_price"></el-table-column>
        <el-table-column label="是否付款">
          <template slot-scope="scope">
            <el-tag type="success"
                    v-if="scope.row.pay_status === '1'">已付款</el-tag>
            <el-tag type="danger"
                    v-else>未付款</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否发货"
                         prop="is_send"></el-table-column>
        <el-table-column label="下单时间"
                         width="160">
          <template slot-scope="scope">
            {{scope.row.create_time | dateFormat}}
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template>
            <el-button size="mini"
                       type="primary"
                       icon="el-icon-edit"
                       @click="changeOrder"></el-button>
            <el-button size="mini"
                       type="success"
                       icon="el-icon-location"
                       @click="queryOrder"></el-button>
          </template>
        </el-table-column>
      </el-table>

      <!-- 底部分页模块 -->
      <el-pagination @size-change="sizeChange"
                     @current-change="currentChange"
                     :current-page.sync="queryParams.pagenum"
                     :page-sizes="[5, 10, 15, 20]"
                     :page-size="queryParams.pagesize"
                     layout="total, sizes, prev, pager, next, jumper"
                     :total="total"
                     background>
      </el-pagination>

    </el-card>

    <!-- 修改订单对话框 -->
    <el-dialog title="修改地址"
               :visible.sync="changeDialogVisible"
               width="50%"
               @close="changeDialogClosed">
      <el-form :model="addressFormData"
               ref="addressFormRef"
               :rules="addressFormRules"
               label-width="100px">
        <el-form-item label="省市区/县"
                      prop="city">
          <el-cascader :options="cityData"
                       v-model="addressFormData.city"
                       clearable
                       :props="addressProps">
          </el-cascader>
        </el-form-item>
        <el-form-item label="详细地址"
                      prop="home">
          <el-input v-model="addressFormData.home"
                    clearable></el-input>
        </el-form-item>
      </el-form>

      <span slot="footer">
        <el-button @click="changeDialogVisible = false">取消</el-button>
        <el-button type="primary"
                   @click="changeAddress">确认</el-button>
      </span>

    </el-dialog>

  </div>
</template>

<script>
import { request } from '../../network/request'
import cityData from './citydata'
export default {
  data() {
    return {
      queryParams: {
        query: '',
        pagenum: 1,
        pagesize: 5,
      },
      orderList: [],
      total: 0,
      changeDialogVisible: false,
      cityData: cityData,
      addressFormData: {
        city: [],
        home: '',
      },
      addressFormRules: {
        city: [{ required: true, message: '请选择省市区/县', trigger: 'blur' }],
        home: [{ required: true, message: '请选择省市区/县', trigger: 'blur' }],
      },
      addressProps: {
        label: 'label',
        value: 'value',
        children: 'children',
      },
    }
  },
  created() {
    this.getOrderList()
  },
  methods: {
    async getOrderList() {
      let { data: res } = await request({
        url: 'orders',
        params: this.queryParams,
      })
      // console.log(res);
      if (res.meta.status !== 200)
        return this.$message.error('获取订单列表失败！')
      this.orderList = res.data.goods
      this.total = res.data.total
    },
    sizeChange(pagesize) {
      this.queryParams.pagesize = pagesize
      this.getOrderList()
    },
    currentChange(pagenum) {
      this.queryParams.pagenum = pagenum
      this.getOrderList()
    },
    queryOrder() {
      this.$message.info('暂不支持此功能')
    },
    changeOrder() {
      this.changeDialogVisible = true
    },
    changeDialogClosed() {
      this.$refs.addressFormRef.resetFields()
    },
    changeAddress() {
      this.changeDialogVisible = false;
      this.$message.info('暂不支持此功能')
    }
  },
}
</script>
<style lang="less" scoped>
.el-card {
  margin-top: 20px;
}
.el-table {
  margin: 20px 0;
}
.el-cascader {
  width: 100%;
}
</style>
