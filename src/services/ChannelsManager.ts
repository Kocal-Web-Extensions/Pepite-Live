import axios from 'axios';
import { TwitchApi } from '../../types';
import Channel from '../entities/Channel';
import Stream from '../entities/Stream';
import { BrowserActionManager } from './BrowserActionManager';
import { ClientIdsManager } from './ClientIdsManager';
import { GamesManager } from './GamesManager';
import { NotificationsManager } from './NotificationsManager';

// tslint:disable-next-line
const qs: any = require('qs');

class ChannelsManager {
  private autoRequestTwitchApiInterval: number | null;

  constructor(
    private channels: Channel[],
    private clientIdsManager: ClientIdsManager,
    private gamesManager: GamesManager,
    private notificationsManager: NotificationsManager,
    private browserActionManager: BrowserActionManager
  ) {
    this.autoRequestTwitchApiInterval = null;
  }

  public requestTwitchApi() {
    const url = 'https://api.twitch.tv/helix/streams';
    const config = {
      headers: {
        'Client-ID': this.clientIdsManager.pickOne(),
      },
      params: {
        user_id: this.channels.map(channel => channel.id),
      },
      paramsSerializer(params: object) {
        return qs.stringify(params, { arrayFormat: 'repeat' });
      },
    };

    return axios
      .get(url, config)
      .then((response: any) => response.data.data)
      .then(this.onSuccess.bind(this))
      .catch((error: any) => {
        const message = "Une erreur s'est produite lors de la récupération de l'état des streams.";
        // tslint:disable no-console
        console.error(message, error);
      });
  }

  public enableAutoRequestTwitchApi() {
    this.autoRequestTwitchApiInterval = window.setInterval(() => {
      this.requestTwitchApi();
    }, 1.5 * 60 * 1000);
  }

  private onSuccess(onlineChannels: TwitchApi.Stream[]) {
    const promises: Array<Promise<void>> = [];

    this.channels.forEach(channel => {
      const onlineChannel: TwitchApi.Stream = onlineChannels.find(oc => +oc.user_id === channel.id) as TwitchApi.Stream;
      const isOnline: boolean = !!onlineChannel;

      if (isOnline) {
        const promise = this.gamesManager
          .getNameById(onlineChannel.game_id)
          .then(game => {
            const wasOffline = !channel.online;

            channel.markAsOnline(new Stream(game, onlineChannel.title, onlineChannel.viewer_count));

            if (wasOffline) {
              this.notificationsManager.show(channel);
            }
          })
          .catch(console.error);

        promises.push(promise);
      } else {
        channel.markAsOffline();
      }
    });

    return Promise.all(promises).then(() => {
      this.browserActionManager.update();
    });
  }
}

export { ChannelsManager };
