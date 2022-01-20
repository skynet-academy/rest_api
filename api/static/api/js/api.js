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

let wrapper = document.getElementById('list-wrapper')

let updateItem = (item) =>{
    activeItem = item
    document.getElementById('title').value = activeItem.title
    url = `/api/task-update/${item.id}`
    fetch(url,{
        method: 'POST',
        headers: {'Content-type': 'application/json', 'X-CSRFToken': csrftoken,},
        body: JSON.stringify({'title':item.title, 'completed': item.completed}) 
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
    let completed = !item.completed
    url = `/api/task-update/${item.id}`
    fetch(url,{
        method: 'POST',
        headers: {'Content-type': 'application/json', 'X-CSRFToken': csrftoken},
        body: JSON.stringify({'title':item.title, 'completed': completed}) 
    })
    .then((response) =>{
        buildList()
    })
}

let addTask = (element) => {
    let div = document.createElement('div')
    let span = document.createElement('span')
    let buttonEdit = document.createElement('button')
    let buttonDelete = document.createElement('button')
    div.className = "data"
    
    span.className = "titleAdded"
    span.innerHTML = element.title
    element.completed ? span.style.textDecoration = "line-through": span.style.textDecoration = "none"
    span.addEventListener('click', function(){
        strikeUnstrike(element)
    })

    buttonEdit.className = "buttonEdit"
    buttonEdit.addEventListener('click', function(){
        updateItem(element) 
    })

    buttonEdit.type = "button"
    buttonEdit.innerHTML = "E"

    buttonDelete.className = "buttonDelete"
    buttonDelete.type = "button"
    buttonDelete.innerHTML = "x"
    buttonDelete.addEventListener('click', function(){
        deleteItem(element)       
    })

    div.appendChild(span)
    div.appendChild(buttonEdit)
    div.appendChild(buttonDelete)

    wrapper.appendChild(div)
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
            wrapper.innerHTML = "";
            [...data].forEach((element) =>{addTask(element)})
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
            buildList()
            document.getElementById('title').value = ''
        })
})


buildList()
