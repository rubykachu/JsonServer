function ResourceItem(name) {
  return `
    <li>
      <a href="${name}">${name}</a>
    </li>
  `
}

function ResourceList(resources) {
  return `
    <ul>
      ${resources.map((name) => ResourceItem(name)).join('')}
    </ul>
  `
}

function NoResources() {
  return `<p>No resources found</p>`
}

function ResourcesBlock({ db }) {
  return `
    <div>
      <h1>Resources</h1>
      ${Object.keys(db.resources).length ? ResourceList(db.resources) : NoResources()}
    </div>
  `
}

window
  .fetch('resources', {
    headers: {
      'Content-Type': 'application/json',
      'authorization': 'QLEAR 52ca917ee38aeefca00f88fefe'
    }
  })
  .then((response) => response.json())
  .then(
    (db) =>
      (document.getElementById('resources').innerHTML = ResourcesBlock({ db }))
  )
