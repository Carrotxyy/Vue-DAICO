<template>
    <div>

        <el-row :gutter="20">
            <el-col :span="24" v-for="obj in datas" :key="obj.address">
                <div class="grid-content bg-purple" >
                    
                    <project :data="obj"  :isTrim="false" />
                    <el-button type="danger" @click="stopContract(obj.address)" >终止合约</el-button>
                </div>
            </el-col>
        </el-row>
    </div>
</template>

<script>
    import API from "@/libs/project-api"
    import project from "@/components/Project"
    export default {
        data : function(){
            return{
                datas : [],
            }
        },
        methods : {
            async stopContract(contractAddr){

                this.$prompt('请手动输入需要终止合约的地址', '提示', {
                        confirmButtonText: '确定',
                        cancelButtonText: '取消',
                        inputPattern: /^0x[a-fA-F0-9]{40}$/,
                        inputErrorMessage: '地址格式不正确'
                    })
                    .then(({ value }) => {
                        if(value === contractAddr){
                            API.devStop(contractAddr,this.$account)
                                .then(res=>{
                                    console.log(res)
                                    this.$notify({
                                        title: '终止合约',
                                        message: '终止合约成功',
                                        position: 'bottom-right',
                                        type: 'success'
                                    });
                                })
                                .catch(err=>{
                                    this.$notify({
                                        title: '终止合约',
                                        message: '终止合约失败(你可能不是合约的创造者！)' + err,
                                        position: 'bottom-right',
                                        type: 'error'
                                    });
                                })
                            
                        }else{
                            
                            this.$message({
                                type: 'error',
                                message: '地址不同'
                            });  
                        }
                    })
                    .catch(() => {
                        this.$message({
                            type: 'error',
                            message: '取消终止'
                        });       
                    });

            },
            loadProject(){
                API.devProject(this.$account)
                    .then(res=>{
                        this.datas.push(...res.runs)
                        this.datas.push(...res.ends)
                    })
                    .catch(err=>{
                        console.log(err)
                    })
            }
        },
        created:function(){
            this.loadProject()
        },
        components:{
            project
        }
    }
</script>

<style lang="scss" scoped>

</style>