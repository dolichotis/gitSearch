class View {
    constructor() {
        this.app = document.getElementById('app');

        this.title = this.createElement('h1', 'title');
        this.title.textContent = 'Search GIT repositories';

        this.searchLine = this.createElement('div', 'searchLine');
        this.searchInput = this.createElement('input', 'searchInput');
        this.requestsBox = this.createElement('ul', 'requestsBox');
        this.searchLine.append(this.searchInput);
        this.searchLine.append(this.requestsBox);
        
        this.main = this.createElement('div', 'main');

        this.app.append(this.title);
        this.app.append(this.searchLine);
        this.app.append(this.main);
    }

    createElement(elementTag, elementClass) {
        const element = document.createElement(elementTag);
        if(elementClass) element.classList.add(elementClass);
        
        return element;
    }

    createRepo(repoData) {
        const request = this.createElement('li', 'request');
        request.innerHTML = `${repoData.name}`;
        request.addEventListener('click', () => {
            this.createCard(repoData);
        })
        this.requestsBox.append(request);
    }

    createCard(repoData) {
        const card = this.createElement('div', 'card');
        card.innerHTML = `Name: ${repoData.name}
                          Owner: ${repoData.owner.login}
                          Stars: ${repoData.stargazers_count}`;
        const btnDelete = this.createElement('button', 'btnDelete');

        btnDelete.addEventListener('click', () => {
            card.remove();
        })
        card.append(btnDelete);
        this.main.prepend(card);
    }
}

const REPO_PER_PAGE = 5;

class Search {
    constructor(view) {
        this.view = view;
        this.view.searchInput.addEventListener('keyup', this.debounce(this.searchRepos.bind(this), 400));
    }

    async searchRepos() {
        const searchValue = this.view.searchInput.value;
        if (searchValue) {
            return await fetch(`https://api.github.com/search/repositories?q=${searchValue}&per_page=${REPO_PER_PAGE}`)
            .then(res => {
                if (res.ok) res.json().then(res => {
                    console.log(res);
                    this.clearRepos();
                    res.items.forEach(repo => this.view.createRepo(repo));
                    this.view.requestsBox.classList.add('active');
                })
            })
        } else {
            this.clearRepos();
            this.view.requestsBox.classList.remove('active');
        }
        
    }

    addRepoCard() {
        this.view.createCard();
    }

    clearRepos() {
        this.view.requestsBox.innerHTML = '';
    }

    debounce(fn, debounceTime) {
        let timeout;
        return function() {
          const fnCall = () => {fn.apply(this, arguments)}
    
          clearTimeout(timeout);
          timeout = setTimeout(fnCall, debounceTime);
        }
      };
}

new Search(new View());