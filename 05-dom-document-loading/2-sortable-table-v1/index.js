export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.data = data;
    this.sortedData = [...this.data];
    this.headerConfig = headerConfig;
    this.headerMap = this._createHeaderMap();
    this.sortConfig = null;
    this.element = this._createElement();
    this.subElements = this._createSubElements();
  }

  _createHeaderMap() {
    return this.headerConfig.reduce((acc, column) => {
      acc[column.id] = column;
      return acc;
    }, {});
  }

  _createCell(cellData, template) {
    return template ? template(cellData) : `<div class="sortable-table__cell">${cellData}</div>`;
  }
  _createRow(rowData) {
    const rowCells = Object.keys(this.headerMap).map(key => {
      const cellData = rowData[key];
      const template = this.headerMap[key]?.template;
      return this._createCell(cellData, template) ;
    }).join('\n');

    return `<a href="/products/${rowData.id}" class="sortable-table__row">${rowCells}</a>`;
  }
  _createRows() {
    return this.sortedData.map(row => this._createRow(row)).join('');
  }
  _createBody() {
    const body = document.createElement("div");
    body.classList.add("sortable-table__body");
    body.setAttribute('data-element', 'body');
    body.innerHTML = this._createRows();
    return body;
  }
  _createHeader() {
    const header = document.createElement('div');
    header.classList.add(...['sortable-table__header', 'sortable-table__row']);
    header.setAttribute('data-element', 'header');

    header.innerHTML = this.headerConfig.map(column => {
      return `
        <div
        class="sortable-table__cell"
        data-id="${column.id}"
        data-sortable="${column.sortable}"
        data-order="${this.sortConfig?.orderValue ?? ''}">
          <span>${column.title}</span>
        </div>`;
    }).join('');
    return header;
  }

  _createElement() {
    const container = document.createElement("div");
    container.classList.add("sortable-table");

    container.append(this._createHeader());
    container.append(this._createBody());

    return container;
  }

  _createSubElements() {
    return {
      header: this.element.firstElementChild,
      body: this.element.querySelector('[data-element="body"]'),
    };
  }
  _getSortArrow() {
    const arrowContainer = document.createElement("div");
    arrowContainer.classList.add(...['sortable-table__sort-arrow']);
    arrowContainer.setAttribute('data-element', 'arrow');
    arrowContainer.innerHTML = `<span class="sort-arrow"></span>`;
    return arrowContainer;
  }

  _update() {
    const { header, body } = this.subElements;
    const {fieldValue, orderValue} = this.sortConfig;

    header.querySelector('[data-element="arrow"]')?.remove();

    const sortedCell = header.querySelector(`[data-id="${fieldValue}"]`);
    if (!sortedCell) {
      return;
    }

    sortedCell.setAttribute('data-order', orderValue);
    sortedCell.append(this._getSortArrow());

    body.innerHTML = this._createRows();
  }

  sort(fieldValue, orderValue) {
    const sameSort = this.sortConfig?.orderValue === orderValue && this.sortConfig?.fieldValue === fieldValue;
    if (sameSort) {
      return;
    }

    this.sortConfig = { fieldValue, orderValue };
    this._applySort(fieldValue, orderValue);
    this._update(fieldValue, orderValue);
  }

  _applySort() {
    const {fieldValue, orderValue} = this.sortConfig;

    const sortType = this.headerMap[fieldValue]?.sortType;

    const comparator = this._getComparator(fieldValue, orderValue, sortType);
    this.sortedData = this.sortedData.sort(comparator);
  }

  _getComparator(fieldValue, orderValue, sortType) {
    const direction = orderValue === 'asc' ? 1 : -1;

    if (sortType === 'number') {
      return (currentRow, nextRow) => {
        const a = currentRow[fieldValue];
        const b = nextRow[fieldValue];

        return (a - b) * direction;
      };
    }

    return (currentRow, nextRow) => {
      const a = String(currentRow[fieldValue]);
      const b = String(nextRow[fieldValue]);
      return a.localeCompare(b, ['ru', 'en'], { caseFirst: 'upper' }) * direction;
    };
  }

  remove() {
    this.element?.remove();
  }

  destroy() {
    this.remove();
    this.element = null;
    this.subElements = {};
  }
}

