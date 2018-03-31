/* importar o mongodb */
var mongo = require('mongodb')

var connMongoDB = () => 
    new mongo.Db(
		'got',
		new mongo.Server(
			'localhost', //string contendo o endereço do servidor
			27017, //porta de conexão
			{}
		),
		{}
	)

module.exports = () => connMongoDB