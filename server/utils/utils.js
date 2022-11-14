const axios = require('axios');
const jwt = require('jsonwebtoken');

exports.errHandling = fn => (req, res, next) =>
	Promise.resolve(fn(req, res, next)).catch(next);

exports.request = async (endPoint, method, data) => {
	const porta = process.env.PORT || 3000;
	const URL_PADRAO = 'http://localhost:' + porta;
	const url = `${URL_PADRAO}${endPoint}`;

	const { headers, data: res } = await axios({
		url,
		method,
		data,
		validateStatus: false,
	});

	return { headers, res };
};

/*exports.minhaLIndaFuncao = async token => {
	return jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
		if (err) {
			console.log(err.name, err.message);
			return false;
		} else return decoded.user_id;
	});
}
*/


exports.encode = (string) => {
	return jwt.sign(string, process.env.JWT_SECRET_KEY) 
}

exports.decode = (string) => {
	return jwt.verify(string, process.env.JWT_SECRET_KEY) 
}