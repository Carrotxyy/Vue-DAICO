<template>
    <div >
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="投资项目" name="wait">
                <el-row :gutter="20">
                    <el-col :span="24" v-for="obj in runData" :key="obj.address">
                        <div class="grid-content bg-purple" >
                            
                            <project :data="obj"  :isTrim="false" />
                            
                        </div>
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="持币项目" name="second">
                <el-row :gutter="20">
                    <el-col :span="24" v-for="obj in endData" :key="obj.address">
                        <div class="grid-content bg-purple" >
                            
                            <project :data="obj" :isTrim="false" />
                            
                        </div>
                    </el-col>
                </el-row>
            </el-tab-pane>
            
        </el-tabs>
    </div>
</template>

<script>
    import API from "@/./libs/project-api"
    import project from "@/components/Project"
    export default {
        data : function(){
            return{
                activeName  : "wait",   // 标签栏默认

                runData     : [],       // 投资中的项目
                endData     : [],       // 完成投资项目
            }
        },
        methods: {
            handleClick(obj){
                this.activeName = obj.name
            },
            loadData(){
                API.investProject(this.$account)
                    .then(res=>{
                        console.log(res)
                        this.runData = res.runs
                        this.endData = res.ends
                    })
                    .catch(err=>{
                        console.log(err)
                    })
                this.activeName = "wait"
            }
        },
        created:function(){
            this.loadData()
        },
        components:{
            project
        }
    }   
</script>

<style lang="scss" scoped>

</style>