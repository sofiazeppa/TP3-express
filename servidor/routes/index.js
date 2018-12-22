var express = require('express');
var router = express.Router();
const fs = require('fs');
var path = require('path');




// /users
// /users/new
// /users/edit

// /api/users --> get
//  --> FILTRO

// /api/users --> post
//  --> VALIDAR los datos
//  --> grabar el archivo en users.js
//  --> devolver un mensaje de error

// /api/users/:id --> put
//  --> VALIDAR los datos
//  --> buscamos el user a editar
//  --> grabar el archivo (los cambios) en users.js
//  --> devolver un mensaje de error

// /api/users/:id --> delete
//  --> buscamos el user a eliminar
//  --> eliminar

router.get("/ping", function(req, res, next) {
	res.send("pong")
})


let users = [{
	name: 'Ada',
	surname: 'Lovelace',
	phone: '1234567890',
	email: 'contacto@gmail.com',
	id: 1
}, {
	name: 'Grace',
	surname: 'Hopper',
	phone: '087654321',
	email: 'contacto@hotmail.com',
	id: 2
}]

// si no existe el file 'users.json', crearlo
if ( !fs.existsSync(path.join(__dirname, '..', 'users.json')) ) {
	fs.writeFileSync('users.json', JSON.stringify(users));
} 

// validacion
function validateEmail(userEmail) {
	const email = userEmail;
	const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
	const test = regexEmail.test(email);
	return test ? true : false
}
function validateName(userName) {
	let val = userName
	return val.length < 30 ? true : false
	
}
function validateSurname(userSur) {
	let val = userSur
	return val.length < 30 ? true : false
}
function validateNumbers(userPhone) {
	let range = /[0-9]/
	test = range.test(userPhone)
	return test ? true : false
}

// muestra el html de newUser
router.get("/users/new", function(req, res, next) {
	res.sendFile(path.join(__dirname, '..', 'public', 'html', 'newUser.html'))
})
// agrega un nuevo user a la lista users
router.post("/api/users", function(req, res, next) {
	const user = req.body
	let users = fs.readFileSync('users.json');
	users = JSON.parse(users);

	// // validar
	let name = validateName(user.name);
	let surname = validateSurname(user.surname);
	let phone = validateNumbers(user.phone);
	let email = validateEmail(user.email);

	const newId = users.length === 0 ? (1) : (users[users.length - 1].id + 1);
	user.id = newId

	if (name && surname && phone && email) {
		users.push(user);
		fs.writeFileSync('users.json', JSON.stringify(users));			
		// para terminar la llamda de ajax y que se pueda recargar la pagina
		res.send(user)
	} else {
		res.status(418).send("validation error")
	}
})

// enviar users
// router.get("/api/users", function(req, res, next) {
// 	let users = fs.readFileSync('users.json');
// 	users = JSON.parse(users);

// 	for (var i = 0; i < users.length; i++) {
// 		res.send(users)
// 	}
// })

// muestra el html de users
router.get("/users", function(req, res, next) {
	res.sendFile(path.join(__dirname, '..', 'public', 'html', 'index.html'))
})

// renderiza el user con el id del parametro
router.get("/api/users/:id", function(req, res, next) {
	let users = fs.readFileSync('users.json');
	users = JSON.parse(users);
	const id = req.params.id;

	for (var i = 0; i < users.length; i++) {
		if (users[i].id == id) {
			res.send(users[i])
		}	
	}
})


// eliminar user
router.delete("/api/users/:id", function(req, res, next) {
	let users = fs.readFileSync('users.json');
	users = JSON.parse(users);
	const id = req.params.id;

	for (let i = 0; i < users.length; i++) {
	  if (users[i].id == id) {
		users.splice(i, 1);
	  }
	}

	fs.writeFileSync('users.json', JSON.stringify(users));
})


// editar user
router.get("/users/edit", function(req, res, next) {
	res.sendFile(path.join(__dirname, '..', 'public', 'html', 'editUser.html'))
})

router.put("/api/users/:id", function(req, res, next) {
	let users = fs.readFileSync('users.json');
	users = JSON.parse(users)

	const id = req.params.id
	const body = req.body
	const bodyKeys = Object.keys(body)

	for (let i = 0 ; i < users.length ; i++) {
		const currentUser = users[i]
		if ( currentUser.id == id ) {
			const userKeys = Object.keys(currentUser)
			for (let x = 0 ; x < bodyKeys.length ; x++) {
				const currentBodyKey = bodyKeys[x]
				if (userKeys.indexOf(currentBodyKey) > -1) {
					currentUser[currentBodyKey] = body[currentBodyKey]
				} else {
					console.log(`${currentBodyKey} no es una clave valida`)
				}
			}
			fs.writeFileSync('users.json', JSON.stringify(users));
			// se pone un res asi el navegador entiende que ya se termino la llamada, y peude recargar la pagina
			res.send(currentUser)
		}
	}
})

// filtrar users
router.get("/api/users", function(req, res, next) {
	let searchValue = req.query.search;
	let users = fs.readFileSync('users.json');
	users = JSON.parse(users)
	// si searchValue no es undefined (existe) y no esta vacio
	if (searchValue && searchValue.length) {
		// nos fijamos si la posicion de searchValue en cada uno de los elementos de users existe, es decir, si es mayor o igual a 0, y devuelve ese user
		users = users.filter(function(u) {
			return u.name.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0 ||
				u.surname.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0 ||
				u.phone.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0 ||
				u.email.toLowerCase().indexOf(searchValue.toLowerCase()) >= 0
		});
	}
	res.json(users)	
})






module.exports = router;



