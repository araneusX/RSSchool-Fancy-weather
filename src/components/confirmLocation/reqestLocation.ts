
import './style.scss';
import { UserLocation } from "../../script/types";
import state from "../../script/state";
import createTranslator from "../../script/int";
import { Message } from '../message/message';
import { getUserSearch } from '../addUserSearch/addUserSearch'

export class RequestLocation extends Message {
  title = document.createElement('p');
  form: HTMLFormElement = document.createElement('form');
  input: HTMLInputElement = document.createElement('input');

  constructor() {
    super();
    this.messageBody.append(this.title, this.form);
    this.form.append(this.input);
    this.controls.append(this.noBtn, this.yesBtn);
    this.form.classList.add('message_form');
    this.input.classList.add('message_input');
  }

  async getUserLocation (): Promise<UserLocation> {
    const t =createTranslator(state.language);
    this.title.append(document.createTextNode(`${t('MESSAGE_ASK_LOCATION')}:`));
    this.noBtn.append(t('CANCEL'));
    this.yesBtn.append(t('CHANGE'));

    const searchSubmit = () => {

      return new Promise(resolve => {
        function removeListeners(): void {
          this.form.removeEventListener('submit', onSubmit);
          this.noBtn.removeEventListener('click', onCancel);
          this.yesBtn.removeEventListener('click', onSubmit);
        }
        function onSubmit(e:Event): void {
          e.preventDefault();
          removeListeners.call(this);
          resolve('submit');
        }
        function onCancel(e:Event): void {
          e.preventDefault();
          const target = e.target as HTMLElement;
          if (!target.closest('#js-searchForm')) {
            removeListeners.call(this);
            resolve('cancel');
          }
        }
        this.form.addEventListener('submit', onSubmit.bind(this));
        this.noBtn.addEventListener('click', onCancel.bind(this));
        this.yesBtn.addEventListener('click', onSubmit.bind(this));
      });
    };

    this.messageScreen.classList.remove('hide');
    this.input.focus();
    const result = await getUserSearch(this.form, this.input, searchSubmit);
    this.messageScreen.classList.add('hide');
    setTimeout(() => this.messageScreen.remove(), 500);
    return result;
  }
}