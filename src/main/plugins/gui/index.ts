import { app, BrowserWindow, ipcMain, webContents } from "electron";
import { FloatingCommandMap, FloatingLive } from "floating-live";
import path from "path";
// This allows TypeScript to pick up the magic constants that's auto-generated by Forge's Webpack
// plugin that tells the Electron app where to look for the Webpack-bundled app code (depending on
// whether you're running in development or production).
declare const GUI_VITE_DEV_SERVER_URL: string;
declare const GUI_VITE_NAME: string;

declare module "floating-live" {
  interface FloatingCommandMap {
    devtools: () => void;
  }
}

export default class ElectronGui {
  static pluginName = "gui";
  mainWindow: BrowserWindow | null = null;
  readonly app: Electron.App;
  readonly main: FloatingLive;
  constructor(main: FloatingLive) {
    this.main = main;
    this.app = app;

    // init app

    app.whenReady().then(() => {
      this.createMainWindow();
    });
    app.on("window-all-closed", () => {
      if (process.platform !== "darwin") {
        app.quit();
      }
    });
    app.on("activate", () => {
      if (BrowserWindow.getAllWindows().length === 0) {
        this.createMainWindow();
      }
    });

    // init ipcMain

    ipcMain.handle("connect", (e) => {
      e.sender.send("snapshot", main.getSnapshot());
      return [1];
    });

    ipcMain.handle(
      "command",
      async <T extends keyof FloatingCommandMap>(
        e: Electron.IpcMainInvokeEvent,
        command: T,
        ...args: Parameters<FloatingCommandMap[T]>
      ) => {
        try {
          const result = await main.call(command, ...args);
          return [1, result];
        } catch (err) {
          let rej;
          if (err instanceof Error) {
            rej = Object.assign(
              { message: err.message, name: err.name, _error: true },
              err
            );
          } else {
            rej = err;
          }
          return [0, rej];
        }
      }
    );

    main.on("event", (channel, ...args) => {
      webContents.getAllWebContents().forEach((e) => {
        e.send("event", channel, ...args);
      });
    });

    this.main.command.register("devtools", () => {
      this.mainWindow?.webContents.openDevTools();
    });
  }
  createMainWindow() {
    if (this.mainWindow) return;
    const mainWindow = new BrowserWindow({
      height: 600,
      width: 800,
      titleBarStyle: "hidden",
      titleBarOverlay: {
        color: "#FFFFFF00",
        symbolColor: "#001529",
      },
      webPreferences: {
        preload: path.join(__dirname, "preload.js"),
        webSecurity: false,
      },
    });
    if (GUI_VITE_DEV_SERVER_URL) {
      mainWindow.loadURL(GUI_VITE_DEV_SERVER_URL);
      console.log(GUI_VITE_DEV_SERVER_URL);
    } else {
      mainWindow.loadFile(
        path.join(__dirname, `../renderer/${GUI_VITE_NAME}/index.html`)
      );
    }
    mainWindow.on("close", () => {
      this.mainWindow = null;
    });
    this.mainWindow = mainWindow;
  }
}
