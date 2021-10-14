const {
  ACTION_ID_SUBMIT_SOTD,
  ACTION_ID_ADD_SOTD,
  ACTION_ID_GET_SOTD,
} = require("./constants");


export const addSongForm = () => ({
  blocks: [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `What song would you like to add?`,
      },
    },
    {
      dispatch_action: false,
      type: "input",
      element: {
        type: "plain_text_input",
      },
      label: {
        type: "plain_text",
        text: "Song Name",
        emoji: true,
      },
    },
    {
      dispatch_action: false,
      type: "input",
      element: {
        type: "plain_text_input",
      },
      label: {
        type: "plain_text",
        text: "Song Link",
        emoji: true,
      },
    },
    {
      type: "input",
      element: {
        type: "plain_text_input",
        multiline: true,
        action_id: "plain_text_input-action",
        placeholder: {
          type: "plain_text",
          text: "It gives me xyz feelz....",
          emoji: true,
        },
      },
      label: {
        type: "plain_text",
        text: "Why did you choose this song?",
        emoji: true,
      },
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Submit",
          },
          action_id: ACTION_ID_SUBMIT_SOTD,
        },
      ],
    },
  ],
});

export const initialForm = (user: string) => ({
  blocks: [
    {
      type: "section",
      text: {
        type: "mrkdwn",
        text: `Yo Yo Yo! what's up <@${user}>!?`,
      },
    },
    {
      type: "actions",
      elements: [
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Nominate a SOTD",
          },
          action_id: ACTION_ID_ADD_SOTD,
        },
        {
          type: "button",
          text: {
            type: "plain_text",
            text: "Get a SOTD",
          },
          action_id: ACTION_ID_GET_SOTD,
        },
      ],
    },
  ],
})
