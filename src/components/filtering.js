import { createComparison } from '../lib/compare.js';

const rangeTotalRule = () => (key, sourceValue, targetValue, source, target) => {
    const from = target.totalFrom;
    const to = target.totalTo;
    if ((!from && from !== 0) && (!to && to !== 0)) return { result: true };
    const value = Number(source.total);
    if (isNaN(value)) return { result: false };
    if (from && value < Number(from)) return { result: false };
    if (to && value > Number(to)) return { result: false };
    return { result: true };
};

const defaultRules = ['skipNonExistentSourceFields', 'skipEmptyTargetValues'];

export function initFiltering(elements, indexes) {
    Object.keys(indexes).forEach(elementName => {
        const select = elements[elementName];
        if (select && indexes[elementName]) {
            const options = Object.values(indexes[elementName]).map(name => {
                const option = document.createElement('option');
                option.value = name;
                option.textContent = name;
                return option;
            });
            select.append(...options);
        }
    });

    return (data, state, action) => {
        if (action && action.name === 'clear') {
            const field = action.dataset.field;
            const wrapper = action.closest('.filter-wrapper');
            if (wrapper) {
                const input = wrapper.querySelector('input');
                if (input) {
                    input.value = '';
                    state[field] = '';
                }
            }
        }

        const compare = createComparison(defaultRules, [rangeTotalRule()]);
        return data.filter(row => compare(row, state));
    };
}