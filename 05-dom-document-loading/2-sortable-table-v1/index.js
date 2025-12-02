export default class SortableTable {
  constructor(headerConfig = [], data = []) {
    this.data = data;
    this._sortedData = [...this.data];
    this.headerConfig = headerConfig;
    this._headerMap = this._createHeaderMap();
    this._sortConfig = null;
    this.element = this._createElement();
    this.subElements = this._createSubElements();
  }

  _createHeaderMap() {
    return this.headerConfig.reduce((acc, column) => {
      acc[column.id] = column;
      return acc;
    }, {});
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
        data-order="${this._sortConfig?.orderValue ?? ''}">
          <span>${column.title}</span>
        </div>`;
    }).join('');
    return header;
  }

  _createRowElement(rowData) {
    const row = document.createElement("a");
    row.href = `/products/${rowData.id}`;
    row.classList.add("sortable-table__row");

    Object.keys(this._headerMap).forEach(key => {
      const cellData = rowData[key];
      const template = this._headerMap[key]?.template;

      const cellWrapper = document.createElement("div");
      cellWrapper.innerHTML = template ? template(cellData) : `<div class="sortable-table__cell">${cellData}</div>`;

      row.append(cellWrapper.firstElementChild);
    });

    return row;
  }

  _renderBody(body) {
    body.innerHTML = '';
    const fragment = document.createDocumentFragment();

    this._sortedData.forEach(rowData => {
      fragment.append(this._createRowElement(rowData));
    });

    body.append(fragment);
  }

  _createBody() {
    const body = document.createElement("div");
    body.classList.add("sortable-table__body");
    body.setAttribute('data-element', 'body');

    this._renderBody(body);
    return body;
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
    const {fieldValue, orderValue} = this._sortConfig;

    header.querySelector('[data-element="arrow"]')?.remove();

    const sortedCell = header.querySelector(`[data-id="${fieldValue}"]`);
    if (!sortedCell) {
      return;
    }

    sortedCell.setAttribute('data-order', orderValue);
    sortedCell.append(this._getSortArrow());

    this._renderBody(body);
  }

  _applySort() {
    const {fieldValue, orderValue} = this._sortConfig;

    const sortType = this._headerMap[fieldValue]?.sortType;

    const comparator = this._getComparator(fieldValue, orderValue, sortType);
    this._sortedData = this._sortedData.sort(comparator);
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

  sort(fieldValue, orderValue) {
    const sameSort = this._sortConfig?.orderValue === orderValue && this._sortConfig?.fieldValue === fieldValue;
    const column = this._headerMap[fieldValue];
    if (sameSort || !column.sortable) {
      return;
    }

    this._sortConfig = { fieldValue, orderValue };
    this._applySort(fieldValue, orderValue);
    this._update(fieldValue, orderValue);
  }

  remove() {
    this.element.remove();
  }

  destroy() {
    this.remove();
  }
}

