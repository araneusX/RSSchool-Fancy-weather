import './style.css';
import { UserLocation } from "../../script/types";
import { getCityListByName } from "../../script/getData";
import state from '../../script/state';
import { clearInnerHTML } from '../../script/utils';

export async function getUserSearch(
  formElement: HTMLFormElement,
  inputField: HTMLInputElement,
  submitReporter: () => Promise<unknown>,
): Promise<UserLocation> {
  const input = inputField;
  const container = input.parentNode;
  const wrapper = document.createElement('div');
  const list = document.createElement('ul');
  wrapper.classList.add('user-search_wrapper')
  list.classList.add('user-search_list');
  container.append(wrapper);
  wrapper.append(list);

  let result = new UserLocation();
  let locationsList: UserLocation[] = [];
  let itemNodeList: HTMLElement[] = [];
  let currentItem: number = -1;

  let isReqest: boolean = false;
  let thisExist: boolean = true;
  let isUserSubmit: boolean = false;
  let isResult: boolean = false;

  result.status = 'error';

  function handleClick(e: Event): void {
    const target = e.target as HTMLElement;
    const targetParent = target.parentNode as HTMLElement;
    if (target.dataset.suggest || targetParent.dataset.suggest) {
      const targetKey: string = target.dataset.suggest || targetParent.dataset.suggest;
      currentItem = Number(targetKey);
      result = locationsList[currentItem];
      formElement.dispatchEvent(new Event('submit'));
    } else if (!target.closest('.user-search_wrapper') && target !== input ) {
      wrapper.classList.remove('open');
    }
  }

  function handleChange(): void {
    if (input.value !== '') {
      const currentValue = input.value;
      setTimeout(async () => {
        if (currentValue === input.value && thisExist && !isReqest) {
          isReqest = true;
          const resultList = await getCityListByName(currentValue, state.language);
          if (resultList.status === 'ok') {
            isResult = true;
            if (!isUserSubmit) {
              clearInnerHTML(list);
              itemNodeList = [];
              currentItem = 0;

              locationsList = resultList.list;
              locationsList.forEach((item, i) => {
                const option = document.createElement('li');
                const optionName = document.createElement('p');
                const optionDescribe = document.createElement('p');
                option.dataset.suggest = `${i}`;
                option.classList.add('user-search_item');
                optionName.classList.add('user-search_name');
                optionDescribe.classList.add('user-search_describe');
                optionName.append(item.city.name);
                optionDescribe.append(item.city.formatted);
                option.append(optionName, optionDescribe);
                list.append(option);
                itemNodeList.push(option);
                if (i === 0) {
                  option.classList.add('current');
                  result = item;
                }
                wrapper.classList.add('open');
              })
            } else {
              result = resultList.list[0];
              formElement.dispatchEvent(new Event('submit'));
            }
          }
          isReqest = false;
        }
      }, 600);
    } else {
      clearInnerHTML(list);
      result.status = 'error';
      isResult = false;
      itemNodeList = [];
      wrapper.classList.remove('open');
    }
  }

  function handleFocus(): void {
    if (isResult) {
      wrapper.classList.add('open')
    }
  }

  function handleKeyDown(e: KeyboardEvent): void {
    if ((e.key === 'ArrowUp' || e.key === 'ArrowDown') && locationsList.length > 0) {
      e.preventDefault();
      e.stopPropagation();
      itemNodeList[currentItem].classList.remove('current');
      if (e.key === 'ArrowUp' && currentItem > 0) {
        currentItem -= 1;
      } else if (e.key === 'ArrowDown' && currentItem < locationsList.length - 1) {
        currentItem += 1;
      }
      itemNodeList[currentItem].classList.add('current');
      result = locationsList[currentItem];

      input.removeEventListener('input', handleChange);
      input.value = result.city.name;
      input.addEventListener('input', handleChange);

      const listMetrics = list.getBoundingClientRect();
      const itemMetrics = itemNodeList[currentItem].getBoundingClientRect();

      const scrollBottom = itemMetrics.bottom - listMetrics.bottom + 20;
      if (scrollBottom > 0) {
        list.scrollBy(0, scrollBottom);
      }

      const scrollTop = itemMetrics.top - listMetrics.top - 20;
      if (scrollTop < 0) {
        list.scrollBy(0, scrollTop);
      }

    }
  }

  document.addEventListener('click', handleClick);
  input.addEventListener('input', handleChange);
  input.addEventListener('focus', handleFocus);
  input.addEventListener('keydown', handleKeyDown);

  async function waitSubmit(): Promise<void> {
    const userAction = await submitReporter();

    if (userAction === 'cancel') {
      result.status = 'error';
    } else if (!isResult) {
      if (input.value === '') {
        await waitSubmit();
      } else {
        isUserSubmit = true;
        await waitSubmit();
      }
    }
  }

  await waitSubmit();


  document.removeEventListener('click', handleClick);
  input.removeEventListener('input', handleChange);
  input.removeEventListener('focus', handleFocus);
  input.removeEventListener('keydown', handleKeyDown);

  input.value = '';
  thisExist = false;
  wrapper.classList.remove('open');
  input.blur();
  setTimeout(() => wrapper.remove(), 500);

  return result;
}
