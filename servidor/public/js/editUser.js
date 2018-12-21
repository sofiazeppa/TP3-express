const urlParams = new URLSearchParams(window.location.search);
const id = urlParams.get('id');

const name = $("#editName");
const surname = $("#editSurname");
const phone = $("#editPhone");
const email = $("#editEmail");


$.ajax({
    url: "http://localhost:3000/api/users/"+id
}).done(function(data) {
    name.val(data.name)
    surname.val(data.surname)
    phone.val(data.phone)
    email.val(data.email)
})

$("#saveEdit").on("click", function() {
    $.ajax("http://localhost:3000/api/users/"+id, {
        method: "PUT",
        data: {
            name: name.val(),
            surname: surname.val(),
            phone: phone.val(),
            email: email.val()
        }
    }).done(function() {
        window.location.href = "http://localhost:3000/users"
    })
})