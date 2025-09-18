const { app, BrowserWindow } = require("electron");
const path = require("path");

function createWindow() {
	const win = new BrowserWindow({
		width: 1280,
		height: 800,
		webPreferences: { nodeIntegration: false, contextIsolation: true },
	});
	const startUrl =
		process.env.SWITCH_URL || "http://localhost:8080/switch.html";
	win.loadURL(startUrl);
}

app.whenReady().then(() => {
	createWindow();
	app.on("activate", () => {
		if (BrowserWindow.getAllWindows().length === 0) createWindow();
	});
});
app.on("window-all-closed", () => {
	if (process.platform !== "darwin") app.quit();
});
