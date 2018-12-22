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
    Swal({
        title: 'Seguro queres editar este usuario?',
        type: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Si'
    }).then((result) => {
        if (result.value) {
            $.ajax("http://localhost:3000/api/users/"+id, {
                method: "PUT",
                data: {
                    name: name.val(),
                    surname: surname.val(),
                    phone: phone.val(),
                    email: email.val()
                },
                success: setTimeout(function() {
                    window.location.href = "http://localhost:3000/users"
                }, 1500) 
            })
            Swal({
                title: 'Usuario editado',
                type: 'success',
                showConfirmButton: false
            })
        }
    })
})