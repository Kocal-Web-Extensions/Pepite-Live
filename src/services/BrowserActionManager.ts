import Channel from '../entities/Channel';

const setBadgeText = (text: string): void => chrome.browserAction.setBadgeText({ text });

const setBadgeColor = (color: string): void => chrome.browserAction.setBadgeBackgroundColor({ color });

const setIcon = (icon: string): void => chrome.browserAction.setIcon({ path: `icons/${icon}` });

const markAsOnline = (): void => {
  setBadgeText('ON');
  setBadgeColor('green');
};

const markAsOffline = (): void => {
  setBadgeText('OFF');
  setBadgeColor('gray');
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
