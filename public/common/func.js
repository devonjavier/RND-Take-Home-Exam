

// function to find question id prior to conducting an action
function idForm(action){
    

    let id = prompt('Question ID');

    if(!id){
        alert("Must enter ID");
        return;
    }

    switch(action){
        case 'edit':
            window.location.href = `/get?id=${id}&action=edit`;
            break;
        case 'delete':
            fetch(`/delete?id=${id}`, {
                method: 'DELETE'
            });
            break;
        case 'answer':
            window.location.href = `/get?id=${id}&action=answer`;
            break;
    }


}

// function add choice for creating a new question
function addChoice(){
    const choices = document.getElementById('choices');
    const cur_index = choices.children.length;

    const newchoiceHTML = `
        <div class="choicecontainer">
            <input type="text" class="choice-input" name="choices[]" placeholder="Choice ${cur_index + 1}" required>
            <button type="button" onclick="removeChoice(this);"> Remove? </button>
            <input type="radio" name="correct_choice" value="${cur_index}"> Correct?
        </div>
    `;

    choices.insertAdjacentHTML('beforeend', newchoiceHTML)
}

// function add choice for editing a pre-existing question
function addEditChoice(){
    const choices = document.getElementById('editchoices');
    const cur_index = choices.children.length;

    const newchoiceHTML = `
        <div class="choicecontainer">
            <input type="radio" name="correct_choice" value="${cur_index}" {{#if this.isCorrect}}checked{{/if}}>
            <input type="text" name="choices[]" placeholder="Choice ${cur_index + 1}">
            <button type="button" onclick="removeChoice(this)">Remove?</button>
        </div>
    `;

    choices.insertAdjacentHTML('beforeend', newchoiceHTML)
}

// function to remove one of the choices for a question
function removeChoice(button){
    const choicecontainer = button.parentElement
    choicecontainer.remove()
}


// functions for navigation
function addQuestion(){
    window.location.href = '/add';
}

function viewList(){
    window.location.href = '/list';
}

function returnHome(){
    window.location.href = '/';
}