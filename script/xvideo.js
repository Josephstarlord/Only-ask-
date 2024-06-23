const axios = require('axios');
const fs = require('fs-extra');
const path = require('path');

module.exports.config = {
  name: "xvideo",
  version: "1.0.0",
  role: 0,
  hasPrefix: true,
  credits: "aesther",
  description: "Send a video from xvideos.com",
  usage: "type prefix[xvideo] <query>",
  cooldown: 10,
};

module.exports.run = async ({ api, event, args }) => {
  try {
    const { threadID, messageID } = event;
    const query = args.join(" ");

    if (!query) {
      return api.sendMessage("Please provide a query.", threadID, messageID);
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
    const filePath = path.join(__dirname, 'cache', `${timestamp}_tid.mp4`);

    const response = await axios.get(`https://zcdsphapilist.replit.app/xvideos`, {
      responseType: "arraybuffer",
    });

    fs.writeFileSync(filePath, Buffer.from(response.data, "binary"));

    setTimeout(() => {
      api.sendMessage({
        body: "🔴 xvideos 🔴",
        attachment: fs.createReadStream(filePath),
      }, threadID, () => fs.unlinkSync(filePath));
    }, 5000);

  } catch (error) {
    api.sendMessage(`Error: ${error.message}`, event.threadID, event.messageID);
  }
};
