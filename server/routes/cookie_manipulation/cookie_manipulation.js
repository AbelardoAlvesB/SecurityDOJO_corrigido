const router = require('express').Router();
const { errHandling } = require('../../utils/utils');
const cookieParser = require('cookie-parser');
const { getUserById, updateUsername } = require('../../service/service');
const jwt = require('jsonwebtoken');


router.use(cookieParser());

const renderData = {};

router.get(
	'/cookie_manipulation',
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
			res.redirect('/user-not-authenticated');
		} else {
			const { rows } = await getUserById(user);
			renderData.username = rows[0].username;
			res.render('cookie_manipulation', renderData);
		}
	})
);

router.get(
	'/cookie_manipulation/alterarusername',
	errHandling(async (req, res) => {
		//CRIA A VARIAVEI COM BASE NO QUE VEIO NA URL
		const { novo_username } = req.query;
		//CRIA A VARIAVEI COM BASE NO QUE ESTA NOS COOKIES
		const token = req.cookies.token;
		const user = jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
			if (err) {
				console.log(err.name, err.message);
				return false;
			} else return decoded.user_id;
		});
		//BUSCA NO BANCO DE DADOS SE O USUARIO EXISTE
		const { rows } = await getUserById(user);
		const userExiste = rows.length == 1;
		if (userExiste) {
			const { rows } = await updateUsername(novo_username, user);
			renderData.username = rows[0].username;
			res.render('cookie_manipulation', renderData);
		} else {
			renderData.username = 'User_id_not_found';
			res.render('cookie_manipulation', renderData);
		}
	})
);

module.exports = router;
