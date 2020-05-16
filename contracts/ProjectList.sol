pragma solidity ^0.4.26 ;


/** 
* @title SafeMath 
* @dev Math operations with safety checks that throw on error 
*/ 

library SafeMath { 
    function mul(uint a, uint b) internal pure returns (uint) { 
        uint c = a * b; 
        assert(a == 0 || c / a == b); 
        return c;
    }
    function div(uint a, uint b) internal pure returns (uint) { 
        // assert(b > 0); // Solidity automatically throws when dividing by 0 
        uint c = a / b; 
        // assert(a == b * c + a % b); // There is no case in which this doesn't hold 
        return c; 
    } 
    function sub(uint a, uint b) internal pure returns (uint) { 
        assert(b <= a); 
        return a - b; 
    } 
    function add(uint a, uint b) internal pure returns (uint) { 
        uint c = a + b; 
        assert(c >= a); 
        return c; 
    } 
}




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



contract ProjectList{
    
    using SafeMath for uint;
    // 项目集合
    address[] public  projectList;

    function createProject(string _name,string _smybol,uint daysAfter,uint _min,uint _max,uint _total,string _des) public {
        // 生成项目  , tap = total/10
        address addr = new Project(msg.sender,_name,_smybol,daysAfter,_min,_max,_total,_des,_total/10);
        
        projectList.push(addr);
    }
    
    // 返回所有项目address
    function getProjects() public view returns(address[]){
        return projectList;
    }

}




contract Project is ERC20Interface{
    using SafeMath for uint;

    address owner;          // 合约创始者
    uint    startTime;      // 合约开始投资时间
    uint    rewardTime;     // 在这个时间段进行投资的会额外赠送token
    uint    endTime;        // 合约结束投资时间
    uint    minInvest;      // 最小投资金额
    uint    maxInvest;      // 最大投资金额   
    uint    totalInvest;    // 目标投资金额
    string  describe;       // 项目描述
    uint    tap;            // 提取资金的上限

    address[]       stopAddr;     // 赞同终止合约的投资者
    address[]       operateTap;   // 赞同提升tap上限的投资者
    Payment[]       paymentList;  // 每笔资金的流动情况
    InvestorVote[]  ivList;       // 由投资者发起的投票活动情况
    /**
        资金的支出目的 des
        具体的金额 amount
        接收人是谁 recevier
        投票赞成的股东有哪些 supports
        反对意见的股东  opposes  
        投票是否已经结束 isAccomplish
    **/
    struct Payment{
        string      des;
        uint        amount;
        address     recevier;
        address[]   support;
        address[]   oppose;
        bool        isAccomplish;
    }

    // 投资者   表决类型 1.发起终止合约  2.提升tap
    /*
        是由谁发起的        owner
        对行为的描述        des
        表决 的 类型        voteType
        赞同的投资者        support
        反对的投资者        oppose
        投票 的 期限        startTime
        投票是否结束        isAccomplish
    */
    struct InvestorVote{
        address     owner;
        string      des;
        uint8       voteType;
        address[]   support;
        address[]   oppose;
        uint        startTime;
        bool        isAccomplish;
    }
    

    // ERC20规范
    string public name;                                                 // 代币名称
    string public smybol;                                               // 代币简称 一般是代币名称的首字母
    uint8  public decimals = 18;                                        // 代币最小的单位 默认是 18 (就像1ether == 1*10**18wei)
    uint   public total;                                                // 代币的总发行量

    address[]   addresses;                                              // 拥有token的账户数组
    mapping(address => uint) public  balances;                          // 表示每个账户对应的代币余额
    mapping(address => mapping(address => uint)) public _allowance;     // 权利授权 (我的账户 => 授权 其他账户 => 可用金额 ),类似于支付宝的亲子账号


    // 构造函数
    constructor(address _owner,string _name , string _smybol , uint daysAfter, uint _min , uint _max , uint _total , string _describe , uint _tap) public {
        
        owner       = _owner;
        name        = _name;
        smybol      = _smybol;
        // 设置开始时间
        startTime   = now;
        // 设置投资关闭时间
        endTime     = startTime + (daysAfter * 1 days);
        // 设置额外奖励时间
        rewardTime  = startTime + 1 days;

        minInvest   = _min;
        maxInvest   = _max;
        totalInvest = _total;
        describe    = _describe;
        tap         = _tap;
    }

    // total => 总token     favor => 赞成票的token数    oppose => 反对的token数
    event Stop(uint indexed total , uint indexed favor , uint indexed oppose);

    function totalSupply()public constant  returns(uint){
        return total;
    }
    function balanceOf(address _account)public constant  returns(uint){
        return balances[_account];
    }
    function allowance(address _owner , address _spender)public constant  returns(uint){
        return _allowance[_owner][_spender];
    }

    function _transfer(address _from , address _to , uint amount) internal {
        require(now > endTime , "现在还处于贡献模式，尚不能进行token的交易");
        require( _to != 0x0,"目标地址不能是0地址");
        require(balances[_from] >= amount,"当前token余额不足");
        require(balances[_from] + amount >= balances[_from],"转移token的数量不能是负数");
        
        // 记录转账之前的两个账户的token总额，以便验证交易后总量不变
        uint _total = balances[_from] + balances[_to];
        balances[_from] -= amount;
        balances[_to] += amount;
        
        if(!isExist(addresses,_to)){
            // 如果不存在添加到拥有token的用户数组中
            addresses.push(_to);
        }

        // 触发事件
        emit Transfer(_from,_to,amount);
        // 验证内部数据是否正确,跟require都是判断，只是使用的情景不一样
        assert(_total == balances[_from] + balances[_to]);
    }

    // 转移token
    function transfer(address _to , uint amount) public returns(bool) {
        _transfer(msg.sender,_to,amount);
        return true;
    }


    // 授权账户
    function approve(address spender , uint tokens) public returns(bool) {
        require(tokens >= 0 , "授权金额不能小于0");
        _allowance[msg.sender][spender] = tokens;
        // 触发事件
        emit Approval(msg.sender,spender,tokens);
        return true;
    }

    // 被授权用户使用授权者赋予他使用资金的权利 _from => 授权者   msg.sender => 被授权者,当前交易的人
    function transferFrom(address _from , address _to , uint amount) public returns(bool) {
        require(amount <= _allowance[_from][msg.sender],"转账金额大于授权的金额");
        _transfer(_from,_to,amount);
        // 减少授权上限
        _allowance[_from][msg.sender] -= amount;
        return true;
    }

    // 铸币
    function mint(address _to , uint amount)internal {
        require(amount > 0 , "造币数额需大于0");
        total += amount;
        balances[_to] += amount;
        if(!isExist(addresses,_to)){
            addresses.push(_to);
        }
        // 由于是铸币，所以这些币没有拥有者，所以from 对应的就是address(0) 也就是0地址
        emit Transfer(address(0),_to,amount);
    }

    // 销毁币
    function burn(address account , uint amount)internal {
        require(amount >= 0 );
        require(balances[account] >= amount);

        balances[account] -= amount;
        total -= amount;
    }


    modifier MustOwner(){
        require(msg.sender == owner,"只有合约缔造者才能触发的操作");
        _;
    }
    
    // 以下实现规划的功能


    // 投资(资金ether存入合约账户中)
    function invest() public payable {
        require(msg.value >= minInvest,"投资金额小于最小投资金额");
        require(msg.value <= maxInvest,"投资金额大于最大投资金额");
        require(now < endTime,"投资窗口已关闭！");

        // 投资者预计得到的token. 1,000  Tokens per 1ETH
        uint tokens ;
        if(now <= rewardTime){
            // 如果在奖励时间内，则奖励200token
            tokens = msg.value * 1200;
        }else{
            tokens = msg.value * 1000;
        }

        // 铸币，往投资者账户中存入token
        mint(msg.sender , tokens);
    }


    
    // 合约缔造者申请资金,每次只能有一个申请处于待处理中，当着个申请投票结束后，才能进行下一笔申请
    function createPayment(string memory _des,uint _amount,address _recevier) public  MustOwner {
        
        if(paymentList.length > 0){
            require(paymentList[paymentList.length-1].isAccomplish , "runing");

        }
        require(_amount <= tap , "no > tap");
        require(address(this).balance >= _amount,"no > balance");

        Payment memory p = Payment({
            des             : _des,
            amount          : _amount,
            recevier        : _recevier,
            support         : new address[](0),
            oppose          : new address[](0),
            isAccomplish    : false
        });

        paymentList.push(p);
    }

    // 获取申请资金列表的长度
    function getPaymentLength()public view returns(uint){
        return paymentList.length;
    }
    // 获取资金申请的情况
    function getPayment(uint index)public returns(string,uint,address,uint,uint,bool){
        return (paymentList[index].des,paymentList[index].amount,paymentList[index].recevier,paymentList[index].support.length,paymentList[index].oppose.length,paymentList[index].isAccomplish);
    }

    // 投资者投票
    function approvePayment(bool isOrNo) public returns(bool){
        require(paymentList.length > 0 , "暂无投票");
        Payment storage p = paymentList[paymentList.length-1];
        require(p.isAccomplish,"投票已结束");
        require(balances[msg.sender] > 0);
        require(isExist(p.support,msg.sender),"你已投了赞成票");
        require(isExist(p.oppose,msg.sender),"你已投了反对票");
        if(isOrNo){
            // 赞成
            p.support.push(msg.sender);
        }else{
            // 反对
            p.oppose.push(msg.sender);
        }
        veri(p);
        return true;
    }

    // 判断当前申请资金是否能结算(发放 | 拒绝)
    // Payment storage p 设置成指针传递
    // 动态的进行权重计算，每次有新的投资者投票，
    // 都会重新计算一次所有投过票的投资者的token占比(防止投资者投票后再通过二级市场交易token，再利用这些token进行投票)
    // 也维护了后期进场的投资者有投票的权利
    // 这样在投票期间，变相的约束了投资者token的交易
    function veri(Payment storage p) internal {
        
        uint most = (total / 10) * 6;
        uint supportCount = countToken(p.support);
        uint opposeCount = countToken(p.oppose);
        if(supportCount > most){
            // 赞成者大于半数,立即终止投票
            p.isAccomplish = true;
            // 发放资金
            p.recevier.transfer(p.amount);
        }else if(opposeCount > most){
            // 反对者大于半数,立即终止投票
            p.isAccomplish = true;
        }
    }

    // 判断是否存在于数组中
    function isExist(address[] arr , address target) internal pure returns(bool){
        for(uint i = 0 ; i < arr.length ; i++){
            if(arr[i] == target){
                return true;
            }
        }
        return false;
    }
    // 计算投票占比的token
    function countToken(address[] arr) internal view returns(uint) {
        uint count = 0;
        for(uint8 i = 0 ; i < arr.length ; i++){
            count += balances[arr[i]];
        }
        return count;
    }
    
    
    // 获取项目中基础信息
    function getAll() public view returns(address,string,uint,uint,uint,uint,string,uint,uint){
        // 发起人,描述，最小，最大，当前获得的资金，目标, 代币符号 ， 发行的总代比数量 , 合约结束投资时间
        return (owner,describe,minInvest,maxInvest,address(this).balance,totalInvest,smybol,total,endTime);
    }

    // 发起终止合约
    function stopContract() public returns(bool){
        if(msg.sender == owner){
            // 拥有者销毁合约,直接返还资金
            Cashback();
            return true;
        }else{
            require(balances[msg.sender] > 0 , "没持有token无权限");
            require(ivList[ivList.length-1].isAccomplish,"当前已有投票待处理中");

            InvestorVote memory iv = InvestorVote({
                owner           : msg.sender,
                des             : "对项目方太失望，提前终止合约",
                voteType        : 1,
                support         : new address[](0),
                oppose          : new address[](0),
                startTime       : now,
                isAccomplish    : false
            });
            iv.support[0] = msg.sender;
            ivList.push(iv);
            // 触发事件，返回情况
            emit Stop(total,countToken(iv.support),countToken(iv.oppose));
        }
        
    }

    
    // 发起提升tap
    function promoteTap() public  {
        if(msg.sender == owner){
            require(false,"创始者不能提升tap");
        }
        
        require(balances[msg.sender] > 0 , "没持有token无权限");
        require(ivList[ivList.length-1].isAccomplish,"当前已有投票待处理中");
        

        InvestorVote memory iv = InvestorVote({
            owner           : msg.sender,
            des             : "对项目方的进度很满意，提升tap加快进展",
            voteType        : 2,
            support         : new address[](0),
            oppose          : new address[](0),
            startTime       : now,
            isAccomplish    : false
        });
        iv.support[0] = msg.sender;
        ivList.push(iv);
        // 触发事件，返回情况
        Stop(total,countToken(iv.support),countToken(iv.oppose));
    }

    function ivLength()public view returns(uint){
        return ivList.length;
    }
    

    //  进行投票
    function Vote(bool isOrNo)public{
        require(ivList.length > 0 , "暂无投票");
        InvestorVote storage iv = ivList[ivList.length-1];
        
        if(now > iv.startTime  + 10 days){
            iv.isAccomplish = true;
            require(false,"投票超时");
        }
        require(iv.isAccomplish == false , "投票结束");
        require(balances[msg.sender] > 0 , "没持有token无权限");
        require(!isExist(iv.support,msg.sender),"你已投了赞同票");
        require(!isExist(iv.oppose,msg.sender),"你已投了反对票");

        if(isOrNo){
            iv.support.push(msg.sender);
        }else{
            iv.oppose.push(msg.sender);
        }
        veriInvestorVote(iv);
    }


    // 验证投资者发起的投票
    function veriInvestorVote(InvestorVote storage iv)internal{
        uint most = (total / 10) * 6;
        uint supportCount = countToken(iv.support);
        uint opposeCount = countToken(iv.oppose);

        if(iv.voteType == 1){
            // 终止合约模式

            if(supportCount > most){    
                // 同意终止
                // 返现
                Cashback();
                iv.isAccomplish = true;
            }
            if(opposeCount > most){
                // 否决终止
                iv.isAccomplish = true;
            }
            
        }else{
            // 提升tap模式
            

            if(supportCount > most){    
                // 提升tap
                // 每次提升是上一次tap的一半
                tap += tap / 2;
                iv.isAccomplish = true;
            }
            if(opposeCount > most){
                // 取消提升
                iv.isAccomplish = true;
            }
        }
    }

    // 如果拥有超过50%的投资者们终止合约，则进行将剩余ether返还
    function Cashback() internal{
        uint balanceWei = address(this).balance;
        uint totalWei = total * 10 * 18;
        uint pre = totalWei.div(balanceWei);

        for(uint i = 0 ; i < addresses.length ; i++){
            uint token = balances[addresses[i]] * 10 ** 18;
            uint toWei = per * token;
            addresses[i].transfer(toWei);
            // 销毁token
            burn(addresses[i],balances[addresses[i]]);
        }
        if(address(this).balance < 100000){
            // 确保合约中没有钱
            // 销毁合约
            selfdestruct(owner);
        }
    }

    // 是否是投资者
    function isInvest(address _account)public view returns(bool){
        return isExist(addresses,_account);
    }

    function()payable public{}
}