const axios = require('axios');
const fs = require('fs');
const path = require('path');
const { google } = require('googleapis');
const mime = require('mime-types');
const getFBInfo = require("@xaviabot/fb-downloader");

module.exports.config = {
  name: "autolink",
  joinNoti: [],
  leaveNoti: [],
  version: "69",
  credits: "jonell | fix Aesther",
  description: "Download media from Facebook tiktok"
};

const downloadDirectory = path.resolve(__dirname, 'cache');

module.exports.handleEvent = async function({ api, event }) {
  try {
    if (event.body !== null) {
      const regEx_tiktok = /https:\/\/(www\.|vt\.)?tiktok\.com\//;
      const regEx_facebook = /https:\/\/www\.facebook\.com\/\S+/;

      const link = event.body;

      if (regEx_tiktok.test(link)) {
        api.setMessageReaction("🟡", event.messageID, () => {}, true);
        try {
          const response = await axios.post(`https://www.tikwm.com/api/`, { url: link });
          const data = response.data.data;
          const videoStream = await axios({
            method: 'get',
            url: data.play,
            responseType: 'stream'
          });
          const fileName = `TikTok-${Date.now()}.mp4`;
          const filePath = path.join(downloadDirectory, fileName);
          const videoFile = fs.createWriteStream(filePath);

          videoStream.data.pipe(videoFile);

          videoFile.on('finish', () => {
            videoFile.close(() => {
              console.log('Downloaded TikTok video file.');
              api.sendMessage({
                body: `𝖠𝗎𝗍𝗈 𝖣𝗈𝗐𝗇 𝖳𝗂𝗄𝖳𝗈𝗄 \n\n𝙲𝚘𝚗𝚝𝚎𝚗𝚝: ${data.title}\n\n𝙻𝚒𝚔𝚎𝚜: ${data.digg_count}\n\n𝙲𝚘𝚖𝚖𝚎𝚗𝚝𝚜: ${data.comment_count}\n\n🟢ᗩƐᔕƬHƐᖇ⚪- ˕ •マ`,
                attachment: fs.createReadStream(filePath)
              }, event.threadID, () => {
                fs.unlinkSync(filePath); // Delete the video file after sending it
              });
            });
          });
        } catch (error) {
          api.sendMessage(`Error downloading TikTok video: ${error.message}`, event.threadID);
        }
      } else if (regEx_facebook.test(link)) {
        const fbvid = path.join(downloadDirectory, 'video.mp4');

        if (!fs.existsSync(downloadDirectory)) {
          fs.mkdirSync(downloadDirectory, { recursive: true });
        }

        try {
          const result = await getFBInfo(link);
          const videoData = await axios.get(encodeURI(result.sd), { responseType: 'arraybuffer' });
          fs.writeFileSync(fbvid, Buffer.from(videoData.data, "utf-8"));
          api.sendMessage({
            body: "𝖠𝗎𝗍𝗈 𝖣𝗈𝗐𝗇 𝖥𝖺𝖼𝖾𝖻𝗈𝗈𝗄 𝖵𝗂𝖽𝖾𝗈\n\n🟢ᗩƐᔕƬHƐᖇ⚪- ˕ •マ",
            attachment: fs.createReadStream(fbvid)
          }, event.threadID, () => {
            fs.unlinkSync(fbvid); // Delete the video file after sending it
          });
        } catch (error) {
          console.error('Error downloading Facebook video:', error);
        }
      } else {
        // Handle other types of links if needed
      }
    }
  } catch (error) {
    console.error('Error in handleEvent:', error);
  }
};
