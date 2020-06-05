import { showNotification } from "../components/notification/showNotification";
import createTranslator from "./int";

export default class SpeechModule {
  recognition: SpeechRecognition;
  isStart: boolean;
  lang: string;
  onResultAction: any;

  language = {
    en: 'en_US',
    ru: 'ru_RU'
  }

  constructor(language: 'en' | 'ru') {
    if (!('webkitSpeechRecognition' in window)) {
      const t = createTranslator(language);
      showNotification(t('NO RECOGNITION'));
      } else {
      this.lang = this.language[language];
      this.recognition = new webkitSpeechRecognition();
      this.recognition.continuous = true;
      this.recognition.lang =  this.lang;
      this.recognition.interimResults = false;
      this.recognition.maxAlternatives = 10;
      this.isStart = false;

      this.recognition.addEventListener('end', () => {
        if (this.isStart) {
          this.recognition.start();
        }
      });
    }
  }

  onResult(event: SpeechRecognitionEvent, onResultCallback: any) {
    const resultsArr = [];
    Array.from(event.results[event.results.length - 1]).forEach((result) => {
      const words = result.transcript.split(' ');
      words.forEach((word) => {
        if (!resultsArr.includes(word.toLowerCase())
            && word.length > 0
            && Number.isNaN(Number.parseInt(word, 10))
        ) {
          resultsArr.push(word.toLowerCase());
        }
      });
    });
    try {
      onResultCallback(resultsArr);
    } catch (e) {
      this.recognition.stop();
    }
  }

  setResultAction(callback) {
    if (this.onResultAction) {
      this.recognition.removeEventListener('result', this.onResultAction);
    }
    this.onResultAction = (e: SpeechRecognitionEvent) => {
      this.onResult(e, callback);
    }
    this.recognition.addEventListener('result', this.onResultAction);
  }

  setLanguage(language: 'en' | 'ru') {
    this.recognition.abort();
    this.lang = this.language[language];
    this.recognition.lang =  this.lang;
  }

  stop() {
    if (this.isStart) {
      this.isStart = false;
      this.recognition.abort();
      this.recognition.removeEventListener('result', this.onResultAction);
    };
  }

  start() {
    if (!this.isStart) {
      this.isStart = true;
      this.recognition.start();
      this.recognition.addEventListener('result', this.onResultAction);
    };
  }
}