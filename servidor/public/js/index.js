const nameInput = $("#nameInput")
const surnameInput = $("#surnameInput")
const phoneInput = $("#phoneInput")
const emailInput = $("#emailInput")


function showError(error) {
    error.removeClass("hidden")
    setTimeout(function() {
        error.addClass("hidden")            
    }, 3000)
}

function validateEmail() {
    const errorEmail = $(".errorEmail")
    const email = emailInput.val();
    const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    const test = regexEmail.test(email);
    if (test && email!="") {
        return true
    } else {
        showError(errorEmail)
    }
}

function validateName() {
    let val = nameInput.val()
    const errorName = $(".errorName")
    if (val.length < 30 && val!="") {
        return true
    } else {
        showError(errorName)
    }
}

function validateSurname() {
    let val = surnameInput.val()
    const errorSurname = $(".errorSurname")
    if (val.length < 30 && val!="") {
        return true
    } else {
        showError(errorSurname)
    }
}

function validateNumbers() {
    let range = /[0-9]/
    const errorPhone = $(".errorPhone")
    test = range.test(phoneInput.val())
    if (test && phoneInput.val()!="") {
        return true
    } else {
        showError(errorPhone)
    }
}

// nuevo usuario
$("#newUser").on("click", function() {
    window.location.href = "http://localhost:3000/users/new"
})
// guardar nuevo user
$("#saveForm").on("click",  function(e) {

    e.preventDefault()
    let name = validateName()
    let surname = validateSurname()
    let numbers = validateNumbers()
    let email = validateEmail()

    if (name && surname && numbers && email) {
        $.ajax("http://localhost:3000/api/users", {
            method: "POST",
            data: {
                name: nameInput.val(),
                surname: surnameInput.val(),
                phone: phoneInput.val(),
                email: emailInput.val()
            },
            success: window.location.href = "http://localhost:3000/users"
        })
    }
    // Swal('Creaste un usuario nuevo')
})


// appendear users
$.ajax("http://localhost:3000/api/users").done(function(data) {
    for(let i = 0 ; i < data.length ; i++) {
        let user = "<div class='user-container' id='"+data[i].id+"'><div class='user-info'><span>"+data[i].name+"</span><span>"+data[i].surname+"</span><span>"+data[i].phone+"</span><span>"+data[i].email+"</span></div><div class='buttons'><button class='edit-but'>Editar<button class='erase-but'>Borrar</button></div></div>"
        $(".all-users-container").append(user)
    }
})

// borrar user
$(document).on("click", ".erase-but", function() {
    let id = $(this).parent().parent().attr("id")
    $.ajax("http://localhost:3000/api/users/"+id, {
        method: "DELETE", 
        success: window.location.reload()
    })
})

// editar user
$(document).on("click", ".edit-but", function() {
    let id = $(this).parent().parent().attr("id")
    window.location.href = "http://localhost:3000/users/edit?id="+id
})

// filtrar
$("#filterBut").on("click", function() {
    const filterInput = $("#filterInput").val()
        // eliminar todos los users
        $(".user-container").remove()

    $.ajax("http://localhost:3000/api/users?search="+filterInput)
        .done(function(data) {
            // console.log(data)
            // appendear los users
            for(let i = 0 ; i < data.length ; i++) {
                let user = "<div class='user-container' id='"+data[i].id+"'><div class='user-info'><span>"+data[i].name+"</span><span>"+data[i].surname+"</span><span>"+data[i].phone+"</span><span>"+data[i].email+"</span></div><div class='buttons'><button class='edit-but'>Editar</button><button class='erase-but'>Borrar</button></div></div>"
                $(".all-users-container").append(user)
            }
        })
    
})






