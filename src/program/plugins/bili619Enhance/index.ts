import Program from "../../index"

export default (ctx: Program) => {
  ctx.cmd("addRoom", {platform: "bilibili", id: 2064239}) // 添加直播间
}