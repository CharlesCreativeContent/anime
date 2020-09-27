let button = document.querySelector('button')
let list = document.querySelector('ol')
let search =document.querySelector("[type='search']")
let proxy = "https://cors-anywhere.herokuapp.com/"

//===========Fetch used to fill database===========//
// button.addEventListener('click',e=>{
//   list.innerHTML = ''
//   fetch(proxy+"https://jikan1.p.rapidapi.com/search/anime?q="+search.value.replace(/[ ]/g,'%20'), {
// 	"method": "GET",
// 	"headers": {
// 		"x-rapidapi-host": "jikan1.p.rapidapi.com",
// 		"x-rapidapi-key": "3ae1d00c97msh298612aebb81230p11684djsn405007844583"
// 	}
// })
// .then(response => response.json()).then(data=>{
//   console.log(data)
//   data.results.forEach(x=>{
//     let listItem = document.createElement('li')
//     //========Listener to add Collection Items=======//
//     // listItem.addEventListener('click', addVideoToCollection)
//     let link = document.createElement('a')
//     link.target = '_blank'
//     link.href = x.url
//     let title = document.createElement('h2')
//     let titleContent = document.createTextNode(`${x.title}`)
//     title.appendChild(titleContent)
//     link.appendChild(title)
//     listItem.appendChild(link)
//     let image = document.createElement('img')
//     image.src = x.image_url
//     listItem.appendChild(image)
//     let synopsis =document.createElement('p')
//     let synText = document.createTextNode(`${x.synopsis}`)
//     synopsis.appendChild(synText)
//     listItem.appendChild(synopsis)
//     list.appendChild(listItem)
//   })
//
// })
// .catch(err => {
// 	console.log(err);
// });
// })

//function I use to strip API data//
// let addVideoToCollection=e=>{
//   let name = e.target.parentElement.children[0].children[0].innerHTML
//   let listItem = e.target.parentElement.innerHTML
//
    // fetch('/collectAnime', {
    //   method: 'put',
    //   headers: {
    //     'Content-Type': 'application/json'
    //   },
    //   body: JSON.stringify({
    //     'name': name,
    //     'listItem': listItem,
    //   })
    // })
// }

let collectionList = document.querySelectorAll('li')
console.log(collectionList[0].innerText)
collectionList.forEach(x=>{
  let text = x.innerText
  x.innerText = ''
  x.innerHTML = text
})
let addToFavs = e=>{
let child = e.target.parentElement
let parent = e.target.parentElement.parentElement
  fetch('/collectFavs', {
    method: 'put',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      'favs': `${child.outerHTML}`,
    })
  })
  console.log(child)
  parent.removeChild(child)
}
document.querySelectorAll('img').forEach(x=>x.addEventListener('click',addToFavs))
