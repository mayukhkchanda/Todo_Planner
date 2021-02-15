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

                //li-item
                const todoli = document.createElement('li');
                todoli.classList.add('todo-sub-item');
                todoli.innerHTML = `<br>${subtask}<br>`;

                tododiv.appendChild(todoli);
            
                ancestor.appendChild(tododiv);

        }
    }

}

/*
console.log(addbutton);

if(addbutton){
    addbutton.addEventListener('click',addSubList);

    function addSubList(event){
        console.log('Hey!');
    }
}*/

