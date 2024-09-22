const { app, BrowserWindow } = require('electron');
const path = require('path');

function createWindow() {
    // Tạo một cửa sổ trình duyệt mới
    const win = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, 'preload.js'), // File preload nếu cần
            nodeIntegration: true, // Cho phép sử dụng Node.js trong web app
            contextIsolation: false, // Không cô lập ngữ cảnh, cần nếu nodeIntegration = true
        }
    });
    win.removeMenu();
    // Tải trang web 
    win.loadURL('http://localhost:3000/admin/dashboard'); // Nếu đang chạy web trên port 3000
    // Hoặc:
    // win.loadFile('index.html'); nếu sử dụng file HTML local
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
