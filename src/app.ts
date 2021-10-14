require("dotenv").config();

import { MS_PER_DAY } from "./constants";
import { initialForm, addSongForm } from "./forms";
import { MessageCallback, PermalinkResponse, SongData } from "./types";
import { getTokenAndSOTDChannel } from "./utils/helpers";

const { App } = require("@slack/bolt");
const {
  ACTION_ID_ADD_SOTD,
  ACTION_ID_GET_SOTD,
  ACTION_ID_SUBMIT_SOTD,
} = require("./constants");

const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true,
  appToken: process.env.SLACK_APP_TOKEN,
});

(async () => {
  // Start your app
  await app.start(process.env.PORT || 3000);
  console.log("⚡️ Bolt app is running!");
})();

app.message("", async ({ message, say }: MessageCallback) => {
  await say(initialForm(message.user));
});

app.action(ACTION_ID_ADD_SOTD, async ({ body, ack, say }: MessageCallback) => {
  await say(addSongForm());
});

app.action(ACTION_ID_SUBMIT_SOTD, async ({ body, ack, say }: MessageCallback) => {
  // TODO validate form - make sure link is valid
  const { message, state } = body;

  const valuesArray: { [key: string]: { value: any } }[] = Object.values(state?.values);
  const [songName, link, reason] = valuesArray.map((obj) => Object.values(obj)[0].value);

  await ack();
  try {
    await say(`Adding song to SOTD Channel....`);
    await publishMessageToSOTDChannel(`
      _${body.user.username}_ nominated *${songName}*
      \n>${reason}\n
      ${link}
    `);
    await say(`${songName} was nominated in the Song of the Day channel`);
  } catch (e: any) {
    if (e.data.error === "not_in_channel") {
      await say("please add the Song of the Day bot to this channel");
    } else {
      await say("an error occured 😞");
    }
  }
});

app.action(ACTION_ID_GET_SOTD, async ({ body, ack, say }: MessageCallback) => {
  ack('Getting a SOTD...');
  const { id: channelId } = body.channel;

  try {
    const usersInChannel = await getUsersInChannel(channelId);
    const songsPostedInLast24Hours = await getSongsPostedInLast24Hours()

    const songsInSOTDFromUsersInChannel = getMostRecentSongsForUsers(songsPostedInLast24Hours, usersInChannel);

    if (songsInSOTDFromUsersInChannel.length) {
      const { ts } = songsInSOTDFromUsersInChannel[Math.floor(Math.random() * songsInSOTDFromUsersInChannel.length)]

      const permalinkObject = await getPermaLink(ts);
      if (!permalinkObject.ok) throw 'permalink error'

      say(`Here is your song of the day: ${permalinkObject.permalink}`)

    } else if (songsPostedInLast24Hours.length) {
      const { ts } = songsPostedInLast24Hours[Math.floor(Math.random() * songsPostedInLast24Hours.length)]

      const permalinkObject = await getPermaLink(ts);
      if (!permalinkObject.ok) throw 'permalink error'

      say("Nobody from this channel has posted a song in the past 24 hours, so here is a random SOTD")
    } else {
      say("Nobody has nominated a song for SOTD in the past 24 hours. Be the change you want to see and nominate one!")
    }

  } catch (e: any) {
    console.error(e);
  }

});

async function publishMessageToSOTDChannel(text: string) {
  return await app.client.chat.postMessage({
    text,
    ...getTokenAndSOTDChannel(),
  });
}

async function getUsersInChannel(channel: string) {
  const response = await app.client.conversations.members({
    token: process.env.SLACK_BOT_TOKEN,
    channel
  });


  const ids = response.members;

  const users = []

  for (const id of ids) {
    const user = await getUserData(id)
    users.push(user);
  }

  return users;
}


async function getSongsPostedInLast24Hours() {
  const response = await app.client.conversations.history({
    ...getTokenAndSOTDChannel(),
    oldest: getTimeStamp24HoursAgo()
  });

  const justMessages = response.messages.filter((message: any) => message.subtype !== 'channel_join');

  return justMessages
}

async function getUserData(userId: string) {
  const response = await app.client.users.info({
    token: process.env.SLACK_BOT_TOKEN,
    user: userId
  });

  return response.user;
}

function getTimeStamp24HoursAgo() {
  var date = new Date();
  const oldest = (date.getTime() - MS_PER_DAY) / 1000;

  return oldest;
}

function getMostRecentSongsForUsers(songsPostedInLast24Hours: { text: string, ts: string }[], usersInChannel: { name: string }[]): SongData[] {
  const mostRecentSongsForUsersInChannel: Set<SongData> = new Set<SongData>();

  const userNamesInCurrentChannel = usersInChannel.map(({ name }) => name);

  songsPostedInLast24Hours.forEach(({ text, ts }) => {

    const userWhoPosted = text.split(" ")[0];    //post starts with user name

    if (userNamesInCurrentChannel.includes(userWhoPosted)) {
      mostRecentSongsForUsersInChannel.add({
        addedByUserName: userWhoPosted,
        text,
        ts
      });
    }
  })

  return [...mostRecentSongsForUsersInChannel];
}

const getPermaLink = async (message_ts: string): Promise<PermalinkResponse> => {
  return await app.client.chat.getPermalink({
    ...getTokenAndSOTDChannel(),
    message_ts,
  })
}