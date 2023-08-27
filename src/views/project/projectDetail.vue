
<template>
    <div class="app-container">
        <div class="main-wrapper">
            <div class="main-header">
                <span class="title">项目详情</span>
            </div>
            <div class="main-content">
                <el-form class="formBody" ref="editProjectForm" :model="editProjectForm" :rules="editProjectFormRules"
                    label-width="80px" label-position="top">
                    <el-row>
                        <el-col :span="8">
                            <el-form-item label="项目名称" prop="name">
                                <el-input v-model="editProjectForm.name" placeholder="请输入项目名称" @change="nameChange" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="创建人" prop="name">
                                <el-input v-model="editProjectForm.Creator.name" placeholder="请输入项目名称" disabled
                                    @change="nameChange" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="项目描述" prop="descript">
                                <el-input v-model="editProjectForm.descript" placeholder="请输入项目描述"
                                    @change="descriptChange" />
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="创建时间" prop="date">
                                <el-date-picker v-model="editProjectForm.create_time" type="date" value-format="yyyy-MM-dd"
                                    placeholder="请选择创建时间" style="width: 100%;" disabled>
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="开始时间" prop="date">
                                <el-date-picker v-model="editProjectForm.begin_time" type="date" value-format="yyyy-MM-dd"
                                    placeholder="请选择开始时间" style="width: 100%;" @change="timeChange">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="结束时间" prop="date">
                                <el-date-picker v-model="editProjectForm.end_time" type="date" value-format="yyyy-MM-dd"
                                    placeholder="请选择结束时间" style="width: 100%;" @change="timeChange">
                                </el-date-picker>
                            </el-form-item>
                        </el-col>
                        <el-col :span="8">
                            <el-form-item label="项目状态" prop="status">
                                <el-switch v-model="editProjectForm.status" active-value="2" inactive-value="1"
                                    active-text="已完成" inactive-text="进行中" @change="statusChange"></el-switch>
                            </el-form-item>
                        </el-col>
                    </el-row>
                </el-form>
            </div>
        </div>
    </div>
</template>

<script>
import { apiPost } from '@/utils/request' // 引入请求方法
import { getSessionStorage } from '@/utils/index'
export default {
    data() {
        return {
            priorityOpts: [
                {
                    name: '无',
                    value: '0'
                }, {
                    name: '低',
                    value: '1'
                }, {
                    name: '中',
                    value: '2'
                }, {
                    name: '高',
                    value: '3'
                }
            ],
            userOpts: [],// 用户列表
            // 编辑项目表单
            editProjectForm: {
                Creator: {
                    name: ''
                }
            },
            // 表单验证规则
            // 表单验证规则
            editProjectFormRules: {
                name: [
                    { required: true, message: '请输入项目名称', trigger: 'blur' }
                ],
                descript: [
                    { required: true, message: '请输入项目描述', trigger: 'blur' }
                ]
            }
        }
    },
    mounted() {
        this.queryProjectDetail()
    },
    methods: {
        // 获取项目详情
        queryProjectDetail() {
            const params = {
                cmd: "project_detail",
                sid: getSessionStorage('token'),
                data: {
                    project_id: this.$route.params.id
                }
            }
            apiPost('/V2/index_prod.php', {
                data: {
                    json: JSON.stringify(params)
                }
            }).then((res) => {
                const { data } = res
                this.editProjectForm = data
            })
        },
        // 提交修改项目名称表单
        nameChange() {
            this.$refs.editProjectForm.validate(valid => {
                if (valid) {
                    const params = {
                        cmd: "project_nameset",
                        sid: getSessionStorage('token'),
                        data: {
                            project_id: this.editProjectForm.project_id,
                            name: this.editProjectForm.name
                        }
                    }
                    apiPost('/V2/index_prod.php', {
                        data: {
                            json: JSON.stringify(params)
                        }
                    }).then((res) => {
                        this.queryProjectDetail()
                    })
                } else {
                    return false
                }
            })
        },
        // 提交修改项目描述表单
        descriptChange() {
            this.$refs.editProjectForm.validate(valid => {
                if (valid) {
                    const params = {
                        cmd: "project_descset",
                        sid: getSessionStorage('token'),
                        data: {
                            project_id: this.editProjectForm.project_id,
                            descript: this.editProjectForm.descript
                        }
                    }
                    apiPost('/V2/index_prod.php', {
                        data: {
                            json: JSON.stringify(params)
                        }
                    }).then((res) => {
                        this.queryProjectDetail()
                    })
                } else {
                    return false
                }
            })
        },
        // 提交修改项目日期表单
        timeChange() {
            this.$refs.editProjectForm.validate(valid => {
                if (valid) {
                    const params = {
                        cmd: "project_timeset",
                        sid: getSessionStorage('token'),
                        data: {
                            project_id: this.editProjectForm.project_id,
                            begin_time: this.editProjectForm.begin_time ? this.editProjectForm.begin_time : '',
                            end_time: this.editProjectForm.end_time ? this.editProjectForm.end_time : '',
                        }
                    }
                    apiPost('/V2/index_prod.php', {
                        data: {
                            json: JSON.stringify(params)
                        }
                    }).then((res) => {
                        this.queryProjectDetail()
                    })
                } else {
                    return false
                }
            })
        },
        // 提交项目完成请求
        statusChange(val) {
            if (val === '2') {
                const params = {
                    cmd: "project_complete",
                    sid: getSessionStorage('token'),
                    data: {
                        project_id: this.editProjectForm.project_id
                    }
                }
                apiPost('/V2/index_prod.php', {
                    data: {
                        json: JSON.stringify(params)
                    }
                }).then((res) => {
                    this.queryProjectDetail()
                })
            } else {
                const params = {
                    cmd: "project_restart",
                    sid: getSessionStorage('token'),
                    data: {
                        project_id: this.editProjectForm.project_id
                    }
                }
                apiPost('/V2/index_prod.php', {
                    data: {
                        json: JSON.stringify(params)
                    }
                }).then((res) => {
                    this.queryProjectDetail()
                })
            }
        }
    }
}
</script>
<style lang="scss" scoped></style>