
<template>
    <div class="router-container">
        <div class="menuWrap">
            <span class="title">{{ $route.query.projectName }}</span>
            <el-menu :default-active="activeIndex" class="el-menu-demo" mode="horizontal" @select="handleSelect">
                <el-menu-item index="billboard">看板</el-menu-item>
                <el-menu-item index="documents">文档</el-menu-item>
                <!-- <el-menu-item index="dashboard">报表</el-menu-item> -->
                <el-menu-item index="projectDetail">设置</el-menu-item>
            </el-menu>
        </div>
        <div class="routerWrap">
            <router-view />
        </div>
    </div>
</template>

<script>
export default {
    components: {
    },
    data() {
        return {
        }
    },
    computed: {
        activeIndex: function () {
            let path = this.$router.currentRoute.path
            if (path.includes('billboard')) {
                return 'billboard'
            } else if (path.includes('documents')) {
                return 'documents'
            } else if (path.includes('dashboard')) {
                return 'dashboard'
            } else {
                return 'projectDetail'
            }
        }
    },
    mounted() {
    },
    methods: {
        handleSelect(key) {
            this.$router.push({
                path: `/project/layout/${key}/${this.$route.params.id}`,
                query: {
                    projectName: this.$route.query.projectName
                }
            })
        }
    }
}
</script>
<style lang="scss" scoped>
.title {
    margin-right: 100px;
}

.menuWrap {
    display: flex;
    align-items: center;
    padding: 0 20px;
    box-shadow: 0 0 10px 0 rgba(128, 145, 165, 0.2);

    .el-menu--horizontal>.el-menu-item {
        height: 45px;
        line-height: 45px;
    }
}

.routerWrap {
    margin-top: 15px;
}
</style>