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
let addTask = (element) => {
    let item = 
    `
    <div class="data">
        <span id="title">${element['title']}</span>
        <button class="buttonEdit" type="button">Edit</button>
        <button class="delete" type="button">-</button>
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
            [...data].forEach((element) =>{
                addTask(element)
            })
        })
}
buildList()

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
            document.getElementById('title').value = ''
        }
        )
})

