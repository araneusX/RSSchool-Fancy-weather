import './style.scss';

const mountPoint = document.getElementById('js-messages');
const node = document.createElement('span');
mountPoint.append(node);
node.classList.add('messages_notification');

export function showNotification(notification: string): void {
  node.innerText = notification;
  node.classList.add('visible');
  setTimeout(() => {
    node.classList.remove('visible');
  }, 3000);
}
