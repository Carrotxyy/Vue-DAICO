<template>
    <div id="home" >
            <img :src="ethereumLogo" class="image">
            <div style="padding: 14px;">
                <span>欢迎来到DAICO</span>
                <div class="bottom clearfix">
                     <el-button type="primary" @click="login">授权登录</el-button>
                </div>
            </div>
        
    </div>
</template>

<script>
    import web3 from "@/libs/connectWeb3"
    import Vue from "vue"

    export default {
        data(){
            return{
                ethereumLogo:require("../../static/images/ethereum-logo.png")
            }
        },
        methods:{
            login(){
                web3
                if(web3){
                    Vue.use(web3)
                    this.$notify({
                        title: '授权情况',
                        message: '授权成功',
                        position: 'bottom-right',
                        type: 'success'
                    });
                }else{
                    this.$notify({
                        title: '授权情况',
                        message: '授权失败，请查看是否下载metamask',
                        position: 'bottom-right',
                        type: 'error'
                    });
                }
            }
        }
    }
</script>

<style lang="scss" scoped>
    #home{
        text-align: center;
        span{
            font-size: 24px;
        }
        .bottom{
            margin-top: 10px;
        }
    }
</style>