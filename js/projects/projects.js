async function getProjects() {
    const repos = await getJson('https://api.github.com/users/sharmisha9/repos');
    const filter = await getJson('js/projects/filter.json');
    const result = await filterRepos(repos, filter);
    return result;
}

async function getJson(url) {
    const response = await fetch(url);
    return response.json();
}

async function filterRepos(reposJson, filterJson) {
    var reposFiltered = [];
    let newRepos = reposJson.filter(function (repo) {
        return filterJson.find(repoFilter => repoFilter.repo === repo.name) !== undefined;
    });

    for (let i = 0; i < newRepos.length; i++) {
        languages = await getJson(newRepos[i].languages_url);
        filterRepoData = filterJson.find(repoFilter => repoFilter.repo == newRepos[i].name)
        let allLanguages = Object.keys(languages);
        allLanguages = allLanguages.filter(lang => ['HTML', 'CSS', 'JavaScript', 'Python'].includes(lang))

        reposFiltered.push({
            "title": filterRepoData.title,
            "name": filterRepoData.repo,
            "description": newRepos[i].description,
            "url": newRepos[i].html_url,
            "languages": allLanguages,
            "logo": filterRepoData.logo

        });
    };
    return reposFiltered;
}