import Living from '../../storage/bin/living';
import Saving from './plugins/save';
import Command from './command/command';
import { CommandSet, FLCommandSet } from './command/CommandTypes';
import IpcLink from './link/ipcLink';
import { UniLink, UniSender } from './types/UniLink';
import commandParser from '../utils/commandParser';
import FloatingLive from 'floating-live'
import { Registerable } from 'floating-live/src/lib/Registerable';

import bilibiliGetAvatar from './plugins/bilibiliGetAvatar';
import bilibili from 'floating-live/plugin/bilibili';
import acfun from 'floating-live/plugin/acfun';
import server from './plugins/server';
import save from './plugins/save';
import search from './plugins/search';
import consoleEvent from 'floating-live/plugin/consoleEvent';
import bili619Enhance from './plugins/bili619Enhance';


const configPath = './config/config.json';
const config = require(configPath);

export default class Program extends FloatingLive {
  /** 命令集 */
  public command = new Registerable<(...args: any) => void>("command")
  /** 命令集 */
  public initFunction = new Registerable<() => {[store: string]: {[key: string]: any}}>("command")
  /** 前端连接通道 */
  links: UniLink[]
  constructor() {
    super()
    this.links = [new IpcLink()]
    this.initCommand()
    this.initPlugin()
    this.initInit()
    this.links.forEach((link) => {
      link.on("cmd", (e, {cmd, args}) => {
        console.log(`cmd: ${[cmd, ...args].join(" ")}`)
        this.cmd(cmd, ...args)
      })
      link.on("connect", (e) => {
        const initData: {[module: string]: {[key: string]: any}} = {}
        this.initFunction.getList().forEach((func) => {
          let data = func()
          for (let module in data) {
            // 合并初始化数据
            initData[module] = Object.assign(initData[module] || {}, data[module])
          }
        })
        e.send('init', initData);
        e.send('room_list', this.controller.room.keyList.map((key) => [key, this.controller.room.info(key)]))
      })
    })
  }
  /** 重写事件触发: 事件触发时, 同时发送给前端 */
  public emit(eventName: string | symbol, ...args: any[]) {
    if(typeof eventName == "string") this.send(eventName, ...args)
    return super.emit(eventName, ...args)
  }
  /** 广播发送 */
  public send(channel: string, ...args: any[]) {
    this.links.forEach((link) => {
      link.send(channel, ...args)
    })
  }
  /** 重写插件注册 */
  public registerPlugin(name: string, pluginFunc: (main: Program) => any) {
    super.registerPlugin(name, pluginFunc as (main: FloatingLive) => any)
  }
  /** 执行指令 */
  public cmd(cmd: string, ...args: any) {
    let func = this.command.get(cmd)
    if (func) {
      func(...args)
    }
  }
  /** 初始化内置插件 */
  private initPlugin() {
    this.registerPlugin("consoleEvent", consoleEvent)
    // 房间插件
    this.registerPlugin("bilibili", bilibili)
    this.registerPlugin("acfun", acfun)
    // 消息优化插件
    this.registerPlugin("bilibili-get-avatar", bilibiliGetAvatar)
    // 工具插件
    this.registerPlugin("save", save)
    this.registerPlugin("server", server)
    this.registerPlugin("search", search)
    this.registerPlugin("bili619Enhance", bili619Enhance)
  }
  private initCommand() {
    this.command.register("addRoom", (r: string | {platform: string, id: string | number}, open: boolean = false) => {
      // 获取平台及id
      let platform: string
      let id: string | number
      if (typeof r == "string") {
        let split = r.split(":")
        platform = split[0].toLowerCase()
        id = split[1]
      } else {
        platform = r.platform.toLowerCase()
        id = r.id
      }
      this.controller.addRoom({platform, id}, open)
    })
    this.command.register("removeRoom", (key: string) => {
      this.controller.removeRoom(key)
    })
    this.command.register("openRoom", (key: string) => {
      this.controller.openRoom(key)
    })
    this.command.register("closeRoom", (key: string) => {
      this.controller.closeRoom(key)
    })
    this.command.register("updateRoom", (key: string) => {
      this.controller.updateRoomInfo(key)
    })
    this.command.register("openAll", () => {
      this.controller.openAllRooms()
    })
    this.command.register("closeAll", () => {
      this.controller.closeAllRooms()
    })
    this.command.register("start", () => {
      this.controller.start()
    })
    this.command.register("end", () => {
      this.controller.end()
    })
  }
  private initInit() {
    this.initFunction.register("live", () => {
      return {
        live: {
          started: this.controller.started,
          timestamp: this.controller.timestamp
        }
      }
    })
  }
}
