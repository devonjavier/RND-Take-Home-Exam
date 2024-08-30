
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
            window.location.href = `/edit?id=${id}`;
            break;
        case 'delete':
            window.location.href = `/edit?id=${id}`;
            break;
        case 'answer':
            window.location.href = `/check-answer?id=${id}`;
            break;
    }

    
}