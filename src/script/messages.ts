import { status, UserLocation } from './types';
import state from './state';
import createTranslator from './int';
import { getCityListByName } from './getData';

const messageScreen = document.getElementById('js-messages');
const messageBody = document.getElementById('js-message-body');

export async function confirmLocation(location: UserLocation): Promise<UserLocation> {
  const result = location;
  const t =createTranslator(state.language);

  const message = document.createElement('div');
  const title = document.createElement('p');
  const city = document.createElement('p');
  title.append(document.createTextNode(`${t('MESSAGE_CONFIRM_LOCATION')}:`));
  city.append(document.createTextNode(result.city.toUpperCase()));
  message.append(title, city);
  message.classList.add('messages_alert');

  const controls = document.createElement('div');
  controls.classList.add('messages_controls');

  controls.innerHTML = `
    <button class="messages_button" data-message="no">${t('CHANGE')}</button>
    <button class="messages_button" data-message="yes">${t('CONFIRM')}</button>
  `
  messageBody.append(message, controls);
  messageScreen.classList.remove('hide');

  const confirm = () => new Promise((resolve) => {
    function handleClick(e: Event): boolean | void {
      e.preventDefault();
      const target = e.target as HTMLElement;
      if (target === messageScreen ||
        (target.dataset.message && target.dataset.message === 'yes')) {
        resolve(true)
        messageScreen.removeEventListener('click', handleClick);
      } else if (target.dataset.message && target.dataset.message === 'no') {
        resolve(false)
        messageScreen.removeEventListener('click', handleClick);
      }
    }
    messageScreen.addEventListener('click', handleClick);
  })

  const isConfirm = await confirm();
  if (isConfirm) {
    messageBody.innerHTML = '';
    messageScreen.classList.add('hide');
  } else {
    message.removeChild(message.lastChild);
    const cancelBtn = controls.firstChild as HTMLElement;
    cancelBtn.innerHTML = t('CANCEL');

    const form = document.createElement('form');
    const input = document.createElement('input');
    input.classList.add('messages_input');
    message.append(form);
    form.append(input);
    input.focus();
    const removeSuggestions = handleSuggestions(input);
    
    const getUserData = () => new Promise((resolve) => {
      function handleClick(e: Event): void {
        e.preventDefault();
        const target = e.target as HTMLElement;
        if (target === messageScreen ||
          (target.dataset.message && target.dataset.message === 'no')) {
          resolve(false)
          messageScreen.removeEventListener('click', handleClick);
        } else if (target.dataset.message && target.dataset.message === 'yes') {
          resolve(false)
          messageScreen.removeEventListener('click', handleClick);
        }
      }
      messageScreen.addEventListener('click', handleClick);
    })

  }

  return result;
}

export function handleSuggestions(input: HTMLInputElement): () => void {
  const container = input.parentNode;
  const datalist = document.createElement('datalist');

  datalist.id = 'list';
  input.setAttribute('list', 'list');
  container.append(datalist);
  let isReqest: boolean = false;
  let thisExist: boolean = true;
  function handleChange(): void {
    const currentValue = input.value;
    setTimeout(async () => {
      if (currentValue === input.value && thisExist && !isReqest) {
        isReqest = true;
        const list = await getCityListByName(currentValue, state.language);
        if (list.status === 'ok') {
          list.list.forEach((item, i) => {
            const option = document.createElement('option');
            option.dataset.suggest = `${i}`
            const text = document.createTextNode(item.city);
            option.append(text);
            datalist.append(option);
          })
        }
      }
    }, 3000);
  }
  input.addEventListener('input', handleChange);

  return () => {
    input.removeEventListener('input', handleChange);
    datalist.remove();
    thisExist = false;
    return 
  }
}