// Constants
const styleConstants = {
    activeOptionBackgroundColor: "background: linear-gradient(0deg, rgba(3, 91, 119, 0.05), rgba(3, 91, 119, 0.05)), #FFFFFF",
    searchSelectContainerBorderLeftColor: '#035b77',
    searchSelectContainerBorderLeftWidth: '3px',
    none: 'none',
    default: ''
}

const tagConstants = {
    defaultSearchSelectSpan: "<span id='searchSelectSpan'>Код ОКРБ или наименование закупаемой продукции</span>",
}

const classNameConstants = {
    searchSelectContainer: "searchSelectContainer",
    searchSelectContainerTitle: "searchSelectContainerTitle",
    visuallyHidden: "visually-hidden",
    searchSelectModal: "searchSelectModal",
    optionContainer: "optionContainer",
    hideOptionIfNotSearched: "hideOptionIfNotSearched"
}

// Enum
const AllEnums = {
    tendersAsACustomer: "Тендеры в роли Заказчика",
}

// App State
const state = {
    options: '',
    selectedOptions: [],
    countOfSelectedOptions: 0,
}

// Create Main Form
let searchSelectContainer = document.createElement('div');
searchSelectContainer.className = classNameConstants.searchSelectContainer;
searchSelectContainer.innerHTML = tagConstants.defaultSearchSelectSpan;
document.body.prepend(searchSelectContainer);

let searchSelectContainerTitle = document.createElement('h2')
searchSelectContainerTitle.className = classNameConstants.searchSelectContainerTitle;
searchSelectContainerTitle.innerHTML = AllEnums.tendersAsACustomer;
document.body.insertBefore(searchSelectContainerTitle, searchSelectContainer);

// Show Modal Form
searchSelectContainer.addEventListener('click', () => {
        if (searchSelectModal.className === classNameConstants.visuallyHidden) {
            [searchSelectContainer.className, searchSelectContainerTitle.className] =
                [classNameConstants.visuallyHidden, classNameConstants.visuallyHidden];
            searchSelectModal.className = classNameConstants.searchSelectModal;
        }
    }
)

// Create Modal Form
let searchSelectModal = document.createElement('div');
searchSelectModal.className = classNameConstants.visuallyHidden;
searchSelectModal.innerHTML = `<div class="searchSelectModalHeader">
                                   <div class="searchSelectModalTop">
                                       <button class="searchSelectModalTitle" onclick="displayMainForm()">
                                            ${String.fromCodePoint(0x1F814)} Реализуемые товары
                                       </button>
                                       <button class="searchSelectModalStats">
                                           Выбранное (<span class="countOfSelectedOptions" id="countOfSelectedOptions">
                                                          ${state.countOfSelectedOptions}
                                                      </span>)
                                       </button>
                                   </div>
                                   <div class="searchSelectModalSearch">
                                       <input type="text" class="searchSelectInput" oninput="searchSelect()" 
                                       placeholder="Введите код ОКРБ или наименование закупаемой продукции"
                                       >
                                   </div>
                               </div>
                               <div class="searchSelectModalMain">
                        
                               </div>
                               <div class="searchSelectModalFooter">
                                   <button type="button" class="selectApply" onclick="applySelectedOptions()">Применить</button>
                                   <button type="button" class="selectReset" onclick="resetSelect()">Очистить</button>
                               </div>`;
document.body.prepend(searchSelectModal);

// Selectors
let countOfSelectedOptions = document.getElementById('countOfSelectedOptions');
let searchSelectModalMain = document.querySelector('.searchSelectModalMain');
let searchSelectInput = document.querySelector('.searchSelectInput');

// Modification options from HTML and pushing into Modal Form
document.querySelectorAll('option').forEach((item, index) => {
    if (item.selected) {
        state.options += `<div class="optionContainer" id="option_${index}" 
                               style="${styleConstants.activeOptionBackgroundColor}">
                              <input type="checkbox" id="check_${index}" class="optionCheckBox" checked>
                              <label for="check_${index}" class="optionCheckBoxLabel">${item.outerHTML}</label>
                          </div>` + '\n'
        state.countOfSelectedOptions += 1;
        countOfSelectedOptions.innerText = state.countOfSelectedOptions;
        state.selectedOptions.push(item.innerText);
        searchSelectContainer.innerHTML = `<span id='searchSelectSpan'>${state.selectedOptions.join(', ')}</span>`;
        searchSelectContainer.style.borderLeftColor = styleConstants.searchSelectContainerBorderLeftColor;
        searchSelectContainer.style.borderLeftWidth = styleConstants.searchSelectContainerBorderLeftWidth;
    } else {
        state.options += `<div class="optionContainer" id="option_${index}">
                              <input type="checkbox" id="check_${index}" class="optionCheckBox">
                              <label for="check_${index}" class="optionCheckBoxLabel">${item.outerHTML}</label>
                          </div>` + '\n'
    }
})
searchSelectModalMain.innerHTML = state.options;

// Change counter and style when option is selected or unselected
document.querySelectorAll('.optionCheckBox').forEach((item, index) => item.addEventListener('click',
    () => {
        let optionContainer = document.getElementById('option_'.concat(`${index}`));
        let optionCheckBox = document.getElementById(`${item.id}`);

        optionCheckBox.checked ?
            (
                state.countOfSelectedOptions += 1,
                    countOfSelectedOptions.innerText = state.countOfSelectedOptions,
                    optionContainer.style = styleConstants.activeOptionBackgroundColor,
                    state.selectedOptions.push(optionContainer.innerText)
            ) :
            (
                state.countOfSelectedOptions -= 1,
                    countOfSelectedOptions.innerText = state.countOfSelectedOptions,
                    optionContainer.style.background = styleConstants.none,
                    state.selectedOptions = state.selectedOptions.filter(item => !optionContainer.innerText.includes(item))
            )
    }));

function displayMainForm() {
    if (searchSelectContainer.className && searchSelectContainerTitle.className === classNameConstants.visuallyHidden) {
        searchSelectModal.className = classNameConstants.visuallyHidden;
        [searchSelectContainer.className, searchSelectContainerTitle.className] =
            [classNameConstants.searchSelectContainer, classNameConstants.searchSelectContainerTitle];
    }
}

function applySelectedOptions() {
    state.selectedOptions.length !== 0 ?
        (
            searchSelectContainer.innerHTML = `<span id='searchSelectSpan'>${state.selectedOptions.join(', ')}</span>`,
                searchSelectContainer.style.borderLeftColor = styleConstants.searchSelectContainerBorderLeftColor,
                searchSelectContainer.style.borderLeftWidth = styleConstants.searchSelectContainerBorderLeftWidth
        ) :
        (
            searchSelectContainer.innerHTML = tagConstants.defaultSearchSelectSpan,
                searchSelectContainer.style.borderLeftColor = styleConstants.default,
                searchSelectContainer.style.borderLeftWidth = styleConstants.default
        )
    displayMainForm()
}

function resetSelect() {
    document.querySelectorAll('.optionCheckBox').forEach(item => item.checked = false);
    searchSelectInput.value = '';
    document.querySelectorAll('.optionContainer').forEach(item => {
        item.style.background = styleConstants.none
    });
    document.querySelectorAll('.hideOptionIfNotSearched').forEach(item => {
        item.className = classNameConstants.optionContainer;
        item.style.background = styleConstants.none
    });
    [state.countOfSelectedOptions, state.selectedOptions, countOfSelectedOptions.innerText] = [0, [], 0]
}

function searchSelect() {
    let searchValue = searchSelectInput.value.trim();
    let options = document.querySelectorAll('option');

    if (searchValue !== '') {
        options.forEach((item, index) => {
            let optionContainer = document.getElementById('option_'.concat(`${index}`));
            if (item.innerText.toLowerCase().search(searchValue.toLowerCase()) === -1) {
                if (optionContainer === null) {
                    return;
                }
                optionContainer.className = classNameConstants.hideOptionIfNotSearched;
            } else {
                if (optionContainer === null) {
                    return;
                }
                optionContainer.className = classNameConstants.optionContainer;
            }
        })
    } else {
        options.forEach((item, index) => {
            let optionContainer = document.getElementById('option_'.concat(`${index}`));
            if (optionContainer === null) {
                return;
            }
            optionContainer.className = classNameConstants.optionContainer;
        })
    }
}