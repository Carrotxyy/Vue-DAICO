<template>
    <div id="create-p">
        <div id="create-content">
            <table>
                
                <tr>
                    <td>Token名</td>
                    <td>
                        <el-input v-model="tokenName" placeholder="token名"></el-input>
                    </td>
                </tr>
                <tr>
                    <td>Token符号</td>
                    <td>
                        <el-input v-model="tokenSmybol" placeholder="token符号"></el-input>
                    </td>
                </tr>
                <tr>
                    <td>最小投资金额</td>
                    <td>
                        <el-input v-model="min" placeholder="min"></el-input>
                    </td>
                </tr>
                <tr>
                    <td>最大投资金额</td>
                    <td>
                        <el-input v-model="max" placeholder="max"></el-input>
                    </td>
                </tr>
                <tr>
                    <td>集资目标</td>
                    <td>
                        <el-input v-model="total" placeholder="total"></el-input>
                    </td>
                </tr>
                <tr>
                    <td>集资限期</td>
                    <td>
                        <el-input v-model="daysAfter" placeholder="daysAfter"></el-input>
                    </td>
                </tr>
                <tr>
                    <td>项目描述</td>
                    <td>
                        <el-input v-model="des" placeholder="des"></el-input>
                    </td>
                </tr>
                <tr>
                    <td></td>
                    <td>
                        <el-button type="success" @click="create">创建项目</el-button>
                    </td>
                </tr>
            </table>
        </div>
    </div>
</template>

<script>
    import API from "@/libs/project-api"
    export default {
        props : ["load"],
        data:function(){
            return{
                tokenName   : "",
                tokenSmybol : "",
                min         : "",
                max         : "",
                total       : "",
                daysAfter   : "",
                des         : "",
            }
        },
        methods: {
            async create(){
                // 检验是否为正整数
                let regex  = /^\+?[1-9][0-9]*$/
                if(!regex.test(this.min) || !regex.test(this.max) || !regex.test(this.total) || !regex.test(this.daysAfter) ){
                    this.$notify({
                        title: '创建项目',
                        message: '请正确填写数值',
                        position: 'bottom-right',
                        type: 'error'
                    });
                    return
                }
                if(this.tokenSmybol === "" || this.tokenName ==="" || this.des === ""){
                    this.$notify({
                        title: '创建项目',
                        message: '选项不能为空',
                        position: 'bottom-right',
                        type: 'error'
                    });
                    return
                }
                console.log(this.min,this.max)
                if( Number(this.min) >= Number(this.max)){
                    
                    this.$notify({
                        title: '创建项目',
                        message: '最小投资不能大于最大投资',
                        position: 'bottom-right',
                        type: 'error'
                    });
                    return
                }
                if(Number(this.max) >= Number(this.total)){
                    this.$notify({
                        title: '创建项目',
                        message: '总投资不得小于最大投资',
                        position: 'bottom-right',
                        type: 'error'
                    });
                    return
                }

                // 创建项目
                const obj = {
                    tokenName   : this.tokenName,
                    tokenSmybol : this.tokenSmybol,
                    daysAfter   : this.daysAfter,
                    min         : this.min,
                    max         : this.max,
                    total       : this.total,
                    des         : this.des,
                }

                await API.createProject(obj,this.$account)
                // 重新加载当前开发者创建的项目
                this.load()
            },
            
            
        },
    }
</script>

<style lang="scss" scoped>
    #create-content{
        width: 30%;
        margin: auto;
    }
</style>