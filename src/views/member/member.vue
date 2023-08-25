
<template>
  <div class="app-container">
    <div class="main-wrapper">
      <div class="main-header">
        <span class="title">用户查询</span>
      </div>
      <div class="main-content main-content1">
        <el-form ref="queryParams" :model="queryParams" label-width="80px" label-position="top">
          <el-row>
            <el-col :md="4" class="md4">
              <el-form-item label="姓名" prop="name">
                <el-input v-model="queryParams.name" placeholder="请输入姓名" />
              </el-form-item>
            </el-col>
            <el-col :md="3">
              <el-form-item class="textLeft param">
                <el-button type="warning" size="mini" @click="queryList('queryParams')">查询</el-button>
                <el-button type="danger" size="mini" @click="resetData('queryParams')">重置</el-button>
              </el-form-item>
            </el-col>
          </el-row>
        </el-form>
      </div>
    </div>

    <div class="main-wrapper">
      <div class="main-header">
        <span class="title">用户列表</span>
      </div>
      <!--列表-->
      <el-table :data="tableList" highlight-current-row height="530" border>
        <el-table-column type="index" width="65" label="序号" align="center" />
        <el-table-column prop="name" align="center" label="姓名" />
        <el-table-column prop="phone" align="center" label="手机号码" />
        <el-table-column prop="dept" align="center" label="部门" :show-overflow-tooltip="true" />
        <el-table-column prop="email" align="center" label="邮箱" />
      </el-table>
      <!--分页-->
      <el-pagination layout="total" :total="total" />
    </div>
  </div>
</template>

<script>
import { apiPost } from '@/utils/request' // 引入请求方法
import { getSessionStorage } from '@/utils/index'
export default {
  data() {
    return {
      // 表格查询参数
      queryParams: {
        name: ''
      },
      total: 0,// 项目列表总数
      tableList: [],// 项目列表数据
    }
  },
  mounted() {
    this.queryTableList()
  },
  methods: {
    // 获取用户列表
    queryTableList() {
      const params = {
        cmd: 'user_list',
        sid: getSessionStorage('token'),
        data: {
          keyword: this.queryParams.name
        }
      }
      apiPost('/V2/index_prod.php', {
        data: {
          json: JSON.stringify(params)
        }
      }).then((res) => {
        const { data } = res
        this.total = data.total
        this.tableList = data.list
      })
    },
    // 查询按钮
    queryList: function (formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.queryTableList()
        } else {
          return false
        }
      })
    },
    // 重置按钮
    resetData(formName) {
      this.$refs[formName].resetFields()
      this.queryTableList()
    }
  }
}
</script>
