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
    import isLogin from "@/libs/isLoginMetamask"
    import Vue from "vue"

    export default {
        data(){
            return{
                
                ethereumLogo:require("../../static/images/ethereum-logo.png")
            }
        },
        methods:{
            async login(){
                const account = await isLogin()
                if(account){
                    // 项目其他地方直接 this.$web3 就能访问了
                    Vue.prototype.$web3 = web3;
                    Vue.prototype.$account = account
                    this.$notify({
                        title: '授权情况',
                        message: '授权成功',
                        position: 'bottom-right',
                        type: 'success'
                    });
                    // 跳转至指定的路由
                    this.$router.push(this.$route.query.redirect)
                }else{
                    
                    if(typeof window.ethereum !== "undefined"){
                        window.ethereum.enable()
                        .catch(reject=>{
                            this.$notify({
                                title: '授权情况',
                                message: '授权失败',
                                position: 'bottom-right',
                                type: 'error'
                            });
                        })
                        .then(accounts =>{
                            Vue.prototype.$web3 = web3;
                            Vue.prototype.$account = account
                            this.$notify({
                                title: '授权情况',
                                message: '授权成功',
                                position: 'bottom-right',
                                type: 'success'
                            });
                        })
                    }
                    
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