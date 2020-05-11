<template>
  <div id="app">
    
    <el-container>
      <!-- 左侧导航栏 -->
      <el-aside width="200px" :style="{'min-height':'100vh'}">
        <left-nav />
      </el-aside>
      <el-container>
        <el-header class="head">智能DAICO</el-header>
        <!-- 右侧两个显示区域 -->
        <el-main :style="{'padding': '0px'}">
          <el-card :body-style="{ padding: '10px','min-height':'100vh' }">
            <router-view/>
          </el-card>
        </el-main>
      </el-container>
    </el-container>
  </div>
</template>

<script>
import leftNav from "./components/LeftNav"
export default {
  components:{
    leftNav
  }
}
</script>

<style lang="scss">
  #app{
    .head{
      background: linear-gradient(to right, rgb(54, 209, 220), rgb(91, 134, 229));
      line-height: 60px;
      color: white;
    }
  }
</style>
