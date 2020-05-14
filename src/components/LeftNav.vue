<template>
    <div id="jj">

        <el-menu default-active="1" class="el-menu-vertical-demo" router="true">
            <el-menu-item index="1" route="/">
                <i class="el-icon-menu"></i>
                <span slot="title">首页</span>
            </el-menu-item>
            <el-menu-item index="2"  route="/project-hall">
                <i class="el-icon-s-home"></i>
                <span slot="title">项目大厅</span>
            </el-menu-item>
            <el-submenu index="3">
                <template slot="title">
                    <i class="el-icon-setting"></i>
                    <span>项目管理</span>
                </template>
                <el-menu-item-group>
                    <template slot="title" class="group-title">
                        <i class="el-icon-s-custom"></i>
                        投资者管理
                    </template>
                    <el-menu-item index="3-1"  route="/investor/project-centre">项目中心</el-menu-item>
                    <el-menu-item index="3-2"  route="/investor/vote-centre">投票中心</el-menu-item>
                    <el-menu-item index="3-3" route="/investor/tap">提升TAP</el-menu-item>
                    <el-menu-item index="3-4" route="/investor/stop">终止合约</el-menu-item>
                </el-menu-item-group>
                <el-menu-item-group>
                    <template slot="title"  class="group-title">
                        <i class="el-icon-s-platform"></i>
                        开发者管理
                    </template>
                    <el-menu-item index="3-5" route="/developer/project-centre">项目中心</el-menu-item>
                    <el-menu-item index="3-6" route="/developer/apply">申请资金</el-menu-item>
                    <el-menu-item index="3-7" route="/developer/stop">终止合约</el-menu-item>
                </el-menu-item-group>
            </el-submenu>
        </el-menu>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" >
    .el-menu-vertical-demo{
        el-submenu{
            el-menu-item-group{
                template{
                    color: aquamarine ;
                }
            }
             
        }
    }
</style>