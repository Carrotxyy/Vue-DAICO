## 基于以太坊的DAICO众筹

#### 项目描述

```js
基于Ethereum平台，使用Solidity、Nodejs、Vue等技术实现DAICO众筹项目

```

#### 项目分析

- ##### DAO是什么

  ```js
  中文全称: 分布式自治组织
  概念: 是一个以公开透明的计算机代码来体现的组织，其受控于股东。DAO的主要思想是建立一个无需分层管理即可完全运行的公司或组织。
  
  ```
  > 参考资料:https://cointelegraph.com/ethereum-for-beginners/what-is-dao
  
- ##### ICO是什么

  ```js
  中文全称 : 首次币发行
  概念 : 一种流行的加密货币众筹方法，主要由希望提供产品和服务的初创公司使用，通常与加密货币和区块链空间有关。
  
  ```

- ##### DAICO是什么

  ```js
  跟ICO都是加密货币众筹的方法，但是它结合分布式自治组织（DAO）和 ICO 的特点。
  极大地改进了 ICO 模型的缺点，同时又不至于太过复杂
  
  ```


- ##### DAICO优势

  ```js
  ICO缺点:
      1.在ICO项目中，当代币销售结束时，开发人员团队绝对有权使用所有捐款
      2.投资者对整个项目的资金、进程没有任何的管理权力，只能寄希望于开发团队的自觉性。但是当开发团队掌握大量资金的所有权，又无人监管时，大多数的开发团队都会懈怠，甚至拿钱跑路。
  
  
  DAICO优势
  	不再像ICO一样，DAICO允许投资者更紧密地控制资本。
      参与DAICO的投资者的特殊权力是，如果他们对项目不满意，他们可以要求投票以取消DAICO并提取剩余资金。如果项目团队表现良好，他们将从投资团队那里获得下一个TAP，以继续追求新的目标。
      相反，如果项目团队停滞不前或出现欺诈信号，则投资者可以立即提取剩余余额，将损失最小化
      开发团队也可以防止恶意的投资者进行妨碍开发进展的投票，终止合约重新创建众筹合约
  
  ```




  ![](https://bbtcdn.8btc.com/data/attachment/forum/201803/05/125128may0qe1ekzo2yy1e.png)

#### 项目要求

- ##### 遵循ERC20规范

  ```js
  
  
  // ERC20
  contract ERC20Interface {
      function totalSupply() public view returns (uint);
      function balanceOf(address tokenOwner) public view returns (uint balance);
      function allowance(address tokenOwner, address spender) public view returns (uint remaining);
      function transfer(address to, uint tokens) public returns (bool success);
      function approve(address spender, uint tokens) public returns (bool success);
      function transferFrom(address from, address to, uint tokens) public returns (bool success);
  
      event Transfer(address indexed from, address indexed to, uint tokens);
      event Approval(address indexed tokenOwner, address indexed spender, uint tokens);
  }
  
  ```

#### 合约流程

![](.\mdImgs\flowChart.jpg)