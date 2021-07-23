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

class ExtendedSelect {

    constructor(options, selectedOptions, countOfSelectedOptions) {
        this.options = options;
        this.selectedOptions = selectedOptions;
        this.countOfSelectedOptions = countOfSelectedOptions;
    }

    // Fields
    searchSelectContainer = document.createElement('div');
    searchSelectContainerTitle = document.createElement('h2');
    searchSelectModal = document.createElement('div');

    createSearchSelectContainer() {
        this.searchSelectContainer.className = classNameConstants.searchSelectContainer;
        this.searchSelectContainer.innerHTML = tagConstants.defaultSearchSelectSpan;
        document.body.prepend(this.searchSelectContainer);
    }

    createSearchSelectContainerTitle() {
        this.searchSelectContainerTitle.className = classNameConstants.searchSelectContainerTitle;
        this.searchSelectContainerTitle.innerHTML = AllEnums.tendersAsACustomer;
        document.body.insertBefore(this.searchSelectContainerTitle, this.searchSelectContainer);
    }

    addEventToShowModalForm() {
        this.searchSelectContainer.addEventListener('click', () => {
                if (this.searchSelectModal.className === classNameConstants.visuallyHidden) {
                    [this.searchSelectContainer.className, this.searchSelectContainerTitle.className] =
                        [classNameConstants.visuallyHidden, classNameConstants.visuallyHidden];
                    this.searchSelectModal.className = classNameConstants.searchSelectModal;
                }
            }
        )
    }

    createModalForm() {
        this.searchSelectModal.className = classNameConstants.visuallyHidden;
        this.searchSelectModal.innerHTML = `<div class="searchSelectModalHeader">
                                   <div class="searchSelectModalTop">
                                       <button class="searchSelectModalTitle">
                                            ${String.fromCodePoint(0x1F814)} Реализуемые товары
                                       </button>
                                       <button class="searchSelectModalStats">
                                           Выбранное (<span class="countOfSelectedOptions" id="countOfSelectedOptions">
                                                          ${this.countOfSelectedOptions}
                                                      </span>)
                                       </button>
                                   </div>
                                   <div class="searchSelectModalSearch">
                                       <input type="text" class="searchSelectInput" 
                                       placeholder="Введите код ОКРБ или наименование закупаемой продукции"
                                       >
                                   </div>
                               </div>
                               <div class="searchSelectModalMain">
                        
                               </div>
                               <div class="searchSelectModalFooter">
                                   <button type="button" class="selectApply">Применить</button>
                                   <button type="button" class="selectReset">Очистить</button>
                               </div>`;
        document.body.prepend(this.searchSelectModal);
    }

    pushingOptions() {
        let countOfSelectedOptionsSelect = document.getElementById('countOfSelectedOptions');
        let searchSelectModalMain = document.querySelector('.searchSelectModalMain');

        document.querySelectorAll('option').forEach((item, index) => {
            if (item.selected) {
                this.options += `<div class="optionContainer" id="option_${index}" 
                                 style="${styleConstants.activeOptionBackgroundColor}">
                                     <input type="checkbox" id="check_${index}" class="optionCheckBox" checked>
                                     <label for="check_${index}" class="optionCheckBoxLabel">${item.outerHTML}</label>
                                 </div>` + '\n'
                this.countOfSelectedOptions += 1;
                countOfSelectedOptionsSelect.innerText = this.countOfSelectedOptions;
                this.selectedOptions.push(item.innerText);
                this.searchSelectContainer.innerHTML = `<span id='searchSelectSpan'>${this.selectedOptions.join(', ')}</span>`;
                this.searchSelectContainer.style.borderLeftColor = styleConstants.searchSelectContainerBorderLeftColor;
                this.searchSelectContainer.style.borderLeftWidth = styleConstants.searchSelectContainerBorderLeftWidth;
            } else {
                this.options += `<div class="optionContainer" id="option_${index}">
                                     <input type="checkbox" id="check_${index}" class="optionCheckBox">
                                     <label for="check_${index}" class="optionCheckBoxLabel">${item.outerHTML}</label>
                                 </div>` + '\n'
            }
        })
        searchSelectModalMain.innerHTML = this.options;
    }

    addEventChangeCounterAndStyleWhenOptionSelected() {
        let countOfSelectedOptionsSelect = document.getElementById('countOfSelectedOptions')

        document.querySelectorAll('.optionCheckBox').forEach((item, index) => item.addEventListener('click',
            () => {
                let optionContainer = document.getElementById('option_'.concat(`${index}`));
                let optionCheckBox = document.getElementById(`${item.id}`);

                optionCheckBox.checked ?
                    (
                        this.countOfSelectedOptions += 1,
                            countOfSelectedOptionsSelect.innerText = this.countOfSelectedOptions,
                            optionContainer.style = styleConstants.activeOptionBackgroundColor,
                            this.selectedOptions.push(optionContainer.innerText)
                    ) :
                    (
                        this.countOfSelectedOptions -= 1,
                            countOfSelectedOptionsSelect.innerText = this.countOfSelectedOptions,
                            optionContainer.style.background = styleConstants.none,
                            this.selectedOptions = this.selectedOptions.filter(item => !optionContainer.innerText.includes(item))
                    )
            }));
    }

    displayMainForm() {
        if (this.searchSelectContainer.className && this.searchSelectContainerTitle.className === classNameConstants.visuallyHidden) {
            this.searchSelectModal.className = classNameConstants.visuallyHidden;
            [this.searchSelectContainer.className, this.searchSelectContainerTitle.className] =
                [classNameConstants.searchSelectContainer, classNameConstants.searchSelectContainerTitle];
        }
    }

    addEventClickOnSearchSelectModalTitle() {
        let searchSelectModalTitle = document.querySelector('.searchSelectModalTitle');

        searchSelectModalTitle.addEventListener('click', () => {
            this.displayMainForm();
        })
    }

    addEventClickOnSelectApply() {
        let selectApply = document.querySelector('.selectApply');

        selectApply.addEventListener('click', () => {
            this.selectedOptions.length !== 0 ?
                (
                    this.searchSelectContainer.innerHTML = `<span id='searchSelectSpan'>${this.selectedOptions.join(', ')}</span>`,
                        this.searchSelectContainer.style.borderLeftColor = styleConstants.searchSelectContainerBorderLeftColor,
                        this.searchSelectContainer.style.borderLeftWidth = styleConstants.searchSelectContainerBorderLeftWidth
                ) :
                (
                    this.searchSelectContainer.innerHTML = tagConstants.defaultSearchSelectSpan,
                        this.searchSelectContainer.style.borderLeftColor = styleConstants.default,
                        this.searchSelectContainer.style.borderLeftWidth = styleConstants.default
                )
            this.displayMainForm()
        })
    }

    addEventClickOnResetSelect() {
        let selectReset = document.querySelector('.selectReset')
        let searchSelectInput = document.querySelector('.searchSelectInput');
        let countOfSelectedOptions = document.getElementById('countOfSelectedOptions');

        selectReset.addEventListener('click', () => {
            document.querySelectorAll('.optionCheckBox').forEach(item => item.checked = false);
            searchSelectInput.value = '';
            document.querySelectorAll('.optionContainer').forEach(item => {
                item.style.background = styleConstants.none
            });
            document.querySelectorAll('.hideOptionIfNotSearched').forEach(item => {
                item.className = classNameConstants.optionContainer;
                item.style.background = styleConstants.none
            });
            [this.countOfSelectedOptions, this.selectedOptions, countOfSelectedOptions.innerText] = [0, [], 0]
        })
    }

    addEventInputOnSearchSelect() {
        let searchSelectInput = document.querySelector('.searchSelectInput');

        searchSelectInput.addEventListener('input', () => {
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
        })
    }
}

const extendedSelect = new ExtendedSelect('', [], 0);
extendedSelect.createSearchSelectContainer();
extendedSelect.createSearchSelectContainerTitle();
extendedSelect.createModalForm();
extendedSelect.addEventToShowModalForm();
extendedSelect.pushingOptions();
extendedSelect.addEventChangeCounterAndStyleWhenOptionSelected();
extendedSelect.addEventClickOnSearchSelectModalTitle();
extendedSelect.addEventClickOnSelectApply();
extendedSelect.addEventClickOnResetSelect();
extendedSelect.addEventInputOnSearchSelect();