import { sortCollection, sortMap } from "../lib/sort.js";

export function initSorting(columns) {
    return (data, state, action) => {
        let field = null;
        let order = null;

        if (action && action.name === 'sort') {
            action.dataset.value = sortMap[action.dataset.value];
            field = action.dataset.field;
            order = action.dataset.value;

            columns.forEach(column => {
                if (column !== action && column.dataset.field !== field) {
                    column.dataset.value = 'none';
                }
            });
        } else {
            for (const column of columns) {
                if (column.dataset.value !== 'none') {
                    field = column.dataset.field;
                    order = column.dataset.value;
                    break;
                }
            }
        }

        if (field && order && order !== 'none') {
            return sortCollection(data, field, order);
        }
        return data;
    };
}