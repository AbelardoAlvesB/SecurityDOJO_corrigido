const router = require('express').Router();
const { errHandling, encode, decode } = require('../../utils/utils');
const cookieParser = require('cookie-parser');
const { updateUsername, getUserById } = require('../../service/service');
const jwt = require('jsonwebtoken');

router.use(cookieParser());

const renderData = {};

router.get(
	'/broken_autentication',
	errHandling(async (req, res) => {
		const token = req.cookies.token;
		const user = jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
			if (err) {
				console.log(err.name, err.message);
				return false;
			} else return decoded.user_id;
		});

		const usuarioNaoAutenticado = user == false;

		if (usuarioNaoAutenticado) {
			res.render('user-not-authenticated');
		} else {
			const { rows } = await getUserById(user);
			renderData.username = rows[0].username;
			renderData.user_id = encode(user);
			res.render('broken_autentication', renderData);
		}
	})
);

router.get(
	'/broken_autentication/alterarusername',
	errHandling(async (req, res) => {
		//CRIA A VARIAVEI COM BASE NO QUE VEIO NA URL
		const { id: user_encoded, novo_username } = req.query;
		const user_id = decode(user_encoded)
		renderData.user_id = user_id;
		//BUSCA NO BANCO DE DADOS SE O USUARIO EXISTE
		const { rows } = await getUserById(user_id);
		const userExiste = rows.length == 1;
		if (userExiste) {
			const { rows } = await updateUsername(novo_username, user_id);
			renderData.username = rows[0].username;
			res.render('broken_autentication', renderData);
		} else {
			renderData.username = 'User_id_not_found';
			res.render('broken_autentication', renderData);
		}
	})
);

module.exports = router;
