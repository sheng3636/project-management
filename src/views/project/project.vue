
<template>
  <div class="app-container">
    <div class="main-wrapper">
      <div class="main-header">
        <span class="title">项目查询</span>
      </div>
      <div class="main-content main-content1">
        <el-form ref="queryParams" :model="queryParams" label-width="80px" label-position="top">
          <el-row>
            <el-col :md="4" class="md4">
              <el-form-item label="项目状态" prop="status">
                <el-select v-model="queryParams.status" placeholder="请选择项目状态" style="width:100%">
                  <el-option v-for="item in statusOpts" :key="item.value" :label="item.label" :value="item.value">
                  </el-option>
                </el-select>
              </el-form-item>
            </el-col>
            <el-col :md="3">
              <el-form-item class="param">
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
        <span class="title">项目列表</span>
        <div class="tableHeadetBtn">
          <el-button type="primary" size="small" @click="showAddDialog()">新建</el-button>
        </div>
      </div>
      <el-table :data="tableList" border fit highlight-current-row @row-click="rowClick">
        <el-table-column type="index" width="65" align="center" label="序号" />
        <el-table-column prop="name" align="center" width="220" label="项目名称" :show-overflow-tooltip="true" />
        <el-table-column align="center" width="220" label="项目负责人">
          <template slot-scope="scope">
            {{ scope.row.Creator.name }}
          </template>
        </el-table-column>
        <el-table-column prop="descript" align="center" label="项目描述" :show-overflow-tooltip="true" />
        <el-table-column prop="begin_time" align="center" width="150" label="开始时间" />
        <el-table-column prop="end_time" align="center" width="150" label="结束时间" />
        <el-table-column prop="status" align="center" width="150" label="项目状态">
          <template slot-scope="scope">
            <el-tag :type="scope.row.status === '1' ? '' : 'success'" size="small" effect="plain">
              {{ scope.row.status === '1' ? '进行中' : '已结束' }}
            </el-tag>
          </template>
        </el-table-column>
      </el-table>
      <!--分页-->
      <el-pagination :page-sizes="[10, 20, 30, 40]" layout="total, prev, pager, next, jumper" :total="total"
        @size-change="handleSizeChange" @current-change="handleCurrentChange" />
    </div>
    <add-project :add-edit-visi="addEditVisi" :add-edit-form="addEditForm" @dialogClose="dialogClose"></add-project>
  </div>
</template>

<script>
import { apiPost } from '@/utils/request' // 引入请求方法
import { getSessionStorage } from '@/utils/index'
import addProject from './addProject'
export default {
  components: {
    addProject
  },
  data() {
    return {
      // 项目状态
      statusOpts: [
        {
          value: '0',
          label: '全部'
        },
        {
          value: '1',
          label: '进行中'
        },
        {
          value: '2',
          label: '已结束'
        }
      ],
      // 项目列表查询参数
      queryParams: {
        num: 10,
        page: 1,
        status: '1'// 0-全部  1-进行中  2-已结束
      },
      total: 0,// 项目列表总数
      tableList: [],// 项目列表数据
      // 新增编辑表单
      addEditForm: {
        name: '',
        descript: ''
      },
      addEditVisi: false, // 是否弹出新增编辑弹窗
    }
  },
  mounted() {
    this.queryTableList()
  },
  methods: {
    // 获取项目列表
    queryTableList() {
      const params = {
        cmd: "project_list",
        sid: getSessionStorage('token'),
        data: {
          status: this.queryParams.status,
          page: this.queryParams.page,
          num: this.queryParams.num
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
    // 弹出新增弹窗
    showAddDialog() {
      this.addEditVisi = true
      this.addEditForm = {}
    },
    // 关闭新增编辑弹窗
    dialogClose() {
      this.addEditVisi = false
    },
    // pageSize 改变时会触发
    handleSizeChange(val) {
      this.queryParams.num = val
      this.queryTableList()
    },
    // currentPage 改变时会触发
    handleCurrentChange(val) {
      this.queryParams.page = val
      this.queryTableList()
    },
    rowClick(row) {
      console.log(row);
      this.$router.push({
        path: `/project/layout/billboard/${row.project_id}`,
        query: {
          projectName: row.name
        }
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
      console.log('重置')
    }
  }
}
</script>
