import { AudioManager } from './services/AudioManager';
import { BrowserActionManager } from './services/BrowserActionManager';
import { ChannelsManager } from './services/ChannelsManager';
import { ClientIdsManager } from './services/ClientIdsManager';
import { GamesManager } from './services/GamesManager';
import { NotificationsManager } from './services/NotificationsManager';

import audios from './store/audios';
import channels from './store/channels';
import twitchClientIds from './store/twitch-client-ids';

const twitchClientIdsManager = new ClientIdsManager(twitchClientIds);
const gamesManager = new GamesManager(twitchClientIdsManager);
const notificationsManager = new NotificationsManager(channels);
const browserActionManager = new BrowserActionManager(channels);
const audioManager = new AudioManager(audios);
const channelsManager = new ChannelsManager(channels, twitchClientIdsManager, gamesManager, notificationsManager, browserActionManager, audioManager);

channelsManager.requestTwitchApi();
channelsManager.enableAutoRequestTwitchApi();
