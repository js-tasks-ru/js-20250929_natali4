const NOTIFICATION_TYPES = {
  ERROR: 'error',
  SUCCESS: 'success',
  WARNING: 'warning',
};

export default class NotificationMessage {
  static activeInstance = null;

  constructor(message, options = {}) {
    this.message = message;
    this.duration = options.duration ?? 3000;
    this.type = options.type ?? NOTIFICATION_TYPES.ERROR;
    this._timerId = null;
    this.element = this._createElement();
  }

  _createElement() {
    const element = document.createElement('div');
    element.classList.add(...['notification', this.type]);
    element.setAttribute('style', `--value:${(this.duration / 1000)}s`);
    element.innerHTML = `
      <div class="timer"></div>
      <div class="inner-wrapper">
        <div class="notification-header">${this.type}</div>
        <div class="notification-body">
          ${this.message}
        </div>
      </div>
    `;
    return element;
  }



  show(targetElement = document.body) {
    if (NotificationMessage.activeInstance && NotificationMessage.activeInstance !== this) {
      NotificationMessage.activeInstance.destroy();
    }

    targetElement.append(this.element);
    NotificationMessage.activeInstance = this;

    this._timerId = setTimeout(() => {
      this.destroy();
    }, this.duration);
  }

  remove() {
    if (!this.element) {return;}
    this.element.remove();
  }
  destroy() {
    this.remove();

    clearTimeout(this._timerId);

    if (NotificationMessage.activeInstance === this) {
      NotificationMessage.activeInstance = null;
    }
  }
}
