# Song Of The Day (SOTD) Slack Bot

## Get to know your colleagues through exploring their musical taste

The 'Song of the Day' (SOTD) slack bot is a small bot that can read and write to a dedicated SOTD channel (#sotd is recommended). If your channel wishes to participate, simply add the SOTD bot to your channel and ask the SOTD to get a SOTD whenever you want!

### Getting Started

Create a .env file with the fields mentions in the .sample.end file. TODO more steps...

## Actions

Write anything as a direct message SOTD app or @SOTD in a channel where SOTD is a member to access available actions.

### Nominate a SOTD

Fill out the form given after you click this button to give the name, link and short description of why you nominate the song.

### Get a SOTD

The action will pick a post from the #sotd channel to add to your channel. The action favors songs nominated by members of your channel, but if nobody from your channel has nominated a song, it will fallback to any song nominated in the last 24 hours. A permalink to the post in the #sotd channel is posted so that all reactions and comments can be consolidated in one place.

## How it works

The SOTD bot looks through songs from the last 24 hours posted in the SOTD channel. If it finds posts from users of the current channel, it will randomly select one to be the 'Song of the Day'. If it does not find songs nominated by the current channel's users, it will pick a random song posted to the SOTD channel from the last 24 hours.

## Why have a #sotd channel at all? Why not just use a database?

To boost transparency and allow for easy interactions with a post, having a dedicated #sotd channel will allow for all of those interactions to happen. You can of course hide that channel so you don't get a notification everytime somebody adds a song.