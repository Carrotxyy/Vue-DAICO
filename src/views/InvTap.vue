<template>
    <div>
        <el-input v-model="input" placeholder="项目地址"></el-input>
        <span :class="Red">{{Mes}}</span>
        <br> 
        <el-button type="success" @click="tap">提升TAP</el-button>
    </div>
</template>

<script>
    import API from "@/libs/project-api"
    export default {
        data : function(){
            return{
                input: "",              // 地址值
                Red  : "",              // 提示信息样式
                Mes  : "输入正确的地址", // 提示信息   
            }
        },
        methods:{
            tap(){
                if(this.Mes === ""){
                    API.investPromoteTap(this.input,this.$account)
                }else{
                    this.$notify({
                        title: '提升Tap',
                        message: '请正确的填写地址',
                        position: 'bottom-right',
                        type: 'error'
                    });
                }
                    
            }
        },
        watch:{
            input : function(value){
                let regex  =/^0x[a-fA-F0-9]{40}$/
                if(regex.test(value)){
                    this.Red = {'el-icon-circle-check':true,colorSuccess:true}
                    this.Mes = ""
                }else{
                    this.Red = {'el-icon-circle-close':true,colorErr:true}
                    this.Mes = "请填写正确的地址"    
                }
            }
        }
    }
</script>

<style lang="scss" scoped>

    .colorErr{
        color: red;
    }
    .colorSuccess{
        color: #67c23a;
    }
</style>