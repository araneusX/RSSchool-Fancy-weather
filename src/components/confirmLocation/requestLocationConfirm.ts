
import './style.scss';
import { UserLocation } from "../../script/types";
import state from "../../script/state";
import createTranslator from "../../script/int";
import { Message } from '../message/message';

export class RequestLocationConfirm extends Message {
  title = document.createElement('p');
  city = document.createElement('p');
  describe = document.createElement('p');

  constructor() {
    super();
    this.messageBody.append(this.title, this.city, this.describe);
    this.controls.append(this.noBtn, this.yesBtn);
    this.title.classList.add('message_title');
    this.city.classList.add('message_city');
    this.describe.classList.add('message_describe');

  }

  async askConfirm (name: string, formatted: string): Promise<boolean> {
    const t =createTranslator(state.language);
    this.title.append(`${t('MESSAGE_CONFIRM_LOCATION')}:`);
    this.city.append(name);
    this.describe.append(formatted)
    this.noBtn.append(t('CHANGE'));
    this.yesBtn.append(t('CONFIRM'));

    const confirm = () => new Promise((resolve) => {
      function handleClick(e: Event): boolean | void {
        e.preventDefault();
        const target = e.target as HTMLElement;
        if (target === this.messageScreen ||
          (target.dataset.message && target.dataset.message === 'yes')) {
          resolve(true)
          this.messageScreen.removeEventListener('click', handleClick);
        } else if (target.dataset.message && target.dataset.message === 'no') {
          resolve(false)
          this.messageScreen.removeEventListener('click', handleClick);
        }
      }
      this.messageScreen.addEventListener('click', handleClick.bind(this));
    })

    this.messageScreen.classList.remove('hide');
    const isConfirm = await confirm() as boolean;
    this.messageScreen.classList.add('hide');
    setTimeout(() => this.messageScreen.remove(), 500);
    return isConfirm;
  }
}