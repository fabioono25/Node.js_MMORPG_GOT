const ObjectID = require('mongodb').ObjectID

function JogoDAO(connection){
	this._connection = connection()
}

JogoDAO.prototype.gerarParametros = function(usuario) {
    this._connection.open( function(err, mongoclient){
		mongoclient.collection("jogo", function(err, collection){
			collection.insert({
                usuario: usuario,
                moeda: 15,
                suditos: 10,
                temor: Math.floor(Math.random() * 1000),  //gera entre 0 - 1
                sabedoria: Math.floor(Math.random() * 1000),
                comercio: Math.floor(Math.random() * 1000),
                magia: Math.floor(Math.random() * 1000)
            })

			mongoclient.close()
        })

	})
}

JogoDAO.prototype.iniciaJogo = function(res, usuario, casa, msg) {
    this._connection.open( function(err, mongoclient){
		mongoclient.collection("jogo", function(err, collection){
            collection.find({usuario: usuario}).toArray((error, result) => {
                
                //console.log(result[0])
                res.render("jogo", {img_casa: casa, jogo: result[0], msg: msg})

                mongoclient.close()
            })
        })
    })
}

JogoDAO.prototype.getAcoes = function(usuario, res){
    this._connection.open( function(err, mongoclient){
	 	mongoclient.collection("acao", function(err, collection){

            const date = new Date()
            const momento_atual = date.getTime()

            collection.find({usuario: usuario, acao_termina_em: {$gt: momento_atual}}).toArray((error, result) => {
                
	            res.render("pergaminhos", {acoes:result})

                mongoclient.close()
            })
        })
    })
}

JogoDAO.prototype.acao = function(acao) {
    this._connection.open( function(err, mongoclient){
		mongoclient.collection("acao", function(err, collection){

            const date = new Date()
            //date.getTime() // -- 01/01/1970 ate instante funcao foi executada
            let tempo = null

            switch (parseInt(acao.acao)){
                case 1: tempo = 1 * 60 * 60000; break; //1h
                case 2: tempo = 2 * 60 * 60000; break; //2h
                case 3: tempo = 5 * 60 * 60000; break; //5h
                case 4: tempo = 5 * 60 * 60000; break; //5h
            }

            acao.acao_termina_em = date.getTime() + tempo

			collection.insert(acao)
        })
        
        mongoclient.collection("jogo", function(err, collection){

            let moedas = null

            switch (parseInt(acao.acao)){
                case 1: moedas = -2 * acao.quantidade; break; //1h
                case 2: moedas = -3 * acao.quantidade; break; //2h
                case 3: moedas = -1 * acao.quantidade; break; //5h
                case 4: moedas = -1 * acao.quantidade; break; //5h
            }

            collection.update(
                { usuario: acao.usuario },
                { $inc: {moeda: moedas} }
            )
        })

        mongoclient.close()
	})
}

JogoDAO.prototype.revogarAcao = function(_id, res) {
    this._connection.open( function(err, mongoclient){
        mongoclient.collection("acao", function(err, collection){

           collection.remove(
                {_id : ObjectID(_id)},
                (err, result) => {
                    res.redirect("jogo?msg=D")
                    mongoclient.close()
                }
           )
       })
   })
}

module.exports = function(){
	return JogoDAO
}