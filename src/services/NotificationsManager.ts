import Channel from '../entities/Channel';

const create = (title: string, message: string, id: string = '') => {
  chrome.notifications.create(id, {
    type: 'basic',
    iconUrl: '../icons/icon_128.png',
    title: title || '',
    message: message || '',
  });
};

class NotificationsManager {
  constructor(private channels: Channel[]) {
    chrome.notifications.onClicked.addListener(this.onNotificationClick.bind(this));
  }

  public show(channel: Channel): void {
    if (!channel.stream) {
      // tslint:disable no-console
      return console.error(`${channel.nickname} n'est pas en ligne, impossible d'afficher une notification.`);
    }

    create(`${channel.nickname} est en live sur ${channel.stream.game} !`, channel.stream.title, channel.username);
  }

  public showByTitleAndMessage(title: string, message: string): void {
    create(title, message);
  }

  private onNotificationClick(channelUsername: string): void {
    const channel = this.findByUsername(channelUsername) || this.findByUsername('youngtomy66');

    if (!channel) {
      // tslint:disable no-console
      return console.error(`Impossible de trouver le channel ${channelUsername}.`);
    }

    chrome.tabs.create({
      url: channel.url(),
      active: true,
    });
  }

  private findByUsername(username: string): Channel | undefined {
    return this.channels.find(c => c.username === username);
  }
}

export { NotificationsManager };
