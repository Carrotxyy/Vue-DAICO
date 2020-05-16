<template>
    <div id="apply">
        

        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="申请待处理" name="wait">
                <el-row :gutter="20">
                    <el-col :span="12" >
                        <el-input v-model="applyPro" placeholder="项目地址" ></el-input>
                        <span :class="appRed">{{appMes}}</span>
                    </el-col>
                    <el-col :span="2" >
                        <el-button type="success" @click="search"  >查找申请</el-button>
                    </el-col>
                </el-row>
                <el-row :gutter="20">
                    <el-col :span="24" v-for="obj in runData" :key="obj.address">
                        <div class="grid-content bg-purple" >
                            
                            <project :data="obj"  :isTrim="false" />
                            
                        </div>
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="提交申请" name="commit">
                <el-row :gutter="20">
                    <el-col :span="24" >
                        <div class="grid-content bg-purple">
                            
                            <table>
                                
                                <tr>
                                    <td>项目地址</td>
                                    <td>
                                        <el-input v-model="pro" placeholder="项目地址" ></el-input>
                                        <span :class="proRed">{{proMes}}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>资金描述</td>
                                    <td>
                                        <el-input v-model="des" placeholder="资金描述" ></el-input>
                                        <span :class="desRed">{{desMes}}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>申请的资金金额</td>
                                    <td>
                                        <el-input v-model="amount" placeholder="申请的资金金额"  :class="{borderRed:amountRed}"></el-input>
                                        <span :class="amountRed">{{amountMes}}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td>收钱账户</td>
                                    <td>
                                        <el-input v-model="recevier" placeholder="recevier"  :class="{borderRed:recRed}"></el-input>
                                        <span :class="recRed">{{recMes}}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td></td>
                                    <td>
                                        <el-button type="success" @click="apply"  >申请资金</el-button>
                                    </td>
                                </tr>
                            </table>
                            
                        </div>
                    </el-col>
                </el-row>
            </el-tab-pane>
        </el-tabs>


    </div>
</template>

<script>
    import API from "@/libs/project-api"
    export default {
        data : function(){
            return{
                activeName  :"wait",// 标签栏名
                runData     : [],   // 所有待确认的申请

                applyPro    : "",   // 查找申请的项目地址
                pro         : "",   // 项目地址
                des         : "" ,  // 申请资金用途的描述
                amount      : "",   // 申请的金额
                recevier    : "" ,  // 资金流向哪个账户

                appRed      : "",   // 查找申请的项目地址提示样式
                appMes      : "查找申请的项目地址",     // 查找申请的项目地址提示信息

                proRed      : "",   // 地址提示样式
                proMes      : "项目地址",              // 地址提示信息

                desRed      : "",   // 描述提示样式
                desMes      : "资金流向描述不能为空",   // 描述提示信息

                amountRed   : "",   // 金额提示样式
                amountMes   : "不能为空，负数，小数",   // 金额提示信息

                recRed      : "",   // 账户提示样式
                recMes      : "钱包地址",   // 账户提示信息
                }
        },
        methods: {
            async search(){
                await API.applyList(this.applyPro)
            },
            async apply(){
                if(this.desMes === "" && this.amountMes === "" && this.recMes === ""){
                    // 只有通过验证提示信息才能为 ""
                    let obj = {
                        des         : this.des,
                        amount      : this.amount,
                        recevier    : this.recevier
                    }
                    await API.applyMoney(this.pro,this.$account,obj)
                    return
                }
                
                this.$notify({
                    title: '申请情况',
                    message: '请填申请信息 ',
                    position: 'bottom-right',
                    type: 'error'
                });
            },
            handleClick(obj){
                this.activeName = obj.name
            }
            
        },
        watch:{
            applyPro:function (value) {
                let regex  =/^0x[a-fA-F0-9]{40}$/
                if(!regex.test(value)){
                    this.appRed = {'el-icon-circle-close':true,colorErr:true}
                    this.appMes = "请填写正确的地址"
                }else{
                    this.appRed = {'el-icon-circle-check':true,colorSuccess:true}
                    this.appMes = ""
                }
            },
            pro:function(value){
                
                let regex  =/^0x[a-fA-F0-9]{40}$/
                if(!regex.test(value)){
                    this.proRed = {'el-icon-circle-close':true,colorErr:true}
                    this.proMes = "请填写正确的地址"
                }else{
                    this.proRed = {'el-icon-circle-check':true,colorSuccess:true}
                    this.proMes = ""
                }
            },
            des:function(value){
                if(value === ""){
                    this.desRed = {'el-icon-circle-close':true,colorErr:true}
                    this.desMes = "资金流向不能为空"
                }else{
                    this.desRed = {'el-icon-circle-check':true,colorSuccess:true}
                    this.desMes = ""
                }
            },
            amount:function(value){
                let regex  = /^\+?[1-9][0-9]*$/
                if(!regex.test(value)){
                    this.amountRed = {'el-icon-circle-close':true,colorErr:true}
                    this.amountMes = "请正确输入金额"
                }else{
                    this.amountRed = {'el-icon-circle-check':true,colorSuccess:true}
                    this.amountMes = ""
                }
            },
            recevier:function(value){
                // 地址正则
                let regex = /^0x[a-fA-F0-9]{40}$/
                if(!regex.test(value)){
                    this.recRed = {'el-icon-circle-close':true,colorErr:true}
                    this.recMes = "请输入正确的地址"
                }else{
                    this.recRed = {'el-icon-circle-check':true,colorSuccess:true}
                    this.recMes = "" 
                }
            }

        }
    }
</script>

<style lang="scss" scoped>
    #apply{
        table{
            width: 80%;
            tr{
                // 每个tr 的第二个td
                td:nth-child(2){
                    width: 75%;
                }
                span{
                    font-size: 13px;;
                }
            }
        }
    }
    
    .colorErr{
        color: red;
    }
    .colorSuccess{
        color: #67c23a;
    }
    
</style>