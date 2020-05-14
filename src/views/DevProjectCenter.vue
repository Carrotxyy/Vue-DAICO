<template>
    <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="等待投资项目" name="wait">
                <el-row :gutter="20">
                    <el-col :span="24" v-for="obj in runData" :key="obj.address">
                        <div class="grid-content bg-purple" @click="showDetails(obj)">
                            
                            <project :data="obj"  />
                            
                        </div>
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="完成投资项目" name="second">
                <el-row :gutter="20">
                    <el-col :span="24" v-for="obj in endData" :key="obj.address">
                        <div class="grid-content bg-purple" @click="showDetails(obj)">
                            
                            <project :data="obj"  />
                            
                        </div>
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="创建投资项目" name="create">
                <el-row :gutter="20">
                    <el-col :span="24">
                        <createProject  :load="loadProject"/>
                    </el-col>
                </el-row>
            </el-tab-pane>
        </el-tabs>
    </div>
</template>

<script>
    import project from "@/components/Project"
    import createProject from "@/components/CreateProject"

    import projectAPI from "@/libs/project-api"

    export default {
        data : function(){
            return{
                endData : [],       // 已完成投资的项目
                runData : [],       // 进行众筹的项目
                activeName : "wait" // 标签栏默认选中 众筹中那一栏
            }
        },
        methods:{
            handleClick(obj){
                this.activeName = obj.name
            },
            loadProject(){
                projectAPI.devProject(this.$account)
                            .then(res=>{
                                this.endData = res.ends
                                this.runData = res.runs
                                console.log("endData:",this.endData)
                                console.log("runData:",this.runData)
                            })
                            .catch(err=>{
                                console.log(err)
                            })
                this.activeName = "wait"
            }
        },
        created:function(){
            this.loadProject()
        },
        components:{
            project,
            createProject
        }
    }
</script>

<style lang="scss" scoped>

</style>