

let editor;
let files = {};
let currentFile = null;
let closedError = true;
let disabledMove = false;
let selectionsContainer;
let rightSelector;
let leftSelector;
let selectorMenu;
let globalPoseMenu = 0;

require.config({ paths: { 'vs': 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.49.0/min/vs' } });

require(['vs/editor/editor.main'], function () {
    editor = monaco.editor.create(document.getElementById('editor'), {
        value: [
            '// A simple JavaScript script to test touch event for monaco',
            '',
            'function greetUser(name) {',
            '  console.log("Hello, " + name + "!");',
            '}',
            '',
            'function factorial(n) {',
            '  if (n === 0) {',
            '    return 1;',
            '  }',
            '  return n * factorial(n - 1);',
            '}',
            '',
            'function findMax(arr) {',
            '  let max = arr[0];',
            '  for (let i = 1; i < arr.length; i++) {',
            '    if (arr[i] > max) {',
            '      max = arr[i];',
            '    }',
            '  }',
            '  return max;',
            '}',
            '',
            'function reverseString(str) {',
            '  return str.split("").reverse().join("");',
            '}',
            '',
            'greetUser("Alice");',
            'console.log("Factorial of 5:", factorial(5));',
            'console.log("Max in [1, 2, 3, 4, 5]:", findMax([1, 2, 3, 4, 5]));',
            'console.log("Reverse of \'JavaScript\':", reverseString("JavaScript"));',
            '',
            'let numbers = [1, 2, 3, 4, 5];',
            'let doubled = numbers.map(function(num) {',
            '  return num * 2;',
            '});',
            'console.log("Doubled numbers:", doubled);',
            '',
            'let person = {',
            '  firstName: "John",',
            '  lastName: "Doe",',
            '  age: 30,',
            '  fullName: function() {',
            '    return this.firstName + " " + this.lastName;',
            '  }',
            '};',
            'console.log("Person\'s full name:", person.fullName());',
            '',
            'function fetchData(url) {',
            '  return new Promise((resolve, reject) => {',
            '    setTimeout(() => {',
            '      resolve("Data from " + url);',
            '    }, 1000);',
            '  });',
            '}',
            '',
            'fetchData("https://api.example.com").then(data => {',
            '  console.log(data);',
            '}).catch(error => {',
            '  console.error("Error fetching data:", error);',
            '});'
        ].join('\n'),
        language: 'javascript',
        theme: 'vs-dark',
        minimap: { enabled: false },
        wordWrap: 'off',
        lineDecorationsWidth: 0,
        lineNumbersMinChars: 3,
        lineNumbers: 'on',
        tabSize: 2,
        contextmenu: false
    });


    function undo() {
        editor.trigger('keyboard', 'undo', null);
    }

    // Function to perform redo in Monaco Editor
    function redo() {
        editor.trigger('keyboard', 'redo', null);
    }

    function selectAll() {
        editor.focus();
        const id = document.querySelector('.tap.selected').getAttribute('data-file-id');
        const model = files[id].model;
        if (model) {
            const fullRange = model.getFullModelRange();
            editor.setSelection(fullRange);
        }
    }

    function copy() {
        const selection = editor.getSelection();
        const selectedText = editor.getModel().getValueInRange(selection);
        navigator.clipboard.writeText(selectedText).then(() => {
            error('Copied to clipboard')

        }).catch(err => {
            error('Error in copying', err)
        });
    }

    // Function to cut the current selection in Monaco Editor
    function cut() {
        const selection = editor.getSelection();
        const selectedText = editor.getModel().getValueInRange(selection);
        navigator.clipboard.writeText(selectedText).then(() => {
            editor.executeEdits('', [{ range: selection, text: '' }]);
        }).catch(err => {
            editor.executeEdits('', [{ range: selection, text: '' }]);
        });
    }

    // Function to paste the content from the clipboard into Monaco Editor
    function paste() {
        navigator.clipboard.readText().then(text => {
            const selection = editor.getSelection();
            editor.executeEdits('', [{ range: selection, text }]);
            console.log('Pasted from clipboard');
        }).catch(err => {
            console.error('Failed to paste: ', err);
        });
    }
    function formatDocument() {
        editor.focus();
        editor.getAction('editor.action.formatDocument').run();
    }
    // Expose functions to global scope
    window.undo = undo;
    window.redo = redo;
    window.undo = undo;
    window.copy = copy;
    window.cut = cut;
    window.paste = paste
    window.selectAll = selectAll;
    window.formatDocument = formatDocument;

    function initializeSelector() {
        // Create the selectors container
        selectionsContainer = document.createElement('div');
        selectionsContainer.className = 'selections hidden';

        // Create the right-selector and left-selector divs
        rightSelector = document.createElement('div');
        rightSelector.className = 'selctos right-selector';
        leftSelector = document.createElement('div');
        leftSelector.className = 'selctos left-selector';

        // Append the selectors to the container
        selectionsContainer.appendChild(rightSelector);
        selectionsContainer.appendChild(leftSelector);

        // Add the selections container to the Monaco editor scrollable area
        const editorScrollableNode = document.querySelector('.lines-content.monaco-editor-background');
        editorScrollableNode.insertAdjacentElement('afterbegin', selectionsContainer);


        // selectors

        selectorMenu = document.createElement('div');
        selectorMenu.className = 'menu-selector hidden';
        // Create the outer container
        const outsetContainer = document.createElement('div');
        outsetContainer.className = 'outset-shit-select';

        // Create the inner menu container
        const insetMenu = document.createElement('div');
        insetMenu.className = 'inset-menu';

        // Create and append menu items to the inner menu container
        const menuItems = [
            { className: 'copy', text: 'Copy', action: copy },
            { className: 'cut', text: 'Cut', action: cut },
            { className: 'paste', text: 'Paste', action: paste },
            { className: 'select', text: 'Select all', action: selectAll },
            { className: 'undo', text: 'Undo', action: undo },
            { className: 'redo', text: 'Redo', action: redo },
            { className: 'format', text: 'Format document', action: formatDocument }
        ];

        menuItems.forEach(item => {
            const div = document.createElement('div');
            div.className = `mnc ${item.className}`;
            div.innerHTML = `<span>${item.text}</span>`;
            div.ontouchstart = function () {
                this.classList.add('hovered');
            };
            div.ontouchmove = function () {
                this.classList.remove('hovered');
            };
            div.ontouchend = function () {
                this.classList.remove('hovered');
                item.action();
                selectorMenu.classList.add('hidden')
            };
            insetMenu.appendChild(div);
        });


        // Create and append the right-arrow element
        const leftArrow = document.createElement('div');
        leftArrow.className = 'right-arrow-mnc left';
        leftArrow.ontouchstart = function () {
            this.classList.add('hovered');
        };
        leftArrow.ontouchmove = function () {
            this.classList.remove('hovered');
        };

        leftArrow.ontouchend = function () {
            this.classList.remove('hovered');
            const containerWidth = outsetContainer.offsetWidth;
            let newScrollPosition = currentScrollPosition - containerWidth;
            if (newScrollPosition < 0) {
                newScrollPosition = 0;
            }
            outsetContainer.scrollTo({
                left: newScrollPosition,
                behavior: 'smooth'
            });
            currentScrollPosition = newScrollPosition;
            if (newScrollPosition < 5) {
                selectorMenu.classList.remove('scrolled');
            }
        };

        const rightArrow = document.createElement('div');
        rightArrow.className = 'right-arrow-mnc';
        rightArrow.ontouchstart = function () {
            this.classList.add('hovered');
        };
        rightArrow.ontouchmove = function () {
            this.classList.remove('hovered');
        };

        let currentScrollPosition = 0;
        rightArrow.ontouchend = function () {
            this.classList.remove('hovered');
            const containerWidth = outsetContainer.offsetWidth;
            const scrollWidth = outsetContainer.scrollWidth;
            let newScrollPosition = currentScrollPosition + containerWidth;
            if (newScrollPosition > scrollWidth) {
                newScrollPosition = scrollWidth;
            }
            outsetContainer.scrollTo({
                left: newScrollPosition,
                behavior: 'smooth'
            });
            currentScrollPosition = newScrollPosition;
            selectorMenu.classList.add('scrolled');
        };

        outsetContainer.appendChild(insetMenu);
        selectorMenu.appendChild(outsetContainer);
        selectorMenu.appendChild(rightArrow);
        selectorMenu.appendChild(leftArrow);

        selectorMenu.addEventListener('touchstart', (event) => {
            const touch = event.touches[0];
            event.preventDefault();
            disabledMove = true;
        });

        selectorMenu.addEventListener('touchmove', (event) => {
            const touch = event.touches[0];
            event.preventDefault();
            disabledMove = true;
        });

        selectorMenu.addEventListener('touchend', (event) => {
            const touch = event.touches[0];
            event.preventDefault();
            disabledMove = false;
        });

        editorScrollableNode.insertAdjacentElement('afterbegin', selectorMenu);

        function handleSelectorTouch(selector, isLeft) {
            let touchStartPos;
            let initialSelection;
            let touchMoved = false;  // Track if touchmove occurred
            let touchEndTimeout;  // Timeout to handle fast moves

            selector.addEventListener('touchstart', (event) => {
                const touch = event.touches[0];
                touchStartPos = { x: touch.clientX, y: touch.clientY };
                initialSelection = editor.getSelection();
                touchMoved = false;  // Reset touchMoved flag
                if (touchEndTimeout) clearTimeout(touchEndTimeout);
                event.preventDefault();
                disabledMove = true;
            });

            selector.addEventListener('touchmove', (event) => {
                const touch = event.touches[0];
                const target = editor.getTargetAtClientPoint(touch.clientX, touch.clientY);

                if (target && target.position) {
                    const newSelection = isLeft
                        ? new monaco.Selection(
                            target.position.lineNumber,
                            target.position.column,
                            initialSelection.endLineNumber,
                            initialSelection.endColumn
                        )
                        : new monaco.Selection(
                            initialSelection.startLineNumber,
                            initialSelection.startColumn,
                            target.position.lineNumber,
                            target.position.column
                        );
                    editor.setSelection(newSelection);
                    touchMoved = true;  // Mark that touchmove occurred
                }
                event.preventDefault();
            });

            selector.addEventListener('touchend', (event) => {
                if (!touchMoved) {
                    const touch = event.changedTouches[0];
                    const target = editor.getTargetAtClientPoint(touch.clientX, touch.clientY);

                    if (target && target.position) {
                        const newSelection = isLeft
                            ? new monaco.Selection(
                                target.position.lineNumber,
                                target.position.column,
                                initialSelection.endLineNumber,
                                initialSelection.endColumn
                            )
                            : new monaco.Selection(
                                initialSelection.startLineNumber,
                                initialSelection.startColumn,
                                target.position.lineNumber,
                                target.position.column
                            );
                        editor.setSelection(newSelection);
                    }
                }
                touchStartPos = null;
                initialSelection = null;
                touchMoved = false;
            });
        }

        handleSelectorTouch(leftSelector, true);
        handleSelectorTouch(rightSelector, false);

    }

    const editorElement = document.getElementById('editor');
    let touchTimeout;
    let touchCount = 0;
    let startPosition;
    let isSelecting = false;

    function getLineYCoordinate(position) {
        const lineTop = editor.getTopForLineNumber(position.lineNumber);
        const editorCoords = editorElement.getBoundingClientRect();
        const lineY = window.scrollY + editorCoords.top + lineTop - tapsHeight;
        return lineY;
    }

    function isPositionInSelection(position) {
        const selection = editor.getSelection();
        if (!selection || selection.isEmpty()) {
            return false;
        }

        const startPosition = selection.getStartPosition();
        const endPosition = selection.getEndPosition();

        // Compare the position with the selection range
        const isInRange = (
            position.lineNumber > startPosition.lineNumber ||
            (position.lineNumber === startPosition.lineNumber && position.column >= startPosition.column)
        ) && (
                position.lineNumber < endPosition.lineNumber ||
                (position.lineNumber === endPosition.lineNumber && position.column <= endPosition.column)
            );

        return isInRange;
    }

    editorElement.addEventListener('touchstart', (event) => {
        if (selectorMenu.contains(event.target) || selectionsContainer.contains(event.target)) {
            event.stopPropagation();
            event.preventDefault();
        }
        touchCount++;
        if (touchTimeout) {
            clearTimeout(touchTimeout);
        }

        touchTimeout = setTimeout(() => {
            // in here, want get YValue based on line offset top like the value of the rouched line  to document
            isSelecting = true;
            if (!isPositionInSelection(startPosition)) {
                editor.setPosition(startPosition);
            }
            let YValue = getLineYCoordinate(startPosition);
            showContextMenu(event.touches[0].clientX, YValue - 50);
        }, 1000); // 1 second long press to show context menu
        const touch = event.touches[0];
        const target = editor.getTargetAtClientPoint(touch.clientX, touch.clientY);
        if (target && target.position) {
            startPosition = target.position;
        }
    });

    editorElement.addEventListener('touchend', () => {
        if (touchTimeout) {
            clearTimeout(touchTimeout);
        }
        if (isSelecting) {
            isSelecting = false;
        }
        if (disabledMove) {
            disabledMove = false;
        }
    });

    const tapsHeight = -3 // assuming you have some element on top that takes some height
    const leftLength = document.querySelector('.monaco-editor .margin').offsetWidth

    editorElement.addEventListener('touchmove', (event) => {
        if (touchTimeout) {
            clearTimeout(touchTimeout);
        }

        if (disabledMove) {
            event.preventDefault();
            event.stopPropagation();
        }

        if (startPosition && isSelecting) {
            event.preventDefault();
            event.stopPropagation();
            const touch = event.touches[0];
            const target = editor.getTargetAtClientPoint(touch.clientX, touch.clientY);
            if (target && target.position) {
                editor.setSelection(new monaco.Selection(startPosition.lineNumber, startPosition.column, target.position.lineNumber, target.position.column));
                isSelecting = true;
            }
        }
    });

    editor.onDidChangeCursorSelection((e) => {
        const selection = e.selection;
        const startPosition = selection.getStartPosition();
        const endPosition = selection.getEndPosition();

        if (selection.isEmpty()) {
            // Hide the selections container when there's no selection
            selectionsContainer.classList.add('hidden');
            selectorMenu.classList.add('hidden')
            return;
        }

        // Get the top position of the start and end lines
        const startLineTop = editor.getTopForLineNumber(startPosition.lineNumber);
        const endLineTop = editor.getTopForLineNumber(endPosition.lineNumber);

        // Get the position of the start and end of the selection in client coordinates
        const startCoords = editor.getScrolledVisiblePosition(startPosition);
        const endCoords = editor.getScrolledVisiblePosition(endPosition);

        if (startCoords && endCoords) {
            const editorCoords = editorElement.getBoundingClientRect();

            // Calculate positions for the selectors based on line number top positions
            const leftSelectorX = editorCoords.left + startCoords.left - leftLength;
            const leftSelectorY = editorCoords.top + startLineTop - tapsHeight;
            const rightSelectorX = editorCoords.left + endCoords.left - leftLength;
            const rightSelectorY = editorCoords.top + endLineTop - tapsHeight;

            // Update the left-selector position
            leftSelector.style.transform = `translateX(${leftSelectorX - 30}px) translateY(${leftSelectorY - 8}px)`;
            // Update the right-selector position
            rightSelector.style.transform = `translateX(${rightSelectorX - 30}px) translateY(${rightSelectorY - 8}px)`;
            globalPoseMenu = leftSelectorY - 50
        }

        // Show the selections container when there is a selection
        selectionsContainer.classList.remove('hidden');
    });

    initializeSelector();

    function showContextMenu(x, y) {
        let top = globalPoseMenu == 0 ? y : globalPoseMenu
        if (top < 50) {
            top = 60;
        }
        selectorMenu.style.transform = `translateY(${top}px)`
        selectorMenu.classList.remove('hidden')
    }

    editorElement.addEventListener('click', (event) => {
        event.stopPropagation();
    });
});