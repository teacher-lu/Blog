// ==========================================
// 1. 气泡背景动画逻辑
// ==========================================
const bubleCreate = () => {
    // 获取body元素
    const body = document.body;
    // 创建泡泡元素
    const buble = document.createElement('span');
    // 设置泡泡半径大小为25~30
    let r = Math.random() * 5 + 25; 
    // 设置泡泡的宽高
    buble.style.width = r + 'px';
    buble.style.height = r + 'px';
    // 设置泡泡的随机起点
    buble.style.left = Math.random() * innerWidth + 'px';
    // 为body添加buble元素
    body.append(buble);
    // 4s清除一次泡泡
    setTimeout(() => {
        buble.remove();
    }, 4000);
};

// 每200ms生成一个泡泡
setInterval(() => {
    bubleCreate();
}, 200);


// ==========================================
// 2. SHA-256 哈希加密函数
// ==========================================
// 这个函数会将用户输入的明文密码转换成不可逆的哈希字符串
async function sha256(message) {
    const msgUint8 = new TextEncoder().encode(message);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}


// ==========================================
// 3. 登录验证逻辑
// ==========================================
// 设置固定的账号 (明文存放)
const VALID_USERNAME = "admin";
// 设置固定密码的哈希值 (这里是 "123456" 的哈希值)
// 如果你想换密码，请用我刚刚提供的工具生成新的哈希值并替换这里的内容
const EXPECTED_HASH = "8d969eef6ecad3c29a3a629280e686cf0c3f5d5a86aff3ca12020c923adc6c92"; 

// 等待DOM结构加载完毕后执行
document.addEventListener('DOMContentLoaded', () => {
    const loginBtn = document.getElementById('loginBtn');
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');

    // 由于加密函数是异步的(async)，这里的点击事件也需要加 async
    loginBtn.addEventListener('click', async () => {
        // 获取用户输入的值并去除首尾空格
        const username = usernameInput.value.trim();
        const password = passwordInput.value.trim();

        // 简单的前端空值校验
        if (username === '') {
            alert('请输入用户名！');
            return;
        }
        if (password === '') {
            alert('请输入密码！');
            return;
        }

        // 将用户输入的密码转换为哈希值
        const inputHash = await sha256(password);

        // 核心验证逻辑：比对账号和密码的哈希值
        if (username === VALID_USERNAME && inputHash === EXPECTED_HASH) {
            
            // 记录登录状态到浏览器 Session (关闭网页即失效)
            sessionStorage.setItem('isLoggedIn', 'true');
            
            // 跳转到主页
            window.location.href = './index.html'; 
            
        } else {
            alert('账号或密码错误，请重新输入！');
            // 验证失败，清空密码框方便用户重新输入
            passwordInput.value = '';
        }
    });
    
    // 可选：添加回车键登录功能，体验更好
    passwordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            loginBtn.click();
        }
    });
});