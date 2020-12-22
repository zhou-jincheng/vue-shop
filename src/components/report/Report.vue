<template>
  <div class="report_container">
    <!-- 头部面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>

    <!-- 卡片区域 -->
    <el-card>
      <div id="main"
           style="width: 800px;height:400px;"></div>
    </el-card>
  </div>
</template>

<script>
import { request } from '../../network/request'
import echarts from 'echarts'
import lodash from 'lodash'
export default {
  data() {
    return {
      options: {
        title: {
          text: '用户来源'
        },
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'cross',
            label: {
              backgroundColor: '#E9EEF3'
            }
          }
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: [
          {
            boundaryGap: false
          }
        ],
        yAxis: [
          {
            type: 'value'
          }
        ]
      }
    }
  },
  async mounted() {
    // 基于准备好的dom，初始化echarts实例
    var myChart = echarts.init(document.getElementById('main'))

    // 获取图表的配置项和数据
    let {data: res} = await request('reports/type/1');
    if(res.meta.status !== 200) return this.$message.error('获取报表失败！');
    // 合并数据
    let option = lodash.merge(res.data, this.options)
    // 使用刚指定的配置项和数据显示图表。
    myChart.setOption(option)
  },
  methods: {
    
  }
}
</script>
<style lang="less" scoped>
.el-card {
  margin-top: 20px;
}
</style>
