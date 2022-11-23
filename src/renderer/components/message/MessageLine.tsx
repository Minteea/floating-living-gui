import { MessageType } from 'floating-live/src/types/message/MessageData';
import { getRenewType } from '../../utils/nameUtils';
import User from './User';
import { Image } from 'antd'

function html_encode(str: string) 
{ 
    let s = ""; 
    if (str.length == 0) return ""; 
    s = str.replace(/&/g, "&amp;"); 
    s = s.replace(/</g, "&lt;"); 
    s = s.replace(/>/g, "&gt;"); 
    s = s.replace(/ /g, "&nbsp;"); 
    s = s.replace(/\'/g, "&#39;"); 
    s = s.replace(/\"/g, "&quot;"); 
        s = s.replace(/\n/g, "<br/>"); 
    return s; 
}
const g = {
  jpg:[0],
  png:[89,86,83,80,78,76,73,7,68,67,63,6,52,49,47,46,44,43,39,38,36,30,26,24,21,18,17,135,130,129,117,11,106],
  gif:[53,37,2,19,132,110,104,101,100]
}
function get619EmoticonType(id: number) {
  if (g.png.indexOf(id) > -1) {
    return "png"
  } else if (g.gif.indexOf(id) > -1) {
    return "gif"
  } else {
    return "jpg"
  }
}
/** 消息 */
const MessageLine: React.FC<{
  msg: MessageType;
}> = function (props) {
  const { msg } = props;
  switch (msg.type) {
    case 'text': {
      return (
        <div>
          <Image src={msg.info.user.avatar} referrerPolicy="no-referrer" width={20} height={20} />
          <User msg={msg} />
          :&nbsp;
          {
            (msg.platform == "bilibili" && msg.room == 2064239) ? 
            <span dangerouslySetInnerHTML={{__html: html_encode(msg.info.text).replace(/\{\{([0-9]+)\}\}/g, (substr, id) => {
              return `<img src="https://livechat.zhuluyuanye.com/image/emoticon/${id}.${get619EmoticonType(Number(id))}" referrerPolicy="no-referrer" width=60 height=60></img>`
            })}}></span>
            :
            <span>{msg.info.text}</span>
          }
        </div>
      );
    }
    case 'image': {
      return (
        <div>
          <img src={msg.info.user.avatar} referrerPolicy="no-referrer" width={20} height={20} />
          <User msg={msg} />
          :&nbsp;
          <img src={msg.info.image.url/**`http://${store.link.link}/static/image/emotion/${msg.platform}/${msg.info.image.id}.png` */} referrerPolicy="no-referrer" width={Number(msg.info.image.size?.[0]) / 2 || undefined} height={Number(msg.info.image.size?.[1]) / 2 || undefined} />
        </div>
      );
    }
    case 'gift': {
      return (
        <div>
          <img src={msg.info.user.avatar} referrerPolicy="no-referrer" width={20} height={20} />
          <User msg={msg} />
          &nbsp;
          <span>{msg.info.gift.action || '送出'}</span>&nbsp;
          <span>{msg.info.gift.name}</span>&nbsp;
          <span>x{msg.info.gift.num}</span>
        </div>
      );
    }
    case 'superchat': {
      return (
        <div>
          <img src={msg.info.user.avatar} referrerPolicy="no-referrer" width={20} height={20} />
          <User msg={msg} />
          &nbsp;
          <span>[SC {msg.info.duration / 1000}s]</span>:&nbsp;
          <span>{msg.info.text}</span>
        </div>
      );
    }
    case 'privilege': {
      return (
        <div>
          <img src={msg.info.user.avatar} referrerPolicy="no-referrer" width={20} height={20} />
          <User msg={msg} />
          &nbsp;
          <span>{getRenewType(msg.info.renew)}了</span>&nbsp;
          <span>{msg.info.duration}天的</span>&nbsp;
          <span>{msg.info.name}</span>
        </div>
      );
    }
    case 'entry': {
      return (
        <div>
          <User msg={msg} /> 进入直播间
        </div>
      );
    }
    case 'like': {
      return (
        <div>
          <User msg={msg} /> 点赞了
        </div>
      );
    }
    case 'share': {
      return (
        <div>
          <User msg={msg} /> 分享了直播间
        </div>
      );
    }
    case 'follow': {
      return (
        <div>
          <User msg={msg} /> 关注了主播
        </div>
      );
    }
    case 'join': {
      return (
        <div>
          <User msg={msg} /> 加入了粉丝团
        </div>
      );
    }
    case 'block': {
      return (
        <div>
          <User msg={msg} />
          &nbsp; 已被
          <span>
            {['管理员', '主播', '房管'][Number(msg.info.operator.admin)]}
          </span>
          禁言
        </div>
      );
    }
    case 'live_start': {
      return (
        <div>
          直播间 {msg.platform}:{msg.room} 已开播
        </div>
      );
    }
    case 'live_end': {
      return (
        <div>
          直播间 {msg.platform}:{msg.room} 已结束直播
        </div>
      );
    }
    case 'live_cut': {
      return (
        <div>
          直播间 {msg.platform}:{msg.room} 被切断直播: {msg.info.message}
        </div>
      );
    }
    default:
      return null;
  }
};

export default MessageLine;
