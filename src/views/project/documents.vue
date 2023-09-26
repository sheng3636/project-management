
<template>
    <div class="app-container">
        <div class="main-wrapper">
            <div class="main-header">
                <span class="title">文档查询</span>
            </div>
            <div class="main-content main-content1">
                <el-form ref="queryParams" :model="queryParams" label-width="80px" label-position="top">
                    <el-row>
                        <el-col :md="4" class="md4">
                            <el-form-item label="文档类型" prop="type">
                                <el-select v-model="queryParams.type" placeholder="请选择文档类型" style="width:100%">
                                    <el-option v-for="item in docuOpts" :key="item.value" :label="item.label"
                                        :value="item.value">
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
                <span class="title">文档列表</span>
            </div>
            <el-table :data="tableList" border fit highlight-current-row>
                <el-table-column label="序号" width="65" fixed="left" align="center">
                    <template slot-scope="scope">
                        <span v-text="(queryParams.page - 1) * queryParams.num + (scope.$index + 1)"></span>
                    </template>
                </el-table-column>
                <el-table-column prop="name" align="center" label="文档名称" :show-overflow-tooltip="true" />
                <el-table-column align="center" width="220" label="创建人">
                    <template slot-scope="scope">
                        {{ scope.row.Creator.name }}
                    </template>
                </el-table-column>
                <el-table-column prop="create_time" align="center" width="200" label="创建时间" />
                <el-table-column prop="status" align="center" width="200" label="文档类型">
                    <template slot-scope="scope">
                        {{ scope.row.type === '1' ? '文档类' : scope.row.type === '2' ? '图片类' : '其他' }}
                    </template>
                </el-table-column>
                <el-table-column align="center" label="操作" width="160" fixed="right">
                    <template slot-scope="scope">
                        <div class="columnOptionBtn">
                            <el-button plain type="text" size="mini"
                                v-if="docuType(scope.row.name) === 'tuPian' || docuType(scope.row.name) === 'pdf'">
                                <a id="new-page-link" :href="scope.row.file_url" target="_blank">预览</a>
                            </el-button>
                            <el-button plain type="text" size="mini" @click="download(scope.row)">下载</el-button>
                            <el-button plain type="text" size="mini" @click="handleRemove(scope.row)">删除</el-button>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
            <!--分页-->
            <el-pagination :page-sizes="[10, 20, 30, 40]" layout="total, prev, pager, next, jumper" :total="total"
                @size-change="handleSizeChange" @current-change="handleCurrentChange" />
        </div>
    </div>
</template>

<script>
import { apiPost } from '@/utils/request' // 引入请求方法
import { getSessionStorage } from '@/utils/index'
export default {
    components: {
    },
    data() {
        return {
            // 文档状态
            docuOpts: [
                {
                    value: '0',
                    label: '全部'
                },
                {
                    value: '1',
                    label: '文档类'
                },
                {
                    value: '2',
                    label: '图片类'
                },
                {
                    value: '3',
                    label: '其他'
                }
            ],
            // 文档列表查询参数
            queryParams: {
                num: 10,
                page: 1,
                type: ''// 0-全部  1-文档类  2-图片类
            },
            total: 0,// 文档列表总数
            tableList: [],// 文档列表数据
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
        // 获取文档列表
        queryTableList() {
            const params = {
                cmd: "project_doclist",
                sid: getSessionStorage('token'),
                data: {
                    project_id: this.$route.params.id,
                    type: this.queryParams.type,
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
        // 下载附件
        async download(val) {
            const link = document.createElement('a')
            // 这里是将链接地址url转成blob地址，
            fetch(val.file_url).then(res => res.blob()).then(blob => {
                link.href = URL.createObjectURL(blob)
                // 下载文件的名称及文件类型后缀
                link.download = val.name
                document.body.appendChild(link)
                link.click()
                // 在资源下载完成后 清除 占用的缓存资源
                window.URL.revokeObjectURL(link.href)
                document.body.removeChild(link)
            })
        },
        // 卡片关联文档删除
        handleRemove(val) {
            this.$confirm('确定删除该附件?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const params = {
                    cmd: "card_docdel",
                    sid: getSessionStorage('token'),
                    data: {
                        doc_id: val.doc_id
                    }
                }
                apiPost('/V2/index_prod.php', {
                    data: {
                        json: JSON.stringify(params)
                    }
                }).then((resp) => {
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                    this.queryTableList()
                })
            })
        },
        // 文档类型区分
        docuType(val) {
            let typeArr = val.split('.')
            let type = typeArr[typeArr.length - 1].toLowerCase()
            if (type === 'jpeg' || type === 'jpg' || type === 'png' || type === 'gif') {
                return 'tuPian'
            } else if (type === 'docx' || type === 'doc') {
                return 'word'
            } else if (type === 'xls' || type === 'xlsx') {
                return 'excel'
            } else if (type === 'ppt' || type === 'pptx') {
                return 'ppt'
            } else if (type === 'pdf') {
                return 'pdf'
            } else if (type === 'rar' || type === 'zip' || type === 'jar' || type === 'arj') {
                return 'package'
            } else {
                return 'unknow'
            }
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
        // 查询按钮
        queryList: function (formName) {
            this.$refs[formName].validate(valid => {
                this.queryParams.page = 1
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
            this.queryParams.page = 1
            this.queryTableList()
            console.log('重置')
        }
    }
}
</script>