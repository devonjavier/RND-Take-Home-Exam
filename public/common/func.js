
function idForm(action){
    // go to href first to enter id
    // after go to /handleAction:id

    let id = prompt('Question ID');

    if(!id){
        alert("Must enter ID");
        return;
    }

    switch(action){
        case 'edit':
            window.location.href = `/change?id=${id}`;
            break;
        case 'delete':
            fetch(`/delete?id=${id}`, {
                method: 'DELETE'
            });
            break;
        case 'answer':
            window.location.href = `/answer?id=${id}`;
            break;
    }


}

function addQuestion(){
    window.location.href = '/add';
}

function viewList(){
    window.location.href = '/list';
}

function returnHome(){
    window.location.href = '/';
}

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

function removeChoice(button){
    const choicecontainer = button.parentElement
    choicecontainer.remove()
}