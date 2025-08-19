const inputTask = document.querySelector("#inputValue")
const listContainer = document.querySelector(".list-container")

let add = document.getElementById("addItem")
add.addEventListener("click", ()=>{
    if(inputTask.value == ''){
        alert("Enter a task!")
    }
    else{
        let listItem = document.createElement("li")
        listItem.innerHTML = `${inputTask.value} <span>&#10006;</span>`
        listContainer.appendChild(listItem)
        saveData()
        // Alternate way
        // let spanItem = document.createElement("span")
        // spanItem.innerHTML = "&#10006;"
        // listItem.appendChild(spanItem)
    }
    inputTask.value = ''
})

listContainer.addEventListener("click", (e)=>{
    if(e.target.tagName === "LI"){
        e.target.classList.toggle("checked")
        saveData()
    }
    else if(e.target.tagName === "SPAN"){
        e.target.parentElement.remove()
        saveData()
    }
})

function saveData(){
    localStorage.setItem("data", listContainer.innerHTML)
    // listContainer.innerHTML is stored in 'data'
}

function showData(){
    let data = localStorage.getItem("data")
    listContainer.innerHTML = data
}

showData()