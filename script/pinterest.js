module.exports.config = {
    name: "pinterest",
    version: "2",
    role: 0,
    credits: "𝗔𝗘𝗦𝗧𝗛𝗘𝗥",
    description: "Send Pinterest pictures",
    hasPrefix: false,
    aliases: ["pin"],
    usage: "pin image - count",
    cooldown: 5
};

const axios = require("axios");
const fs = require("fs");
const path = require("path");

module.exports.run = async function({ api, event, args }) {
    try {
        const input = args.join(" ");
        const [query, countStr] = input.split(" - ");
        let count = parseInt(countStr, 10);

        if (!query || isNaN(count)) {
            return api.sendMessage("🔴𝘽𝙍𝙐𝙃𝙃🔴\n-------------------------------\nExemple : Pinterest Kakashi - 9\n(it depends on you how many images you want to appear in the result)❌", event.threadID);
        }

        count = Math.min(count, 9);

        const apiUrl = `https://joshweb.click/api/pinterest?q=${encodeURIComponent(query)}`;
        api.sendMessage(`🔍 𝙋𝙄𝙉𝙏𝙀𝙍𝙀𝙎𝙏.... `, event.threadID);

        const response = await axios.get(apiUrl);
        const images = response.data.result.slice(0, count);

        if (images.length === 0) {
            return api.sendMessage("No images found for the specified query.", event.threadID);
        }

        const attachments = [];

        for (let i = 0; i < images.length; i++) {
            const imageUrl = images[i];
            const imagePath = path.join(__dirname, 'cache', `image${i}.jpg`);
            const imageResponse = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            fs.writeFileSync(imagePath, imageResponse.data);
            attachments.push(fs.createReadStream(imagePath));
        }

        api.sendMessage({
            body: `-- 𝙋𝙄𝙉𝙏𝙀𝙍𝙀𝙎𝙏 -- ☂ [${count}]\n[📱] "${query}":`,
            attachment: attachments
        }, event.threadID, () => {
            attachments.forEach(stream => stream.close());
            attachments.forEach(stream => fs.unlinkSync(stream.path));
        });
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage("An error occurred while processing the request.", event.threadID);
    }
};
