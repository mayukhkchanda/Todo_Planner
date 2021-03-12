
//jquery+vanila JS

$(function(){

//DOM input feilds and buttons
const todoinput = document.querySelector(".todo-input");
const submitbutton = document.querySelector(".todo-button");
const ulelement = document.querySelector(".todo-list");
const calendar = document.querySelector('#datepicker');
const calendarBtn = document.querySelector('.todo-calendar');
const addbutton = document.querySelector(".add-button");
const selectBtn = document.querySelector("#select-dropdown-button");
const selectFeild = document.querySelector(".select-filter");


//sub-todo's feilds
const subtododiv = document.querySelector('div[class^="bl-box"]');
const subtodoinput = document.querySelector('.bl-prompt');
var subtodookbtn = document.querySelector('.bl-footer>button:first-child');
const subtodocancelbtn = document.querySelector('.bl-footer>button:last-child');

//Event listeners
submitbutton.addEventListener('click',addToList);
ulelement.addEventListener('click',doRequired);
document.addEventListener("DOMContentLoaded", getTodosFromSessionStorage());
/* selectFeild.addEventListener('change',applyFilter); */
$(selectFeild).change(applyFilter);

//initializing the datepicker
$(calendar).datepicker({minDate:0});

//opening the date picker on calendar button click
$(calendarBtn).click(function(){
    $(calendar).stop().focus();
});

$(todoinput).focus(addBoxShadow);
$(todoinput).blur(removeBoxShadow);

$(calendar).focus(addBoxShadow);
$(calendar).blur(removeBoxShadow);


$(subtodoinput).focus(function(){
    $(this).removeClass('bl-empty');
});

$(subtodoinput).blur(function(){
    $(this).removeClass('bl-empty');
});

$(selectFeild).click(function() {
    
    /* console.log(selectFeild); */

    $(this).toggleClass('select-filter-shadow');
});

/* $(selectFeild).focus(function(){
    selectFeild.classList.add('select-filter-shadow')
});
*/
$(selectFeild).blur(function(){
    selectFeild.classList.remove('select-filter-shadow')
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


//adding box shadow
function addBoxShadow(event) {

    $(event.target).removeClass('todo-input-empty');

    $(event.target).css({
        'box-shadow':'0 0 5px 1px #555' 
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

//Apply the select filter
function applyFilter(){
    var selectValue = event.target.value;
    /* console.log(selectValue); */
    /* console.log($(ulelement).children());  */

    var childTodos = ulelement.childNodes;
    /* console.log(childTodos); */

    childTodos.forEach( (c)=>{
            /*console.log(c/* .childNodes[0] );*/
            var child = c.childNodes[0];
            
            switch(selectValue){
                case "all":         
                        showTodo(c);
                        break;
                case "completed":   
                        if(child.classList[1] === 'completed'){
                            showTodo(c);;
                        }else{
                            hideTodo(c);
                        }
                        break;
                case "uncompleted": 
                        if(!(child.classList[1] === 'completed')){
                            showTodo(c);
                        }else{
                            hideTodo(c);
                        }
                        break;
                default: ;
                    break;
            }
        }
     );
}

//show the div received
function showTodo(todo){
    /* console.log('Show ->');
    console.log(todo); */
    $(todo).show();
}

//hide the div received
function hideTodo(todo){
    /* console.log('hide ->');
    console.log(todo); */
    $(todo).hide();
}

//add new todo to the Un-ordered list element
function addToList(event){

    //prevent bubbling up of event
    event.stopPropagation();

    //prevent form from submittion 
    event.preventDefault();

    if(todoinput.value && calendar.value){
        console.log(todoinput.value+' '+calendar.value);
    
        const todomaindiv = getMainTodoDiv();

        //fading hiding the todo main div
        $(todomaindiv).hide();

        ulelement.appendChild(todomaindiv);

        //fading the new todo main div into view
        $(todomaindiv).fadeIn(400);

        addMainTodoToSessionStorage();

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

    /* console.log(event.target.classList[0]); */

    var targetitem = event.target;

    /* console.log('received V');
    console.log(targetitem); */

    if(targetitem.classList[0] === 'trash-button'){
        const ancestor = targetitem.parentElement.parentElement;
        deleteMainTodo(ancestor);
    }

    else if(targetitem.classList[0] === 'add-button'){

        subtodookbtn = document.querySelector('.bl-footer>button:first-child');

        //var subtask = window.prompt("Add new sub-todo?");

        //making the subtodo input taking div appear
        $(subtododiv).toggleClass('bl-hidden');
        
        $(subtodoinput).focus();

        //$(subtodoinput).focus();

        /* const willAddTo = event.target;
        console.log(event.target); */

        /* var subtask = $(subtodoinput).val(); */
        //OK button
        subtodookbtn.addEventListener( 'click', function fucker(event){
            event.preventDefault();
            var subtask = $(subtodoinput).val(); 
        
            //Input present in the sub-todo div's input
            if(subtask){
                
                //make the input taking div disappear
                $(subtododiv).toggleClass('bl-hidden');

                /* console.log(subtask); */
                
                const parent = targetitem.parentElement;

                /* console.log('willAddTo');
                console.log(willAddTo); */
        
                const ancestor =  parent.parentElement;
        
                var tododiv = getSubTodoDiv(subtask);
                
                ancestor.appendChild(tododiv);
                
                addSubTodoToSessionStorage(ancestor,subtask);

                subtodoinput.value = '';

                subtodookbtn.removeEventListener('click',fucker);
            }
            
            //No input in the pop-up div 
            else{               
                $(subtodoinput).addClass('bl-empty');
            }

       } );

    } 

    else if(targetitem.classList[0] === 'sub-trash-button'){
       // console.log(targetitem.parentElement);
        //targetitem.parentElement.remove();
        
        deleteSubTodo(targetitem.parentElement);

       /*  let todoMainDiv = targetitem.parentElement.parentElement;
        let isTrue =  checkAllSubTodoDone(todoMainDiv);
        if(isTrue){
            console.log('YeS!');
        }else{
            console.log('Get outta here!!');
        } */
    } 

    else if(targetitem.classList[0] === 'checked-button' ){
        const subtodo = targetitem.parentElement;
        subtodo.classList.toggle ('completed');

        /* console.log(subtodo); */        

        if(subtodo.classList[1] === 'completed'){
            markAllSubToDoCompleted(subtodo.parentElement);
            const maintodo = subtodo.parentElement.childNodes[0];
            const buttons = maintodo.getElementsByTagName('button');
            //console.log(buttons);
            makeButtonDisabled(buttons);

            //set checked status as true in session storage
            setCheckStatusInSessionStorage(subtodo,'true');
        }
        else  {  
            markUncompleted(subtodo.parentElement);
            const maintodo = subtodo.parentElement.childNodes[0];
            const buttons = maintodo.getElementsByTagName('button');
            //console.log('this',buttons);
            makeButtonEnabled(buttons);

            //set checked status as true in session storage
            setCheckStatusInSessionStorage(subtodo,'false');
        }
    }

    else if( targetitem.classList[0] === 'sub-checked-button' ){
        const subtodo = targetitem.parentElement;
        subtodo.classList.toggle ('completed');

        const _todoMainDiv_ = subtodo.parentElement.childNodes[0];

        setSubTodoStatus(subtodo.innerText, _todoMainDiv_.innerText, subtodo.classList[1]);

        let bool =  checkAllSubTodoDone(subtodo.parentElement);
        if(bool){
            console.log(subtodo.parentElement);
            const maintodo = subtodo.parentElement;
            maintodo.childNodes[0].classList.add('completed');
            makeButtonDisabled(maintodo.getElementsByTagName('button'));

            setCheckStatusInSessionStorage( _todoMainDiv_, 'true' );

        }else {
            const maintodo = subtodo.parentElement;
            maintodo.childNodes[0].classList.remove('completed');
            makeButtonEnabled(maintodo.getElementsByTagName('button'));

            setCheckStatusInSessionStorage( _todoMainDiv_, 'false' );

        }
    }

    else if(targetitem.classList[0] === 'dropdown-button'){

        const ancestor = targetitem.parentElement.parentElement;

        /* console.log(targetitem); */
        //targetitem is the button and child is the icon
        const childIcon = $(targetitem).children();
       /*  console.log(childIcon); */
       
       //rotate the icon - deprecated. Rotate only when child elements present
      /*  $(childIcon).toggleClass('dropdown-button-rotate'); */

      /* rotateChildIcon(childIcon[0]); */

      toggleShowSubTodos(ancestor,childIcon);

    }

}

//set the main todo checked status in session storage
function setCheckStatusInSessionStorage(todoToBeMarked, status) {
    let __todos__ = checkSessionStorage();

    let todoText = todoToBeMarked.innerText.split(":")[0].trim(); 
    let todoDueDate = todoToBeMarked.innerText.split(":")[1].trim(); 

    for(let i=0;i<__todos__.length;i++){
        //console.log(arr[i].todo);
    
        if((__todos__[i].todo === todoText) && (__todos__[i].dueDate === todoDueDate)){
           
           /* console.log(__todos__[i]); */

           __todos__[i].checked = status;
            break;
        }
    }

    /* sessionStorage.setItem( 'allTodo', JSON.stringify(__todos__) ); */
    setSessionStorage(__todos__);
}

//set the sub todo checked status in the session storage
function setSubTodoStatus(sub,main,status){
    let __todos__ = checkSessionStorage();

    sub = sub.split('\n')[1];

    console.log(sub+" "+main+" "+status);

    let __todo__    = main.split(':')[0].trim();
    let __deudate__ = main.split(':')[1].trim();

    for(let i=0;i<__todos__.length;i++){
        //console.log(arr[i].todo);
        
        //get the matching todo 
        if((__todos__[i].todo === __todo__) && (__todos__[i].dueDate === __deudate__)){
           
           /* console.log(__todos__[i].todo); */

            let __subTodo__ = __todos__[i].subTodos;

            for(let j=0;j<__subTodo__.length;j++){

                //get the sub todo whose status to be updated
                if(__subTodo__[j]._subTodo === sub ){
                    __subTodo__[j]._checked = status ? 'true' : 'false';
                }

            }
            break;
        }
    }

    setSessionStorage(__todos__);
}

//set todos back to session storage
function setSessionStorage(__ToDos__) {
    sessionStorage.setItem( 'allTodo', JSON.stringify(__ToDos__) );
}

//check if todo already there in session storage
function checkSessionStorage() {
    let _todos_ ;
    if( sessionStorage.getItem('allTodo') === null ){
        _todos_ = [];
    }
    else {
        _todos_ = JSON.parse( sessionStorage.getItem('allTodo') );
    }
    return _todos_;
}

//adding todos to session storage 
function addMainTodoToSessionStorage() {
    let _TODO_ = checkSessionStorage() ;

    let _mainTodo = {
        'todo'    : todoinput.value,
        'dueDate' : calendar.value,
        'checked' : 'false',
        'subTodos': [] 
    }; 
    
    /* if( sessionStorage.getItem('allTodo') === null ){
        _TODO_ = [];
    }
    else {
        _TODO_ = JSON.parse( sessionStorage.getItem('allTodo') );
    } */


    _TODO_.push(_mainTodo);

    /* sessionStorage.setItem('allTodo',JSON.stringify(_TODO_)); */
    setSessionStorage(_TODO_);

}

//getting todos from session storage
//also appending to the ul element
function getTodosFromSessionStorage() {
    let _TODO_ = checkSessionStorage();

    //console.log(_TODO_);

    _TODO_.forEach( (t) =>{ 

        let _mainTodoDiv = getMainTodoDivFromSessionStorage(t.todo,t.dueDate);

        //marking the todo as checked; if checked is set true
        if(t.checked === 'true'){
            _mainTodoDiv.childNodes[0].classList.add('completed');

            //if the main todo was checked then make its button disabled
            const buttons = _mainTodoDiv.getElementsByTagName('button');
            makeButtonDisabled(buttons);
        }

        //add subtodos to the main div; *if any*
        if(t.subTodos.length > 0){
            let _subTodos_ = t.subTodos;

            //for each of the sub-todos; create a sub-todo div and append it to 
            //as a child of  main todo
            _subTodos_.forEach( ( s )=> {
                    //s is an object; _subTodo = todo & _checked = status
                    //getting the sub-todo div element
                    let _subTodoDiv_ = getSubTodoDiv(s._subTodo);

                    //if sub-todo was checked earlier; then check it
                    if(s._checked === 'true') {
                        _subTodoDiv_.classList.add('completed');
                    }

                    //append child
                    _mainTodoDiv.appendChild(_subTodoDiv_);
             } );

        }
        
        //fading hiding the todo main div
        $(_mainTodoDiv).hide();

        //appending the todo-main div to the ul element 
        ulelement.appendChild(_mainTodoDiv);

        //fading the new todo main div into view
        $(_mainTodoDiv).fadeIn(400);
    } );
}

//adding the sub todo of a main todo to session storage
function addSubTodoToSessionStorage(_ancestor_, _subTask_) {
    let __todoText__ = _ancestor_.childNodes[0].innerText;
    //console.log(__todoText__);  

    let __todo__ = __todoText__.split(":")[0].trim();
    let __deudate__ = __todoText__.split(":")[1].trim();

    /* console.log(__todo__+" "+__deudate__);   */

    //saving the status of the sub todo
    let subTodoObj =  { '_subTodo': _subTask_, '_checked':'false' };
    let __TODOS__ = checkSessionStorage();

    for(let i=0;i<__TODOS__.length;i++){
        //console.log(arr[i].todo);
    
        if((__TODOS__[i].todo === __todo__) && (__TODOS__[i].dueDate === __deudate__)){
           
           /* console.log(__TODOS__[i].todo); */

           __TODOS__[i].subTodos.push(subTodoObj);
            break;
        }
    }

    /* sessionStorage.setItem('allTodo',JSON.stringify(__TODOS__)); */
    setSessionStorage(__TODOS__);
}

//rotate child icon
function rotateChildIcon(childIcon){
    /* console.log(childIcon); */
    if(childIcon.classList[2] == 'dropdown-button-rotate-down'){
        childIcon.classList.remove('dropdown-button-rotate-down');
        childIcon.classList.add('dropdown-button-rotate-up');
    }else{
        childIcon.classList.remove('dropdown-button-rotate-up');
        childIcon.classList.add('dropdown-button-rotate-down');
    }
}

//toggle slide the sub todos
function toggleShowSubTodos(ancestor,childIcon) {
   /*  console.log(ancestor); */
    var childrens = $(ancestor).children().not('.todo');

    if(childrens.length){

        rotateChildIcon(childIcon[0]);
        $(childrens).slideToggle(600,'linear');
    
    }
}

//delete sub todo- sub-todo trash button clicked
function deleteSubTodo(element) {

    $(element).fadeOut(400, function(){

        //get the main todo element 
        let todoMainDiv = element.parentElement;

        //remove the sub-todo element
        element.remove();
            
            //check if the remaining sub-todo elements are completed or not
            let isTrue =  checkAllSubTodoDone(todoMainDiv);
            if(isTrue){
                /* console.log('YeS!'); */
                markMainTodoCompleteIfNot(todoMainDiv);

                makeButtonDisabled(todoMainDiv.childNodes[0].getElementsByTagName('button'));
            }else{
                /* console.log('Get outta here!!'); */
            }
    });
}

//mark the main todo complete if not already completed
function markMainTodoCompleteIfNot(element) {
    let mainTodoDiv = element.childNodes[0];
    if(!(mainTodoDiv.classList[1] === 'completed')){
        mainTodoDiv.classList.add('completed');
    }
}

//delete the div- todo-main trash button clicked
function deleteMainTodo( ancestor){

    var childrens = $(ancestor).children().not('.todo');

    //console.log(childrens);

    if(childrens.length){
        /* console.log('before slide up'); */
        /* $(ancestor).children().not('.todo') */
        $(childrens).slideUp(300,'linear',
                function(){
                    $(ancestor).fadeOut(400, function(){
                        ancestor.remove();
                    });
                }        
        );
        
    }else{
    
        /* console.log('before fade out'); */
        $(ancestor).fadeOut(400, function(){

            /* console.log('before remove'); */
            ancestor.remove();
        }); 
        
    }
}

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

    //add dropdown button
    const dropdownBtn = document.createElement('button');
    dropdownBtn.classList.add('dropdown-button');
    dropdownBtn.innerHTML = '<i class="fas fa-caret-down dropdown-button-rotate-down"></i>';
    tododiv.appendChild(dropdownBtn);

    //trash button
    const trash = document.createElement('button');
    trash.classList.add('trash-button');
    trash.innerHTML = '<i class="fas fa-trash"></i>';
    tododiv.appendChild(trash);

    todomaindiv.appendChild(tododiv);
    
    return todomaindiv;
}

//create and return the main todo div; JS does not support function overloading
function getMainTodoDivFromSessionStorage(todoValue,calendarValue){
    //todo-div
    const todomaindiv = document.createElement('div');
    todomaindiv.classList.add('todo-main');

    const  tododiv = document.createElement('div');
    tododiv.classList.add('todo');

    //li-item
    const todoli = document.createElement('li');
    todoli.classList.add('todo-item');
    todoli.innerText = todoValue.trim()+': '+calendarValue;
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

    //add dropdown button
    const dropdownBtn = document.createElement('button');
    dropdownBtn.classList.add('dropdown-button');
    dropdownBtn.innerHTML = '<i class="fas fa-caret-down dropdown-button-rotate-down"></i>';
    tododiv.appendChild(dropdownBtn);

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
        if(childtodos[i].classList[1]){
            childtodos[i].classList.remove('completed');
            setSubTodoStatus( childtodos[i].innerText,childtodos[0].innerText,'');
        }

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

            console.log('marking all-'+childtodos[i].innerText+'-'+childtodos[0].innerText);

            setSubTodoStatus( '\n'+childtodos[i].innerText+'\n',childtodos[0].innerText,'completed');
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