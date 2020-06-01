import './style.scss';

export class Message {
  mountPoint: HTMLElement = document.getElementById('js-messages');

  messageScreen = document.createElement('div');
  messageWindow = document.createElement('div');
  messageBody = document.createElement('div');
  controls = document.createElement('div');
  noBtn: HTMLButtonElement = document.createElement('button');
  yesBtn: HTMLButtonElement = document.createElement('button');

  constructor() {
    this.messageScreen.classList.add('message_screen', 'hide');
    this.messageWindow.classList.add('message_window');
    this.messageBody.classList.add('message_message');
    this.controls.classList.add('message_controls');
    this.noBtn.dataset.message = 'no';
    this.noBtn.classList.add('message_button');
    this.yesBtn.dataset.message = 'yes';
    this.yesBtn.classList.add('message_button');

    this.mountPoint.append(this.messageScreen);
    this.messageScreen.append(this.messageWindow);
    this.messageWindow.append(this.messageBody, this.controls);
  }
}