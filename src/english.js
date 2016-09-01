module.exports = {
	languageCode : 'en',
	watsonName : 'en-US_BroadbandModel',
	wrapResponse : function(text){
		return 'I think its ' + text;
	},
	keyPhrase : 'how do you say',
	keyWord : 'say',
	nullPhrase : "I am sorry I didn't catch that.",
}