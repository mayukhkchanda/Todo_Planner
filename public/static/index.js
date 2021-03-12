
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
document.addEventListener("DOMContentLoaded", getTodosFromLocalStorage());

//listen for select value change
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

//add shadow to input feild on focus
$(subtodoinput).focus(function(){
    $(this).removeClass('bl-empty');
});

//remove shadow from input feild on blur
$(subtodoinput).blur(function(){
    $(this).removeClass('bl-empty');
});

//add shadow to select feild on focus
$(selectFeild).click(function() {
    
    $(this).toggleClass('select-filter-shadow');
});

//remove shadow from select feild on blur
$(selectFeild).blur(function(){
    selectFeild.classList.remove('select-filter-shadow')
}); 

//cancel button
$(subtodocancelbtn).click(function(){
    $(subtododiv).toggleClass('bl-hidden');
    $(subtodoinput).removeClass('bl-empty');
    $(subtodoinput).val('');  
    
    //work around to remove the event listener
    //else it will keep adding to the already registered eventListener
    var clone = $(subtodookbtn).clone();
    $(subtodookbtn).replaceWith(clone);

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

    //get all the todo-main divs
    var childTodos = ulelement.childNodes;

    //iterate through each of them to select the appropriate todo
    childTodos.forEach( (c)=>{
           
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
    $(todo).show();
}

//hide the div received
function hideTodo(todo){

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

        addMainTodoToLocalStorage();

        //reseting the value of input and calendar
        //only if both have value
        todoinput.value = "";
        calendar.value = "";
    }
    else{
        
        //adding red box shadow incase of empty input
        if(!todoinput.value){
            $(todoinput).addClass('todo-input-empty');
        }

        //adding red box shadow incase of empty input
        if(!calendar.value){
            $(calendar).addClass('todo-input-empty');
        }
        
    }
}

//do execute the required code
//for handling the subtodo
function doRequired(event){
    //event.preventDefault();

    //targertitem is the button on which user clicks
    var targetitem = event.target;

    //if the trash button of todo-class div is clicked
    if(targetitem.classList[0] === 'trash-button'){
        const ancestor = targetitem.parentElement.parentElement;

        //delete from the local storage; targetitem is the button; its parent is the 'todo' div
        deleteMainTodoFromLocalStorage(targetitem.parentElement.innerText);

        //delete the main todo
        deleteMainTodo(ancestor);
    }

    //if the add button of todo-class div is clicked
    else if(targetitem.classList[0] === 'add-button'){

        subtodookbtn = document.querySelector('.bl-footer>button:first-child');

        //used prompt initially for taking input
        //var subtask = window.prompt("Add new sub-todo?");

        //making the subtodo input taking div appear/disappear
        $(subtododiv).toggleClass('bl-hidden');
        
        //setting the focus to input of prompt initially
        $(subtodoinput).focus();

        //OK button
        subtodookbtn.addEventListener( 'click', function fucker(event){
            event.preventDefault();
            var subtask = $(subtodoinput).val(); 
        
            //Input present in the sub-todo div's input
            if(subtask){
                
                //make the input taking div disappear
                $(subtododiv).toggleClass('bl-hidden');
                
                const parent = targetitem.parentElement;
                  
                const ancestor =  parent.parentElement;
                
                //get the sub todo to be added from the function
                var tododiv = getSubTodoDiv(subtask);
                
                ancestor.appendChild(tododiv);
                
                addSubTodoToSessionStorage(ancestor,subtask);

                subtodoinput.value = '';

                let dropDownIconState = checkStateOfDropDownIcon(ancestor.childNodes[0]);
                
                //if the sub-todo class divs are slide up, then 
                //slide the newly addes sub-todo after 1 sec
                if(dropDownIconState === 'up') {
                    $(tododiv).delay(1000).slideUp(500);
                }

                //remove the event listener that is registered to the ok
                subtodookbtn.removeEventListener('click',fucker);
            }
            
            //No input in the pop-up div 
            else{               
                $(subtodoinput).addClass('bl-empty');
            }

       } );

    } 

    //if user clicks on the sub-trash button of the sub-todo div
    else if(targetitem.classList[0] === 'sub-trash-button'){
       
        let __mainToDoDiv__ = targetitem.parentElement.parentElement.childNodes[0];

        //delete the sub-todo from session storage
        deleteSubTodoFromLocalStorage(targetitem.parentElement.innerText,__mainToDoDiv__.innerText);

        //fade and remove the sub-todo
        deleteSubTodo(targetitem.parentElement);

    } 

    else if(targetitem.classList[0] === 'checked-button' ){
        const subtodo = targetitem.parentElement;
        subtodo.classList.toggle ('completed');

               

        if(subtodo.classList[1] === 'completed'){
            markAllSubToDoCompleted(subtodo.parentElement);
            const maintodo = subtodo.parentElement.childNodes[0];
            const buttons = maintodo.getElementsByTagName('button');
            
            //disable the add button if the todo is marked completed
            makeButtonDisabled(buttons);

            //set checked status as true in session storage
            setCheckStatusInLocalStorage(subtodo,'true');
        }
        else  {  
            markUncompleted(subtodo.parentElement);
            const maintodo = subtodo.parentElement.childNodes[0];
            const buttons = maintodo.getElementsByTagName('button');
            //console.log('this',buttons);
            makeButtonEnabled(buttons);

            //set checked status as true in session storage
            setCheckStatusInLocalStorage(subtodo,'false');
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

            setCheckStatusInLocalStorage( _todoMainDiv_, 'true' );

        }else {
            const maintodo = subtodo.parentElement;
            maintodo.childNodes[0].classList.remove('completed');
            makeButtonEnabled(maintodo.getElementsByTagName('button'));

            setCheckStatusInLocalStorage( _todoMainDiv_, 'false' );

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

//delete todo from Local storage
function deleteSubTodoFromLocalStorage(__subTodoText__,__mainTodoText__) {
    

    __subTodoText__ = __subTodoText__.split('\n')[1];
   
    let __todo__ = __mainTodoText__.split(":")[0].trim();
    let __deudate__ = __mainTodoText__.split(":")[1].trim();

    let __TodosArr__ = checkLocalStorage();

    let found = false;

    for(let i=0;i<__TodosArr__.length;i++){

        //if the sub todo is found then break out
        if(found){
            break;
        }

        // get the index which matches the todo
        if((__TodosArr__[i].todo === __todo__) && (__TodosArr__[i].dueDate === __deudate__)){
            
            console.log(__TodosArr__[i]);

            let __subTodoArr__= __TodosArr__[i].subTodos;

            for(let j=0;j<__subTodoArr__.length;j++){

                console.log(__subTodoArr__[j]);

                //delete the sub todo present
                if(__subTodoArr__[j]._subTodo === __subTodoText__){

                    //delete the sub todo of i-th found main todo 
                    __TodosArr__[i].subTodos.splice(j,1);

                    found = true;

                    break;
                }

            }

        }
    }

    setLocalStorage(__TodosArr__); 
}

//delete todo from Local storage
function deleteMainTodoFromLocalStorage(__todoText__) {
    console.log(__todoText__);

    let __todo__ = __todoText__.split(":")[0].trim();
    let __deudate__ = __todoText__.split(":")[1].trim();

    let __TodosArr__ = checkLocalStorage();

    for(let i=0;i<__TodosArr__.length;i++){
        // get the index which matches the todo
        if((__TodosArr__[i].todo === __todo__) && (__TodosArr__[i].dueDate === __deudate__)){
            //delete the todo present
            __TodosArr__.splice(i,1);
        }
    }
    setLocalStorage(__TodosArr__);
}

//check if the drop down icon state is up or down
function checkStateOfDropDownIcon(__todoDIV__) {
    
    let __dropDownBTN__ = $(__todoDIV__).children('.dropdown-button')[0];
    
    let __childIcon__   = __dropDownBTN__.childNodes[0];

    if(__childIcon__.classList[2] === 'dropdown-button-rotate-down'){
        return 'down';
    }else if(__childIcon__.classList[2] === 'dropdown-button-rotate-up'){
        return 'up';
    }else{
        console.log('fuck!! ->'+__childIcon__.classList[1]);
    }
 
}

//set the main todo checked status in Local storage
function setCheckStatusInLocalStorage(todoToBeMarked, status) {
    let __todos__ = checkLocalStorage();

    let todoText = todoToBeMarked.innerText.split(":")[0].trim(); 
    let todoDueDate = todoToBeMarked.innerText.split(":")[1].trim(); 

    for(let i=0;i<__todos__.length;i++){
    
        if((__todos__[i].todo === todoText) && (__todos__[i].dueDate === todoDueDate)){
           
           __todos__[i].checked = status;
            break;
        }
    }

    setLocalStorage(__todos__);
}

//set the sub todo checked status in the Local storage
function setSubTodoStatus(sub,main,status){
    let __todos__ = checkLocalStorage();

    let _sub_ = sub.split('\n');

    //getting the sub-todo text irrespective of how many line breaks present
    for(const s of _sub_) {
        if(s){
           sub = s.trim();
        }
    }

    let __todo__    = main.split(':')[0].trim();
    let __deudate__ = main.split(':')[1].trim();


    for(let i=0;i<__todos__.length;i++){    
        
        //get the matching main-todo  
        if((__todos__[i].todo === __todo__) && (__todos__[i].dueDate === __deudate__)){
           
            //store the sub todos
            let __subTodo__ = __todos__[i].subTodos;

            //iterate through the "subTodos" array
            for(let j=0;j<__subTodo__.length;j++){

                //get the sub todo whose status to be updated
                if(__subTodo__[j]._subTodo === sub ){
                    __subTodo__[j]._checked = status ? 'true' : 'false';
                }

            }
            break;
        }
    }

    //set the changes back to local storage
    setLocalStorage(__todos__);
}
 
//set todos back to local storage
function setLocalStorage(__ToDos__) {
    localStorage.setItem( 'allTodo', JSON.stringify(__ToDos__) );
}

//check if todo already there in local storage
function checkLocalStorage() {
    let _todos_ ;
    if( localStorage.getItem('allTodo') === null ){
        _todos_ = [];
    }
    else {
        _todos_ = JSON.parse( localStorage.getItem('allTodo') );
    }
    return _todos_;
}

//adding todos to local storage 
function addMainTodoToLocalStorage() {
    let _TODO_ = checkLocalStorage() ;

    //creating a main_todo object and storing it to local storage
    let _mainTodo = {
        'todo'    : todoinput.value.trim(),
        'dueDate' : calendar.value.trim(),
        'checked' : 'false',
        'subTodos': [] 
    }; 

    _TODO_.push(_mainTodo);

    setLocalStorage(_TODO_);

}

//getting todos from local storage
//also appending to the ul element
function getTodosFromLocalStorage() {
    let _TODO_ = checkLocalStorage();

    _TODO_.forEach( (t) =>{ 

        //had to create another function as javascript does not support function over-loading
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

//adding the sub todo of a main todo to local storage
function addSubTodoToSessionStorage(_ancestor_, _subTask_) {
    let __todoText__ = _ancestor_.childNodes[0].innerText.trim();
     
    let __todo__ = __todoText__.split(":")[0].trim();
    let __deudate__ = __todoText__.split(":")[1].trim();

    //saving the status of the sub todo
    let subTodoObj =  { '_subTodo': _subTask_.trim(), '_checked':'false' };
    let __TODOS__ = checkLocalStorage();

    for(let i=0;i<__TODOS__.length;i++){
    
        if((__TODOS__[i].todo === __todo__) && (__TODOS__[i].dueDate === __deudate__)){
           
           __TODOS__[i].subTodos.push(subTodoObj);
            break;
        }
    }

    /* sessionStorage.setItem('allTodo',JSON.stringify(__TODOS__)); */
    setLocalStorage(__TODOS__);
}

//rotate child icon
function rotateChildIcon(childIcon){
    
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
                //if true mark the main todo completed
                markMainTodoCompleteIfNot(todoMainDiv);
                
                //also make the button disabled
                makeButtonDisabled(todoMainDiv.childNodes[0].getElementsByTagName('button'));
                
            }
    });
}

//mark the main todo complete if not already completed
function markMainTodoCompleteIfNot(element) {
    let mainTodoDiv = element.childNodes[0];
    if(!(mainTodoDiv.classList[1] === 'completed')){
        mainTodoDiv.classList.add('completed');
        setCheckStatusInLocalStorage(mainTodoDiv,'true');
    }
}

//delete the div- todo-main trash button clicked
function deleteMainTodo( ancestor){

    var childrens = $(ancestor).children().not('.todo');

    console.log(childrens);

    if(childrens.length){

        //if child todos are present then slide them up
        //then fade out the whole todo-main class div and remove
        $(childrens).slideUp(300,'linear',
                function(){
                    $(ancestor).fadeOut(400, function(){
                        ancestor.remove();
                    });
                }        
        );
        
    }else{
    
        $(ancestor).fadeOut(400, function(){

            ancestor.remove();
        }); 
        
    }
}

//create and return the todo-main class div
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
    img.src = 'images/arrowholo.svg';
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

        //if the child todo has the class completed only then remove the class
        //here completed is the second classList item that's why index used is 1
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
        
        childtodos[i].classList.add('completed');

        console.log('marking all-'+childtodos[i].innerText+'-'+childtodos[0].innerText);

        setSubTodoStatus( '\n'+childtodos[i].innerText+'\n',childtodos[0].innerText,'completed');
    }
}

//delegates the call to checkCompleted
function checkAllSubTodoDone(target){
    
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
        
        if(!childtodos[i].classList[1] ){
            return false;
        }
    }
    
    return true;
}

})