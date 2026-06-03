import './fonts/ys-display/fonts.css';
import './style.css';
import { data as sourceData } from "./data/dataset_1.js";
import { initData } from "./data.js";
import { processFormData } from "./lib/utils.js";
import { initTable } from "./components/table.js";
import { initPagination } from './components/pagination.js';
import { initSorting } from './components/sorting.js';
import { initFiltering } from './components/filtering.js';
import { initSearching } from './components/searching.js';   

const { data, sellers, customers } = initData(sourceData);
const indexes = { searchBySeller: sellers };

function collectState() {
    const form = sampleTable.container.querySelector('form');
    const rawState = processFormData(new FormData(form));
    const rowsPerPage = parseInt(rawState.rowsPerPage) || 10;
    const page = parseInt(rawState.page ?? 1);
    return { ...rawState, rowsPerPage, page };
}

function render(action) {
    let state = collectState();
    let result = [...data];

    
    result = applySearching(result, state, action);
    result = applyFiltering(result, state, action);
    result = applySorting(result, state, action);
    result = applyPagination(result, state, action);

    sampleTable.render(result);
}


const sampleTable = initTable({
    tableTemplate: 'table',
    rowTemplate: 'row',
    before: ['search', 'header', 'filter'],   
    after: ['pagination']
}, render);


const applyPagination = initPagination(
    sampleTable.pagination.elements,
    (el, page, isCurrent) => {
        const input = el.querySelector('input');
        const span = el.querySelector('span');
        input.value = page;
        input.checked = isCurrent;
        span.textContent = page;
        return el;
    }
);

const applySorting = initSorting([
    sampleTable.header.elements.sortByDate,
    sampleTable.header.elements.sortByTotal
]);

const applyFiltering = initFiltering(
    sampleTable.filter.elements,
    indexes
);

const applySearching = initSearching('search');   

const appRoot = document.querySelector('#app');
appRoot.appendChild(sampleTable.container);
render();