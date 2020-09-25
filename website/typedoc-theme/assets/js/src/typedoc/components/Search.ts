import {Component, IComponentOptions} from "../Component";
import {Index} from 'lunr';

interface IDocument {
    id: number;
    kind: number;
    name: string;
    url: string;
    classes: string;
    parent?: string;
}

interface IData {
    kinds: { [kind: number]: string };
    rows: IDocument[];
    index: object;
}

/**
 * Loading state definitions.
 */
enum SearchLoadingState {
    Idle, Loading, Ready, Failure
}

/**
 * Provides an indexed search on generated documentation
 */
export class Search extends Component {
    /**
     * The input field of the search widget.
     */
    private field: HTMLInputElement;

    /**
     * The result list wrapper.
     */
    private results: HTMLElement;

    /**
     * The base url that must be prepended to the indexed urls.
     */
    private base: string;

    /**
     * The current query string.
     */
    private query: string = '';

    /**
     * The state the search is currently in.
     */
    private loadingState: SearchLoadingState = SearchLoadingState.Idle;

    /**
     * Is the input field focused?
     */
    private hasFocus: boolean = false;

    /**
     * Should the next key press be prevents?
     */
    private preventPress: boolean = false;

    /**
     * The search data
     */
    private data: IData | null = null;

    /**
     * The lunr index used to search the documentation.
     */
    private index: Index | null = null;

    /**
     * Has a search result been clicked?
     * Used to stop the results hiding before a user can fully click on a result.
     */
    private resultClicked: boolean = false;

    constructor(options: IComponentOptions) {
        super(options);

        const field = document.querySelector<HTMLInputElement>('#tsd-search-field');
        const results = document.querySelector<HTMLElement>('.results');

        if (!field || !results) {
            throw new Error('The input field or the result list wrapper are not found');
        }

        this.field = field;
        this.results = results;

        this.base = this.el.dataset.base + '/';

        this.bindEvents();
    }

    /**
     * Lazy load the search index and parse it.
     */
    private loadIndex() {
        if (this.loadingState != SearchLoadingState.Idle || this.data) return;

        setTimeout(() => {
            if (this.loadingState == SearchLoadingState.Idle) {
                this.setLoadingState(SearchLoadingState.Loading);
            }
        }, 500);

        const url = this.el.dataset.index;
        if (!url) {
            this.setLoadingState(SearchLoadingState.Failure);
            return;
        }

        fetch(url)
            .then(response => {
                if (!response.ok) {
                    throw new Error('The search index is missing');
                }

                return response.json();
            })
            .then((source: IData) => {
                this.data = source;
                this.index = Index.load(source.index);

                this.setLoadingState(SearchLoadingState.Ready);
            })
            .catch((error) => {
                console.error(error);
                this.setLoadingState(SearchLoadingState.Failure);
            });
    }


    /**
     * Update the visible state of the search control.
     */
    private updateResults() {
        // Don't clear results, if loading state is not ready,
        // because loading or error message can be removed.
        if (this.loadingState != SearchLoadingState.Ready) return;

        this.results.textContent = '';
        if (!this.query || !this.index || !this.data) return;

        // Perform a wildcard search
        let res = this.index.search(`*${this.query}*`);

        // If still no results, try a fuzzy match search
        if (res.length === 0) {
            res = this.index.search(`*${this.query}~1*`);
        }

        for (let i = 0, c = Math.min(10, res.length); i < c; i++) {
            const row = this.data.rows[Number(res[i].ref)];

            // Bold the matched part of the query in the search results
            let name = row.name.replace(new RegExp(this.query, 'i'), (match: string) => `<b>${match}</b>`);
            let parent = row.parent || '';
            parent = parent.replace(new RegExp(this.query, 'i'), (match: string) => `<b>${match}</b>`);

            if (parent) name = '<span class="parent">' + parent + '.</span>' + name;
            const item = document.createElement('li');
            item.classList.value = row.classes;
            item.innerHTML = `
                    <a href="${this.base + row.url}" class="tsd-kind-icon">${name}</a>
                `;
            this.results.appendChild(item);
        }
    }


    /**
     * Set the loading state and update the visual state accordingly.
     */
    private setLoadingState(value: SearchLoadingState) {
        if (this.loadingState == value) return;

        this.el.classList.remove(SearchLoadingState[this.loadingState].toLowerCase());
        this.loadingState = value;
        this.el.classList.add(SearchLoadingState[this.loadingState].toLowerCase());

        this.updateResults();
    }


    /**
     * Set the focus state and update the visual state accordingly.
     */
    private setHasFocus(value: boolean) {
        if (this.hasFocus == value) return;
        this.hasFocus = value;
        this.el.classList.toggle('has-focus');

        if (!value) {
            this.field.value = this.query;
        } else {
            this.setQuery('');
            this.field.value = '';
        }
    }


    /**
     * Set the query string and update the results.
     */
    private setQuery(value: string) {
        this.query = value.trim();
        this.updateResults();
    }


    /**
     * Move the highlight within the result set.
     */
    private setCurrentResult(dir: number) {
        let current = this.results.querySelector('.current');
        if (!current) {
            current = this.results.querySelector(dir == 1 ? 'li:first-child' : 'li:last-child');
            if (current) {
                current.classList.add('current')
            }
        } else {
            const rel = dir == 1 ? current.nextElementSibling : current.previousElementSibling;
            if (rel) {
                current.classList.remove('current');
                rel.classList.add('current');
            }
        }
    }


    /**
     * Navigate to the highlighted result.
     */
    private gotoCurrentResult() {
        let current = this.results.querySelector('.current');

        if (!current) {
            current = this.results.querySelector('li:first-child');
        }

        if (current) {
            const link = current.querySelector('a');
            if (link) {
                window.location.href = link.href;
            }
            this.field.blur();
        }
    }

    /**
     * Bind events on result list wrapper, input field and document body.
     */
    private bindEvents() {
        /**
         * Intercept mousedown and mouseup events so we can correctly
         * handle clicking on search results.
         */
        this.results.addEventListener('mousedown', () => {
            this.resultClicked = true;
        });
        this.results.addEventListener('mouseup', () => {
            this.resultClicked = false;
            this.setHasFocus(false);
        });


        /**
         * Bind all required events on the input field.
         */
        this.field.addEventListener('focusin', () => {
            this.setHasFocus(true);
            this.loadIndex();
        });
        this.field.addEventListener('focusout', () => {
            // If the user just clicked on a search result, then
            // don't lose the focus straight away, as this prevents
            // them from clicking the result and following the link
            if (this.resultClicked) {
                this.resultClicked = false;
                return;
            }

            setTimeout(() => this.setHasFocus(false), 100);
        });
        this.field.addEventListener('input', () => {
            this.setQuery(this.field.value);
        });
        this.field.addEventListener('keydown', (e) => {
            if (e.keyCode == 13 || e.keyCode == 27 || e.keyCode == 38 || e.keyCode == 40) {
                this.preventPress = true;
                e.preventDefault();

                if (e.keyCode == 13) {
                    this.gotoCurrentResult();
                } else if (e.keyCode == 27) {
                    this.field.blur();
                } else if (e.keyCode == 38) {
                    this.setCurrentResult(-1);
                } else if (e.keyCode == 40) {
                    this.setCurrentResult(1);
                }
            } else {
                this.preventPress = false;
            }
        });
        this.field.addEventListener('keypress', (e) => {
            if (this.preventPress) e.preventDefault();
        });


        /**
         * Start searching by pressing a key on the body.
         */
        document.body.addEventListener('keydown', e => {
            if (e.altKey || e.ctrlKey || e.metaKey) return;
            if (!this.hasFocus && e.keyCode > 47 && e.keyCode < 112) {
                this.field.focus();
            }
        });
    }
}

