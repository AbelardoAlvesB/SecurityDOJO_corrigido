const router = require('express').Router();
const { errHandling } = require('../../utils/utils');
const cookieParser = require('cookie-parser');
const { getUserById, updateUsername } = require('../../service/service');
const jwt = require('jsonwebtoken');
var csrf = require('csurf');
router.use(cookieParser());
var csrfProtect = csrf({cookie: true});

router.use(cookieParser());

const renderData = {};

router.get(
	'/csrf-post',
	csrfProtect(async (req, res) => {
		const token = req.cookies.token;
		const user = jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
			if (err) {
				console.log(err.name, err.message);
				return false;
			} else return decoded.user_id;
		});

		if (usuarioNaoAutenticado) {
			res.render('user-not-authenticated');
		} else {
			const { rows } = await getUserById(user);
			renderData.username = rows[0].username;
			renderData.token = req.csrfToken()
			res.render('csrf-post', renderData);
		}
	})
);

router.post(
	'/csrf-post/alterarusername',
	errHandling(async (req, res) => {
		//CRIA A VARIAVEI COM BASE NO QUE VEIO NA URL
		const { novo_username } = req.body;
		//CRIA A VARIAVEI COM BASE NO QUE ESTA NOS COOKIES
		const token = req.cookies.token;
		const user = jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
			if (err) {
				console.log(err.name, err.message);
				return false;
			} else return decoded.user_id;
		});
		//BUSCA NO BANCO DE DADOS SE O USUARIO EXISTE
		const { rows } = await getUserById(user_id);
		const userExiste = rows.length == 1;
		if (userExiste) {
			const { rows } = await updateUsername(novo_username, user);
			renderData.username = rows[0].username;
			res.render('csrf-post', renderData);
		} else {
			renderData.username = 'User_id_not_found';
			res.render('csrf-post', renderData);
		}
	})
);

module.exports = router;
