const axios = require('axios');

const fonts = {
    a: "𝖺", b: "𝖻", c: "𝖼", d: "𝖽", e: "𝖾", f: "𝖿", g: "𝗀", h: "𝗁", i: "𝗂",
    j: "𝗃", k: "𝗄", l: "𝗅", m: "𝗆", n: "𝗇", o: "𝗈", p: "𝗉", q: "𝗊", r: "𝗋",
    s: "𝗌", t: "𝗍", u: "𝗎", v: "𝗏", w: "𝗐", x: "𝗑", y: "𝗒", z: "𝗓",
    A: "𝖠", B: "𝖡", C: "𝖢", D: "𝖣", E: "𝖤", F: "𝖥", G: "𝖦", H: "𝖧", I: "𝖨",
    J: "𝖩", K: "𝖪", L: "𝖫", M: "𝖬", N: "𝖭", O: "𝖮", P: "𝖯", Q: "𝖰", R: "𝖱",
    S: "𝖲", T: "𝖳", U: "𝖴", V: "𝖵", W: "𝖶", X: "𝖷", Y: "𝖸", Z: "𝖹",
};

module.exports.config = {
    name: 'ai',
    version: '2',
    role: 0,
    hasPrefix: false,
    aliases: ['gpt', 'ae'],
    description: "Command for AI-generated responses styled with special fonts.",
    usage: "ai [prompt]",
    credits: 'aesther',
    cooldown: 1,
};

module.exports.run = async function({ api, event, args }) {
    const input = args.join(' ');
    
    if (!input) {
        api.sendMessage('🟢 ᗩEᔕTᕼEᖇ ⚪\nฅ^•ﻌ•^ฅ.  ?? .', event.threadID, event.messageID);
        api.setMessageReaction("🟡", event.messageID, () => {}, true);
        return;
    }
    
    try {
        const { data } = await axios.get(`https://markdevs-api.onrender.com/api/v2/gpt4?query=${encodeURIComponent(input)}`);
        
        let response = data.response || 'No response from AI.';
        
        // Replace characters with stylized characters from fonts
        response = response.split('').map(char => fonts[char.toLowerCase()] || char).join('');
        
        api.sendMessage(`🟢 ᗩEᔕTᕼEᖇ ⚪\n${response} 🟡`, event.threadID, event.messageID);
        api.setMessageReaction("🟢", event.messageID, () => {}, true);
        
    } catch (error) {
        console.error('Error:', error);
        api.sendMessage('⚠️ Error Loading ⚠️', event.threadID, event.messageID);
    }
};
