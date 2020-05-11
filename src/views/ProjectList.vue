<template>
    <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="等待投资项目" name="wait">
                <el-row :gutter="20">
                    <el-col :span="6" v-for="obj in listData" :key="obj.min">
                        <div class="grid-content bg-purple" @click="showDetails(obj)">
                            
                            <project :data="obj"  />
                            
                        </div>
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="完成投资项目" name="second">
                <el-row :gutter="20">
                    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
                    <el-col :span="6"><div class="grid-content bg-purple"></div></el-col>
                </el-row>
            </el-tab-pane>
        </el-tabs>
        <el-drawer
        title="我是标题"
        :visible.sync="drawer"
        :with-header="false">
            <span>
                <!-- {{obj.min}} -->
            </span>
        </el-drawer>
    </div>
</template>

<script>
    import project from "@/components/Project"
    import projectApi from "@/libs/project-api"
    export default {
        data(){
            return{
                activeName : "wait",
                listData : [
                    {
                        min : 10,
                        max : 20,
                        total : 500,
                        now : 200
                    },
                    {
                        min : 11,
                        max : 20,
                        total : 500,
                        now : 200
                    }
                ],
                obj : null,
                drawer:false,

            }
        },
        methods: {
            handleClick(name,event){

            },
            showDetails(_obj){
                this.obj = _obj
                this.drawer = true
            }
        },
        // 创建dom成功后
        created:async function(){
            // 获取结束的项目
            this.listData = await projectApi.endProject()
            this.obj = this.listData[0]
            console.log(this.listData)
        },
        components:{
            project
        }
    }
</script>

<style lang="scss" scoped>
    
</style>