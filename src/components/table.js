import {cloneTemplate} from "../lib/utils.js";

export function initTable(settings, onAction) {
    const {tableTemplate, rowTemplate, before, after} = settings;
    const root = cloneTemplate(tableTemplate);

    if (before && before.length) {
        [...before].reverse().forEach(tplId => {
            root[tplId] = cloneTemplate(tplId);
            root.container.prepend(root[tplId].container);
        });
    }
    if (after && after.length) {
        after.forEach(tplId => {
            root[tplId] = cloneTemplate(tplId);
            root.container.append(root[tplId].container);
        });
    }

    const form = root.container.querySelector('form');
    if (form) {
        form.addEventListener('change', () => onAction());
        form.addEventListener('reset', () => setTimeout(() => onAction(), 0));
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            onAction(e.submitter);
        });
    }

    const render = (data) => {
        const nextRows = data.map(item => {
            const row = cloneTemplate(rowTemplate);
            Object.keys(item).forEach(key => {
                if (row.elements[key]) {
                    row.elements[key].textContent = item[key];
                }
            });
            return row.container;
        });
        root.elements.rows.replaceChildren(...nextRows);
    };

    return {...root, render};
}