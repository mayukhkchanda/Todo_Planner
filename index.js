const todoinput = document.querySelector(".todo-input");
const submitbutton = document.querySelector(".todo-button");
const ulelement = document.querySelector(".todo-list");

const addbutton = document.querySelector(".add-button");

//Event listeners
submitbutton.addEventListener('click',addToList);
ulelement.addEventListener('click',doRequired);

//functions
function addToList(event){

    //prevent form from submittion 
    event.preventDefault();

    if(todoinput.value){
        console.log(todoinput.value);
        
        //todo-div
        const todomaindiv = document.createElement('div');
        todomaindiv.classList.add('todo-main');

        const  tododiv = document.createElement('div');
        tododiv.classList.add('todo');

        //li-item
        const todoli = document.createElement('li');
        todoli.classList.add('todo-item');
        todoli.innerText = todoinput.value;
        tododiv.appendChild(todoli);

        //add sub-task plus icon
        const add = document.createElement('button');
        add.classList.add('add-button');
        add.innerHTML= '<i class="fas fa-plus-square"></i>';
        /*add.addEventListener('click', function () {
            console.log('Hey! '+todoinput.value);

            ///implement to add sub list
        } );*/
        tododiv.appendChild(add);

        //check button
        const checked = document.createElement('button');
        checked.classList.add('checked-button');
        checked.innerHTML = '<i class="fas fa-check-square"></i>';
        tododiv.appendChild(checked)

        //trash button
        const trash = document.createElement('button');
        trash.classList.add('trash-button');
        trash.innerHTML = '<i class="fas fa-trash"></i>';
        tododiv.appendChild(trash);

        todomaindiv.appendChild(tododiv);

        ulelement.appendChild(todomaindiv);
    }
    todoinput.value = "";
}

function doRequired(event){
    console.log(event.target.classList[0])
    const targetitem = event.target;

    if(targetitem.classList[0] === 'trash-button'){
        const ancestor = targetitem.parentElement.parentElement;
        ancestor.remove();
    }

    else if(targetitem.classList[0] === 'add-button'){
        let subtask =  window.prompt('Add sub task');
        if(subtask){
                console.log(subtask);
        
                const parent = targetitem.parentElement;

                console.log(parent.parentElement);

                const ancestor =  parent.parentElement;

                //const brk = document.createElement('br');
                //parent.appendChild(brk);

                //div item
                const tododiv = document.createElement('div');
                tododiv.classList.add('todo-sub');

                //image item
                const img = document.createElement('img');
                img.src = 'arrowholo.svg';
                tododiv.appendChild(img);

                //li-item
                const todoli = document.createElement('li');
                todoli.classList.add('todo-sub-item');
                todoli.innerHTML = `<br>${subtask}<br>`;
                tododiv.appendChild(todoli);

                //check button
                const checked = document.createElement('button');
                checked.classList.add('sub-checked-button');
                checked.innerHTML = '<i class="fas fa-check-square"></i>';
                tododiv.appendChild(checked)

                //trash button
                const trash = document.createElement('button');
                trash.classList.add('sub-trash-button');
                trash.innerHTML = '<i class="fas fa-trash"></i>';
                tododiv.appendChild(trash);

                ancestor.appendChild(tododiv);

        }
    }

    else if(targetitem.classList[0] === 'sub-trash-button'){
        console.log(targetitem.parentElement);
        targetitem.parentElement.remove();
    }  
    else if(targetitem.classList[0] === 'checked-button' ){
        const subtodo = targetitem.parentElement;
        subtodo.classList.toggle ('completed');

        if(subtodo.classList[1] === 'completed'){
            markAllSubToDoCompleted(subtodo.parentElement);
            const maintodo = subtodo.parentElement.childNodes[0];
            const buttons = maintodo.getElementsByTagName('button');
            //console.log(buttons);
            makeButtonDisabled(buttons);
        }
        else  {  
            markUncompleted(subtodo.parentElement);
            const maintodo = subtodo.parentElement.childNodes[0];
            const buttons = maintodo.getElementsByTagName('button');
            //console.log('this',buttons);
            makeButtonEnabled(buttons);
        }
    }

    else if( targetitem.classList[0] === 'sub-checked-button' ){
        const subtodo = targetitem.parentElement;
        subtodo.classList.toggle ('completed');

        let bool =  checkAllSubTodoDone(subtodo.parentElement);
        if(bool){
            console.log(subtodo.parentElement);
            const maintodo = subtodo.parentElement;
            maintodo.childNodes[0].classList.add('completed');
            makeButtonDisabled(maintodo.getElementsByTagName('button'));
        }else {
            const maintodo = subtodo.parentElement;
            maintodo.childNodes[0].classList.remove('completed');
            makeButtonEnabled(maintodo.getElementsByTagName('button'));
        }
    }

}

//make add button enabled
function makeButtonEnabled(buttons){
    for(let i=0;i<buttons.length;i++){
        if(buttons[i].classList[0] === 'add-button'){
            buttons[i].disabled = false;
            //console.log("fuck")
        }
    }
}

//make add button disable
function makeButtonDisabled(buttons){
    for(let i=0;i<buttons.length;i++){
        if(buttons[i].classList[0] === 'add-button'){
            buttons[i].disabled = true;
        }
    }
}

//mark the sub-todos uncompleted when main todo uncompleted
function markUncompleted(target){
    const childtodos = target.childNodes
    for(let i=1;i<childtodos.length;i++){
        //console.log("this->>>");
        //console.log(childtodos[i].classList[1]);
        if(childtodos[i].classList[1])
            childtodos[i].classList.remove('completed');
    }
}

//mark the sub-todos completed when main todo completed
function markAllSubToDoCompleted(target){
    const childtodos = target.childNodes
    for(let i=1;i<childtodos.length;i++){
        //console.log("this->>>");
        //console.log(childtodos[i].classList[1]);
        //if(!childtodos[i].classList[1])
            childtodos[i].classList.add('completed');
    }
}

//delegates the call to checkCompleted
function checkAllSubTodoDone(target){
    console.log(target);
    //get all the children of todo-main div
    const childtodos = target.childNodes

    //check if all the sub-todo's are checked
    if(checkCompleted(childtodos)){
        console.log('all completed');
        return true;
    }else{
        console.log('still remaining');
        return false;
    }
}

//check if sub-todos are completed
function checkCompleted(childtodos){
    let bool = false;
    for(let i=1;i<childtodos.length;i++){
        /*if(!childtodos[i].classList[0] === 'completed'){
            bool =  false;
        }*/
        //console.log("this->>>");
        //console.log(childtodos[i].classList[1]);
        if(!childtodos[i].classList[1] ){
            return false;
        }
    }
    //if()
    return true;
}

/*
console.log(addbutton);

if(addbutton){
    addbutton.addEventListener('click',addSubList);

    function addSubList(event){
        console.log('Hey!');
    }
}*/

