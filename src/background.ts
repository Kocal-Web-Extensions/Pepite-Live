import { BrowserActionManager } from './services/BrowserActionManager';
import { ChannelsManager } from './services/ChannelsManager';
import { ClientIdsManager } from './services/ClientIdsManager';
import { GamesManager } from './services/GamesManager';
import { NotificationsManager } from './services/NotificationsManager';
import channels from './store/channels';
import twitchClientIds from './store/twitch-client-ids';

const twitchClientIdsManager = new ClientIdsManager(twitchClientIds);
const gamesManager = new GamesManager(twitchClientIdsManager);
const notificationsManager = new NotificationsManager(channels);
const browserActionManager = new BrowserActionManager(channels);
const channelsManager = new ChannelsManager(channels, twitchClientIdsManager, gamesManager, notificationsManager, browserActionManager);

channelsManager.requestTwitchApi();
channelsManager.enableAutoRequestTwitchApi();
