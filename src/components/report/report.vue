<template>
  <div>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/home' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>数据统计</el-breadcrumb-item>
      <el-breadcrumb-item>数据报表</el-breadcrumb-item>
    </el-breadcrumb>
    <el-card>
      <div id="giao"></div>
    </el-card>
  </div>
</template>
<script>
import echarts from 'echarts/lib/echarts'
// 引入折线图等组件
import 'echarts/lib/chart/line'
// 引入提示框和title组件，图例
import 'echarts/lib/component/tooltip'
import 'echarts/lib/component/grid'
import 'echarts/lib/component/legend'
import _ from 'lodash'
export default {
  data () {
    return {
      option: {}
    }
  },
  methods: {
    async getDataList () {
      const { data: res } = await this.$http.get('reports/type/1')
      if (res.meta.status !== 200) {
        return this.$message.error('获取数据失败')
      }
      this.option = res.data
    }
  },
  created () {
  },
  async mounted () {
    await this.getDataList()
    var myChart = echarts.init(document.querySelector('#giao'))
    var options = {
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
    var foption = _.merge(this.option, options)
    console.log(foption)
    myChart.setOption(foption)
  }
}
</script>
<style lang="less" scoped>
#giao {
  width: 800px;
  height: 500px;
}
</style>
