
import {
    GenericMessageEvent,
    MessageEvent,
    ReactionAddedEvent,
    ReactionMessageItem,
  } from '@slack/bolt';
  
  export const isGenericMessageEvent = (msg: MessageEvent):
    msg is GenericMessageEvent => (msg as GenericMessageEvent).subtype === undefined;
  
  export const isMessageItem = (item: ReactionAddedEvent['item']):
    item is ReactionMessageItem => (item as ReactionMessageItem).type === 'message';

export const getTokenAndSOTDChannel = () => ({
  token: process.env.SLACK_BOT_TOKEN,
  channel: process.env.SOTD_CHANNEL_ID,
})
    