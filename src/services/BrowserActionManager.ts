import Channel from '../entities/Channel';

const setTitle = (title: string): void => chrome.browserAction.setTitle({ title });

const setBadgeText = (text: string): void => chrome.browserAction.setBadgeText({ text });

const setBadgeColor = (color: string): void => chrome.browserAction.setBadgeBackgroundColor({ color });

const markAsOnline = (): void => {
  setBadgeText('ON');
  setBadgeColor('green');
};

const markAsOffline = (): void => {
  setBadgeText('OFF');
  setBadgeColor('gray');
};

const updateTitle = (channel: Channel) => {
  if (channel.online) {
    setTitle(`${channel.nickname} stream ${channel.stream!.game} devant ${channel.stream!.viewers} viewers`);
  } else {
    setTitle(`${channel.nickname} n'est pas en stream`);
  }
};

class BrowserActionManager {
  constructor(private channels: Channel[]) {
    setBadgeText('...');
    this.bindOnClick();
  }

  public update(): void {
    if (this.channels.some(channel => channel.online as boolean)) {
      markAsOnline();
    } else {
      markAsOffline();
    }

    updateTitle(this.channels[0]);
  }

  private bindOnClick(): void {
    chrome.browserAction.onClicked.addListener(() => {
      chrome.tabs.create({
        url: 'https://www.twitch.tv/pepite',
        active: true,
      });
    });
  }
}

export { BrowserActionManager };
