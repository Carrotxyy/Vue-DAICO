<template>
    <div>
        <el-tabs v-model="activeName" @tab-click="handleClick">
            <el-tab-pane label="等待投资项目" name="wait">
                <el-row :gutter="20">
                    <el-col :span="6" v-for="obj in runData" :key="obj.address">
                        <div class="grid-content bg-purple" @click="showDetails(obj)">
                            
                            <project :data="obj"  />
                            
                        </div>
                    </el-col>
                </el-row>
            </el-tab-pane>
            <el-tab-pane label="完成投资项目" name="second">
                <el-row :gutter="20">
                    <el-col :span="6" v-for="obj in endData" :key="obj.address">
                        <div class="grid-content bg-purple" @click="showDetails(obj)">
                            
                            <project :data="obj"  />
                            
                        </div>
                    </el-col>
                </el-row>
            </el-tab-pane>
        </el-tabs>
        <el-drawer
        title="我是标题"
        :visible.sync="drawer"
        :size="size"
        :with-header="false">
            <div class="content" >
                <h4> {{obj.describe}} </h4>
                <div >
                    <table>
                        <tr  v-for="item in Object.keys(obj)" :key="item">
                            <td class="key">
                                <strong>{{item}}:</strong>
                            </td>
                            <td class="value">
                                <span> {{obj[item]}} </span>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="invest" >
                    <el-input
                    placeholder="投资金额 ether (请按照项目信息填写!)"
                    suffix-icon="el-icon-s-finance"
                    v-model="money">
                    </el-input>
                    <el-button type="primary" @click="investIng" :disabled="buttonDis">投资</el-button>
                </div>
            </div>
        </el-drawer>
    </div>
</template>

<script>
    import project from "@/components/Project"
    import projectApi from "@/libs/project-api"
    export default {
        data(){
            return{
                size : "35%",           // 设置右侧抽屉宽度
                activeName : "wait",    // 默认选择处于募资的项目标签栏
                endData : [],           // 完成众筹的项目
                runData : [],           // 众筹阶段的项目
                obj : {                 // 当前点击的项目，以便右侧抽屉展示数据
                    // describe    :"加载中~~~" 
                },
                drawer:false,           // 是否显示右侧抽屉
                money : "",             // 用户投资的金额
                buttonDis : false        // 是否禁用button,默认不禁用
            }
        },
        methods: {
            handleClick(obj){
                if(obj.name === "wait"){
                    this.buttonDis = false
                }else{
                    this.buttonDis = true
                }
            },
            showDetails(_obj){          // 当点击某个项目时，设置当前项目的数据obj,显示抽屉
                this.obj = _obj
                this.drawer = true
            },
            async investIng(){                // 点击投资按钮
                // 检验是否为正整数
                let regex  = /^\+?[1-9][0-9]*$/
                
                if(!regex.test(this.money) || this.money < this.obj.min || this.money > this.obj.max){
                    this.$notify({
                        title: '投资情况',
                        message: '投资失败 ( 请按照项目要求给出合理的投资金额 !)',
                        position: 'bottom-right',
                        type: 'error'
                    });
                    this.money = ""     // 设置成初值
                    return
                }

                // 投资
                const message = await projectApi.invest(this.obj.address,this.$account,this.money)
                this.$notify({
                        title: '交易情况',
                        message: '交易成功',
                        position: 'bottom-right',
                        type: 'success'
                    });
                // 重新加载
                this.loadProject()
                
            },
            loadProject(){
                // 获取结束的项目
                projectApi.getProject()
                            .then(res=>{
                                console.log(res)
                                this.endData = res.ends
                                this.runData = res.runs
                            })
                            .catch(err=>{
                                console.log(err)
                            })
                this.activeName = "wait"
            },
        },
        // 创建dom成功后
        created: function(){
            this.loadProject()
        },
        components:{
            project
        }
    }
</script>

<style lang="scss" scoped>
    .content{
        padding-left: 20px;
        .invest{
            margin-top: 20px;
            button{
                margin-top: 10px;
            }
        }
        
    }
</style>