export default class ColumnChart {
  constructor(options = {}) {
    this.label = options?.label ?? '';
    this.link = options?.link ?? '';
    this.formatHeading = options?.formatHeading;
    this.value = options?.value;
    this.formattedValue = this.formatHeading ? this.formatHeading(this.value) : this.value;
    this.chartHeight = 50;
    this._isLoading = !options?.data || options?.data?.length === 0;
    this._data = Array.isArray(options.data) ? options.data : [];
    this._columns = this._isLoading ? '' : this._getColumns();
    this.element = this._createElement();
  }

  _getColumnsData () {
    const maxValue = Math.max(...this._data);
    const scaleCoefficient = this.chartHeight / maxValue;
    return this._data.map((currentValue) => ({
      percent: ((currentValue * 100) / maxValue).toFixed(0) + '%',
      value: Math.floor(currentValue * scaleCoefficient),
    }));
  }

  _getColumn(column) {
    return `<div style="--value: ${column.value}" data-tooltip="${column.percent}"></div>`;
  }

  _getColumns() {
    if (this._data.length === 0) {
      return '';
    }

    const columnsData = this._getColumnsData();
    return columnsData.map(value => this._getColumn(value)).join('\n');
  }

  update(newData) {
    if (!Array.isArray(newData) || !this.element) {
      return;
    }

    this._data = newData;
    this._isLoading = this._data.length === 0;

    this.element.classList.toggle('column-chart_loading', this._isLoading);

    this._columns = this._isLoading ? '' : this._getColumns();
    const chartContainer = this.element.querySelector('.column-chart__chart');
    chartContainer.innerHTML = this._columns;
  }

  _createElement() {
    const container = document.createElement('div');

    container.innerHTML = `
    <div class="column-chart ${this._isLoading ? 'column-chart_loading' : ''}"
      style="--chart-height: ${this.chartHeight}">
        <div class="column-chart__title">
          ${this.label}
          ${this.link ? `<a href="${this.link}" class="column-chart__link">View all</a>` : ''}
        </div>
        <div class="column-chart__container">
          <div data-element="header" class="column-chart__header">${this.formattedValue}</div>
          <div data-element="body" class="column-chart__chart">${this._columns}</div>
        </div>
      </div>`;

    return container.firstElementChild;
  }
  remove() {
    this.element.remove();
  }
  destroy() {
    this.remove();
    this._data = null;
  }
}
