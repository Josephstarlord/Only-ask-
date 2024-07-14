const axios = require('axios');
const fs = require('fs-extra');

module.exports.config = {
  name: "imagine",
  version: "1.1",
  role: 0,
  hasPrefix: true,
  credits: "aesther(Aryan API)",
  description: "Generate Image🖼️",
  cooldowns: 3,
};

module.exports.run = async ({ api, event, args }) => {
  try {
    const { threadID, messageID } = event;
    const query = args.join(" ").trim();
    if (!query) {
      return api.sendMessage("( ･ㅂ･)وprovide 𝗣𝗥𝗢𝗠𝗣𝗧 ?", threadID, messageID);
    }
    
    api.sendMessage(`(ू•ᴗ•ू❁𝙂𝙀𝙉𝙀𝙍𝘼𝙏𝙄𝙉𝙂 𝙄𝙈𝙂)....`, threadID, messageID);

    const response = await axios.get(`https://global-sprak.onrender.com/api/imagine?prompt=${encodeURIComponent(query)}`, {
      responseType: "arraybuffer",
    });

    const time = new Date();
    const timestamp = time.toISOString().replace(/[:.]/g, "-");
    const path = `./fb-chat-api/src/${timestamp}_tid.png`;

    fs.writeFileSync(path, Buffer.from(response.data, "binary"));

    setTimeout(() => {
      api.sendMessage({
        body: "[📑]𝗥𝗘𝗦𝗨𝗟𝗧𝗔 :",
        attachment: fs.createReadStream(path),
      }, threadID, () => fs.unlinkSync(path));
    }, 5000);
  } catch (error) {
    api.sendMessage(`An error occurred: ${error.message}`, event.threadID, event.messageID);
  }
};
