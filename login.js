// ==========================================
// 0. 全局 UI 工具函数：Toast 和 Dialog
// ==========================================
const toastContainer = document.createElement('div');
toastContainer.className = 'toast-container';
document.body.appendChild(toastContainer);

function showToast(message, type = 'error') {
    const toast = document.createElement('div');
    toast.className = `custom-toast ${type}`;
    toast.innerText = message;
    toastContainer.appendChild(toast);

    setTimeout(() => toast.classList.add('show'), 10);
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function showDialog(title, message) {
    const overlay = document.createElement('div');
    overlay.className = 'custom-dialog-overlay';
    overlay.innerHTML = `
        <div class="custom-dialog-box">
            <h3>${title}</h3>
            <p>${message}</p>
            <button class="dialog-btn">我知道了</button>
        </div>
    `;
    document.body.appendChild(overlay);

    const btn = overlay.querySelector('.dialog-btn');
    btn.addEventListener('click', () => {
        overlay.classList.remove('show');
        setTimeout(() => overlay.remove(), 300);
    });

    setTimeout(() => overlay.classList.add('show'), 10);
}


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
// 如果你想换密码，请用我刚刚提供的工具生成新的哈希值并替换这里的内容
const EXPECTED_HASH = "b2ed6d0fc00ba9611c9963ba6c26b25c4b13829a2c8fb188b470eb21b7c7422f"; 

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

        // 使用 Toast 进行空值校验
        if (username === '') {
            showToast('请输入用户名！', 'error');
            return;
        }
        if (password === '') {
            showToast('请输入密码！', 'error');
            return;
        }

        // 将用户输入的密码转换为哈希值
        const inputHash = await sha256(password);

        // 核心验证逻辑：比对账号和密码的哈希值
        if (username === VALID_USERNAME && inputHash === EXPECTED_HASH) {
            
            // 登录成功提示
            showToast('登录成功！正在进入系统...', 'success');

            // 记录登录状态到浏览器 Session (关闭网页即失效)
            sessionStorage.setItem('n8n_password', password);
            sessionStorage.setItem('isLoggedIn', 'true');
            
            // 延迟 800 毫秒跳转，让用户看清楚成功的提示语
            setTimeout(() => {
                window.location.href = './index.html'; 
            }, 800);
            
        } else {
            // 密码错误使用 Dialog 强提醒
            showDialog('登录失败', '您输入的账号或密码不正确，请检查后重新输入。');
            
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
