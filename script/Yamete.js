const fs = require("fs");
module.exports.config = {
  name: "yamete",
	version: "1",
	role: 0,
	credits: "aesther",
	description: "vocal aesther",
  usage:"noprefix", 
	hasPrefix: false,
	cooldowns: 2,
};
module.exports.handleEvent = function({ api, event }) {
	var { threadID, messageID } = event;
	if (event.body.indexOf("yamate")==0 || (event.body.indexOf("yamete")==0)) {
		var msg = {
				body: "",
				attachment: fs.createReadStream(__dirname + `/cache/yamete.mp3`)
			}
			return api.sendMessage(msg, threadID, messageID);
		}
	}
	module.exports.run = function({ api, event, client, __GLOBAL }) {

}
