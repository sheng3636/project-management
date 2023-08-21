
<template>
    <div class="app-container">
        <div class="main-wrapper">
            <div class="main-header">
                <span class="title">项目看板</span>
            </div>
            <div class="main-content moduleCard">
                <div class="cardList" v-for="(item, index) in tableList" :key="index">
                    <div class="list-header">
                        <h2 class="list-title" title="点击重命名标题">
                            <span class="title-name">{{ item.name }}</span>
                            <span class="list-count">·<i>{{ item.card_num }}</i></span>
                        </h2>
                        <i class="iconfont icon-gengduo-shuxiang" title="更多操作"></i>
                    </div>
                    <ul class="cards-wrap">
                        <li class="card-event" v-for="(val, key) in item.card_list" :key="key">
                            <div class="card-head">
                                <div>
                                    <el-checkbox :checked="val.status === 1"
                                        @change="cardStatusChange($event, val)"></el-checkbox>
                                    <h3 class="card-name" :class="{ gray: val.status === 1 }">{{ val.name }}</h3>
                                </div>
                                <el-dropdown>
                                    <span class="el-dropdown-link">
                                        <i class="el-icon-arrow-down el-icon--right"></i>
                                    </span>
                                    <el-dropdown-menu slot="dropdown">
                                        <el-dropdown-item @click.native="editCardNameClick(val)">修改名称</el-dropdown-item>
                                        <el-dropdown-item>狮子头</el-dropdown-item>
                                        <el-dropdown-item @click.native="delCardClick(val)">删除</el-dropdown-item>
                                    </el-dropdown-menu>
                                </el-dropdown>

                            </div>
                            <div class="label-wrap">
                                <span class="board_viewlabel label-1"></span>
                                <span class="board_viewlabel label-2"></span>
                                <span class="board_viewlabel label-3"></span>
                                <span class="board_viewlabel label-4"></span>
                                <span class="board_viewlabel label-5"></span>
                            </div>
                            <p class="projectTime" :class="{ gray: val.status === 1 }">
                                <i class="iconfont icon-shizhong" title="更多操作"></i>
                                {{ val.begin_time }} - {{ val.end_time }}
                            </p>
                        </li>
                    </ul>
                    <div class="list-bottom" @click="showAddCardDialog(item)">
                        <i class="iconfont icon-jiahao"></i>
                        <span>添加卡片</span>
                    </div>
                </div>
                <div class="cardList add-list">
                    <el-form v-if="addmoduleVisi" class="addMoudleForm" ref="addMoudleForm" :model="addMoudleForm"
                        :rules="addMoudleFormRules">
                        <el-form-item prop="name">
                            <el-input v-model="addMoudleForm.name" placeholder="请输入新板块标题"></el-input>
                        </el-form-item>
                        <div class="btnGroup">
                            <span class="btn" @click="moduleSubmit('addMoudleForm')">确定</span>
                            <span class="btn" @click="addModuleClick">取消</span>
                        </div>
                    </el-form>
                    <div v-else @click="addModuleClick">
                        <i class="iconfont icon-jiahao"></i>
                        <span>添加新板块...</span>
                    </div>
                </div>
            </div>
        </div>
        <!-- 新增卡片 -->
        <add-card :add-card-visi="addCardVisi" :add-card-form="addCardForm" :dialog-title="addCardTitle"
            @addCardDialog="addCardDialog"></add-card>
        <!-- 修改卡片名称 -->
        <el-dialog title="标题" :visible.sync="editCardNameVisi" :close-on-click-modal="false" :close-on-press-escape="false"
            :before-close="editCardNameVisiDialog" width="30%">
            <el-form class="formBody" ref="editCardNameForm" :model="editCardNameForm" :rules="editCardNameFormRules"
                label-width="80px" label-position="top">
                <el-row>
                    <el-col :span="24">
                        <el-form-item label="标题" prop="name">
                            <el-input v-model="editCardNameForm.name" placeholder="请输入标题" />
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
            <span slot="footer" class="dialog-footer">
                <el-button @click="editCardNameVisiDialog">取 消</el-button>
                <el-button type="primary" @click="editCardNameSubmit('editCardNameForm')">确 定</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import { apiPost } from '@/utils/request' // 引入请求方法
import { getSessionStorage } from '@/utils/index'
import addCard from './addCard'
export default {
    components: {
        addCard
    },
    data() {
        return {
            tableList: [],// 看板列表
            // 模块创建参数
            addMoudleForm: {
                name: ''
            },
            addmoduleVisi: false,
            // 表单验证规则
            addMoudleFormRules: {
                name: [
                    { required: true, message: '请输入名称', trigger: 'blur' }
                ]
            },
            addCardVisi: false,// 是否显示创建卡片弹窗
            addCardTitle: '创建卡片',// 创建卡片弹窗标题
            // 卡片创建参数
            addCardForm: {
                module_id: '',
                name: '',
                date: '',
                priority: '',
                owner_ids: ''
            },
            editCardNameVisi: false,// 是否显示修改卡片弹窗
            // 修改卡片表单
            editCardNameForm: {
                name: '',
            },
            // 修改卡片表单验证规则
            editCardNameFormRules: {
                name: [
                    { required: true, message: '请输入标题', trigger: 'blur' }
                ]
            }
        }
    },
    mounted() {
        this.queryTableList()
    },
    methods: {
        // 获取看板列表
        queryTableList() {
            const params = {
                cmd: "project_board",
                sid: getSessionStorage('token'),
                data: {
                    project_id: this.$route.params.id
                }
            }
            apiPost('/V1/index_dev.php', {
                data: {
                    json: JSON.stringify(params)
                }
            }).then((res) => {
                const { data } = res
                this.tableList = data.module_list
            })
        },
        // 显示隐藏创建模块表单
        addModuleClick() {
            this.addmoduleVisi = !this.addmoduleVisi
        },
        // 提交创建模块表单并清空表单
        moduleSubmit(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    const params = {
                        cmd: "module_create",
                        sid: getSessionStorage('token'),
                        data: {
                            project_id: this.$route.params.id,
                            name: this.addMoudleForm.name
                        }
                    }
                    apiPost('/V1/index_dev.php', {
                        data: {
                            json: JSON.stringify(params)
                        }
                    }).then((res) => {
                        this.addmoduleVisi = false
                        this.queryTableList()
                        this.$refs[formName].resetFields()
                    })
                } else {
                    return false
                }
            })
        },
        // 弹出创建卡片弹窗
        showAddCardDialog(val) {
            this.addCardTitle = '创建卡片'
            this.addCardVisi = true
            this.addCardForm = {
                module_id: val.module_id
            }
        },
        // 关闭创建卡片弹窗
        addCardDialog() {
            this.addCardVisi = false
        },
        // 卡片完成与重新开始
        cardStatusChange(val, item) {
            console.log(val);
            if (val) {
                const params = {
                    cmd: "card_complete",
                    sid: getSessionStorage('token'),
                    data: {
                        card_id: item.card_id
                    }
                }
                apiPost('/V1/index_dev.php', {
                    data: {
                        json: JSON.stringify(params)
                    }
                }).then((res) => {
                    this.queryTableList()
                })
            } else {
                const params = {
                    cmd: "card_restart",
                    sid: getSessionStorage('token'),
                    data: {
                        card_id: item.card_id
                    }
                }
                apiPost('/V1/index_dev.php', {
                    data: {
                        json: JSON.stringify(params)
                    }
                }).then((res) => {
                    this.queryTableList()
                })
            }
        },
        // 显示修改卡片名称弹窗
        editCardNameClick(val) {
            this.editCardNameVisi = true
            this.editCardNameForm.card_id = val.card_id
            this.editCardNameForm.name = val.name
        },
        // 隐藏修改卡片名称弹窗
        editCardNameVisiDialog() {
            this.editCardNameVisi = false
        },
        // 提交修改卡片名称表单
        editCardNameSubmit(formName) {
            this.$refs[formName].validate(valid => {
                if (valid) {
                    const params = {
                        cmd: "card_nameset",
                        sid: getSessionStorage('token'),
                        data: {
                            card_id: this.editCardNameForm.card_id,
                            name: this.editCardNameForm.name
                        }
                    }
                    apiPost('/V1/index_dev.php', {
                        data: {
                            json: JSON.stringify(params)
                        }
                    }).then((res) => {
                        this.queryTableList()
                        this.editCardNameVisiDialog()
                    })
                } else {
                    return false
                }
            })
        },
        // 删除卡片
        delCardClick(val) {
            this.$confirm('确定删除该卡片?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                const params = {
                    cmd: "card_delete",
                    sid: getSessionStorage('token'),
                    data: {
                        card_id: val.card_id
                    }
                }
                apiPost('/V1/index_dev.php', {
                    data: {
                        json: JSON.stringify(params)
                    }
                }).then((res) => {
                    this.queryTableList()
                    this.$message({
                        message: '删除成功',
                        type: 'success'
                    });
                })
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import './projectDashboard';
</style>