let wrapper = document.getElementById('list-wrapper')

function getCookie(name){
    let cookieValue = null;
    if (document.cookie && document.cookie !== ''){
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?  
            if (cookie.substring(0, name.length + 1) === (name + '='))
            { 
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1)); 
                break; 
            }
        }
    }
    return cookieValue;
}

const csrftoken = getCookie('csrftoken');
//////////////////////

let updateItem = (item) =>{
    activeItem = item
    document.getElementById('title').value = activeItem.title
    url = `/api/task-update/${item.id}/`
    fetch(url,{
        method: 'POST',
        headers: {'Content-type': 'application/json', 'X-CSRFToken': csrftoken,},
        body: JSON.stringify({'title':title, 'completed': item.completed}) 
    })
    .then((response) =>{
        buildList()
    })
}

let deleteItem = (item) =>{
    url = `/api/task-delete/${item.id}`
    fetch(url, {
        method: 'DELETE',
        headers: {'Content-type':'application/json', 'X-CSRFToken': csrftoken}
    })
    .then((response) =>{
        buildList()
    })
}

let strikeUnstrike = (item) =>{
    item.completed = !item.completed
    url = `/api/task-update/${item.id}/`
    fetch(url,{
        method: 'POST',
        headers: {'Content-type': 'application/json', 'X-CSRFToken': csrftoken,},
        body: JSON.stringify({'title':title, 'completed': item.completed}) 
    })
    .then((response) =>{
        buildList()
    })
}

let addTask = (element) => {
    let item = 
    `
    <div class="data">
        <span class="titleAdded">${element['title']}</span>
        <button class="buttonEdit" type="button">Edit</button>
        <button class="buttonDelete" type="button">-</button>
    </div>
    `
    wrapper.innerHTML += item
}

let buildList = () =>{
    let url = '/api/task-list/'
    fetch(url,
        {
            method: 'GET',
            headers: {'content-type': 'application/json', 'X-CSRFToken': csrftoken},
        })
        .then((response) => response.json())
        .then(function(data){
            [...data].forEach((element) =>{addTask(element)})
            let myList = document.getElementsByClassName('data');
            [...myList].forEach((a) =>{
                a.children[0].addEventListener('click', function(){ console.log('titleAdded')})
                a.children[1].addEventListener('click', function(){ console.log('buttonEdit')})
                a.children[2].addEventListener('click', function(){ console.log('buttonDelete')})
            })
            console.log('working')
        })
}

let form = document.getElementById('form')
form.addEventListener('submit', function(e){
        e.preventDefault()
        let url = '/api/task-create/'
        let title = document.getElementById('title').value
        addTask({'title':title})
        fetch(url,{
            method: "POST",
            headers: {"Content-type": "application/json"},
            body: JSON.stringify({'title':title})
        }
        ).then((response)=>{
            document.getElementById('list-wrapper').innerHTML = ""
            buildList()
            document.getElementById('title').value = ''
        })
})


buildList()
