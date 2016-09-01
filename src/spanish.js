module.exports = {
	languageCode : 'es',
	watsonName : 'es-ES_BroadbandModel',
	wrapResponse : function(text){
		return 'Creo que se dice ' + text;
	},
	keyPhrase : 'como se dice',
	keyWord : 'dice',
	nullPhrase : 'Perdon no te entendi.',
}