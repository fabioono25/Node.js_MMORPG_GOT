//importar modulo do crypto
const crypto = require('crypto')

function UsuariosDAO(connection){
	this._connection = connection()
}
 
UsuariosDAO.prototype.inserirUsuario = function(usuario){
	this._connection.open( function(err, mongoclient){
		mongoclient.collection("usuarios", function(err, collection){
			
			const senha_criptografada = crypto.createHash("md5").update(usuario.senha).digest("hex")
			usuario.senha = senha_criptografada

			collection.insert(usuario)

			mongoclient.close()
		})
	})
}

UsuariosDAO.prototype.autenticar = function(usuario, req, res){
    this._connection.open( function(err, mongoclient){
		mongoclient.collection("usuarios", function(err, collection){
			//collection.find({usuario: {$eq:usuario.usuario}, senha:{$eq:usuario.senha}})
            //collection.find({usuario: usuario.usuario, senha:usuario.senha})
            //collection.find(usuario) //retorna um cursor
			const senha_criptografada = crypto.createHash("md5").update(usuario.senha).digest("hex")
			usuario.senha = senha_criptografada
			
			collection.find(usuario).toArray((error, result) => {
                
                if (result[0] !== undefined){
                    req.session.autorizado = true
                    req.session.usuario = result[0].usuario
                    req.session.casa = result[0].casa

                    res.redirect("jogo")
                }else
                    res.render("index", {validacao:{}}) //nao esta autorizado

            })
			mongoclient.close()
		})
	})
}

module.exports = function(){
	return UsuariosDAO
}