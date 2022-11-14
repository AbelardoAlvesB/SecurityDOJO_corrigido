const router = require('express').Router();
const { errHandling, minhaLIndaFuncao} = require('../../utils/utils');
const cookieParser = require('cookie-parser');
const { query } = require('express');
const { getNotasByUserId } = require('../../service/service');
const jwt = require('jsonwebtoken');



router.use(cookieParser());

const renderData = {};

router.get(
	'/idor',
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
			res.redirect(`idor/notas/${user}`);
		}
	})
);

router.get(
	'/idor/notas/*',
	errHandling(async (req, res) => {
		const user_id = req.originalUrl.split('/')[3];
		const token = req.cookies.token;
		const user = jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
			if (err) {
				console.log(err.name, err.message);
				return false;
			} else return decoded.user_id;
		});

		if (user == user_id){
			if (!isNaN(parseInt(user_id))) {
				const { rows } = await getNotasByUserId(user_id);
				renderData.posts = rows;
				res.render('idor', renderData);
			} else {
				res.redirect('/user-not-authenticated');
			} 
		} else {
			res.redirect('/user-not-authenticated');
		}
	})
);

module.exports = router;
