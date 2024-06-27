module.exports.config = {
    name: 'botlog',
    version: '2.1',
    description: "Auto setwelcome command",
    credits: 'aesther',
};

module.exports = {
    async handleEvent(api, event) {
        try {
            if (event.logMessageData?.addedParticipants) {
                for (const participant of event.logMessageData.addedParticipants) {
                    const info = await api.getUserInfo(participant.userFbId);
                    const { name } = info[participant.userFbId];
                    
                    if (participant.userFbId === api.getCurrentUserID()) {
                        const threadInfo = await api.getThreadInfo(event.threadID);
                        const groupName = threadInfo.threadName;
                        const memberCount = threadInfo.participantIDs.length;
                        
                        const imageLinks = [
                            "https://i.postimg.cc/mk0fdc2d/4fa454b230dcadd57d8e66cfbe41152e.jpg",
                            "https://i.postimg.cc/Vs3kZvTQ/a72e50bd8bb773a9840ca7d848bdf6c6.jpg",
                        ];
                        const randomImage = imageLinks[Math.floor(Math.random() * imageLinks.length)];
                        
                        await api.sendMessage(`[✅] 𝗖𝗢𝗡𝗡𝗘𝗖𝗧𝗘𝗗 𝗦𝗨𝗖𝗖𝗘𝗦𝗦\n[✦🆔]: ${groupName}\n━━━━━━━━━━━[${memberCount}]\n𝙰𝙴𝚂𝚃𝙷𝙴𝚁-ฅ( ̳• ◡ • ̳)ฅ`, event.threadID);
                        await api.sendMessage(randomImage, event.threadID); // Send random image link
                    } else {
                        await api.sendMessage(`Welcome ${name} to the group!`, event.threadID);
                    }
                }
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
};
