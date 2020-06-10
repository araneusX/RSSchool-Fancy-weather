import './style.css';

const node = document.createElement('div');
const moutnPoint = document.getElementById('js-messages');
moutnPoint.append(node);
node.classList.add('messages_preloader');

const preloader = {
  show() {
    node.classList.add('visible');
  },
  hide() {
    node.classList.remove('visible');;
  }
}

export default preloader;