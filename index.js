
//jquery+vanila JS

$(function(){

//DOM input feilds and buttons
const todoinput = document.querySelector(".todo-input");
const submitbutton = document.querySelector(".todo-button");
const ulelement = document.querySelector(".todo-list");
const calendar = document.querySelector('#datepicker');
const calendarBtn = document.querySelector('.todo-calendar');
const addbutton = document.querySelector(".add-button");


//sub-todo's feilds
const subtododiv = document.querySelector('div[class^="bl-box"]');
const subtodoinput = document.querySelector('.bl-prompt');
var subtodookbtn = document.querySelector('.bl-footer>button:first-child');
const subtodocancelbtn = document.querySelector('.bl-footer>button:last-child');

//Event listeners
submitbutton.addEventListener('click',addToList);
ulelement.addEventListener('click',doRequired);

//initializing the datepicker
$(calendar).datepicker({minDate:0});

$(calendarBtn).click(function(){
    $(calendar).stop().focus();
});

$(todoinput).focus(addBoxShadow);
$(todoinput).blur(removeBoxShadow);

$(calendar).focus(addBoxShadow);
$(calendar).blur(removeBoxShadow);

//adding box shadow
function addBoxShadow(event) {

    $(event.target).removeClass('todo-input-empty');

    $(event.target).css({
        'box-shadow':'0 0 2.5px 0.5px #999 inset'
    });
}

//removing box shadow
function removeBoxShadow(event) {

    /* $(event.target).removeClass('todo-input-empty'); */

    $(event.target).css({
        'box-shadow':'none'
    });
}

//removing box shadow when clicked somewhere else
$('html').click(function(event){
     
    $(todoinput).removeClass('todo-input-empty');
    $(calendar).removeClass('todo-input-empty');
    
});


//functions
function addToList(event){

    //prevent bubbling up of event
    event.stopPropagation();

    //prevent form from submittion 
    event.preventDefault();

    if(todoinput.value && calendar.value){
        console.log(todoinput.value+' '+calendar.value);
    
        const todomaindiv = getMainTodoDiv();

        ulelement.appendChild(todomaindiv);

        //reseting the value of input and calendar
        //only if both have value
        todoinput.value = "";
        calendar.value = "";
    }
    else{
        
        if(!todoinput.value){
            $(todoinput).addClass('todo-input-empty');
        }

        if(!calendar.value){
            $(calendar).addClass('todo-input-empty');
        }
        
    }
}



//do execute the required code
//for handling the subtodo
function doRequired(event){
    //event.preventDefault();

    console.log(event.target.classList[0]);

    var targetitem = event.target;

    console.log('received V');
    console.log(targetitem);

    if(targetitem.classList[0] === 'trash-button'){
        const ancestor = targetitem.parentElement.parentElement;
        ancestor.remove();
    }

    else if(targetitem.classList[0] === 'add-button'){

        subtodookbtn = document.querySelector('.bl-footer>button:first-child');

        //var subtask = window.prompt("Add new sub-todo?");

        $(subtododiv).toggleClass('bl-hidden');

        //$(subtodoinput).focus();

        const willAddTo = event.target;
        console.log(event.target);

        var subtask = $(subtodoinput).val();
        //OK button
        subtodookbtn.addEventListener( 'click', function fucker(event){
            event.preventDefault();
            var subtask = $(subtodoinput).val(); 
        
        //Input present in the sub-todo div's input
        if(subtask){

            $(subtododiv).toggleClass('bl-hidden');

            console.log(subtask);
            
            const parent = targetitem.parentElement;

            console.log('willAddTo');
            console.log(willAddTo);
    
            const ancestor =  parent.parentElement;
    
            var tododiv = getSubTodoDiv(subtask);
    
            ancestor.appendChild(tododiv);
            
            subtodoinput.value = '';

            subtodookbtn.removeEventListener('click',fucker);
        }
           
        //No input in the pop-up div 
        else{               
            $(subtodoinput).addClass('bl-empty');
        }

       }  );

        
    } 

    else if(targetitem.classList[0] === 'sub-trash-button'){
       // console.log(targetitem.parentElement);
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

$(subtodoinput).focus(function(){
    $(this).removeClass('bl-empty');
});

$(subtodoinput).blur(function(){
    $(this).removeClass('bl-empty');
});


//cancel button
$(subtodocancelbtn).click(function(){
    $(subtododiv).toggleClass('bl-hidden');
    $(subtodoinput).removeClass('bl-empty');
    $(subtodoinput).val('');  
    
    //subtodookbtn.removeEventListener('click',fucker);
    //$(subtodookbtn).off('click');


    //work around to remove the event listener
    //else it will keep adding to the already registered eventListener
    var clone = $(subtodookbtn).clone();

    $(subtodookbtn).replaceWith(clone);

    //$(subtodocancelbtn).before(clone);
});




//get the main todo div
function getMainTodoDiv(){
    //todo-div
    const todomaindiv = document.createElement('div');
    todomaindiv.classList.add('todo-main');

    const  tododiv = document.createElement('div');
    tododiv.classList.add('todo');

    //li-item
    const todoli = document.createElement('li');
    todoli.classList.add('todo-item');
    todoli.innerText = todoinput.value.trim()+': '+calendar.value;
    tododiv.appendChild(todoli);

    //add sub-task plus icon
    const add = document.createElement('button');
    add.classList.add('add-button');
    add.innerHTML= '<i class="fas fa-plus-square"></i>';
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
    
    return todomaindiv;
}


//create a subtodo div
function getSubTodoDiv( subtask){
    
        const tododiv = document.createElement('div');
        tododiv.classList.add('todo-sub');

        //image item
        const img = document.createElement('img');
        img.src = 'arrowholo.svg';
        tododiv.appendChild(img);

        //li-item
        const todoli = document.createElement('li');
        todoli.classList.add('todo-sub-item');
        todoli.innerHTML = `<br>${subtask.trim()}<br>`;
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

        return tododiv;
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
    //console.log(target);
    //get all the children of todo-main div
    const childtodos = target.childNodes

    //check if all the sub-todo's are checked
    if(checkCompleted(childtodos)){
       // console.log('all completed');
        return true;
    }else{
        //console.log('still remaining');
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

})