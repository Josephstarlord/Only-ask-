module.exports = {
    async handleEvent(api, event) {
        if (event.logMessageData?.addedParticipants) {
            event.logMessageData.addedParticipants.forEach(async (participant) => {
                try {
                    const info = await api.getUserInfo(participant.userFbId);
                    const { name } = info[participant.userFbId];
 
                    if (participant.userFbId === api.getCurrentUserID()) {
                        // Get group info
                        const threadInfo = await api.getThreadInfo(event.threadID);
                        const groupName = threadInfo.threadName;
                        const memberCount = threadInfo.participantIDs.length;
 
                        // If the bot is added to the group
                        api.sendMessage(`𝗖𝗢𝗡𝗡𝗘𝗖𝗧𝗘𝗗 𝗦𝗨𝗖𝗦𝗘𝗦𝗦\n[✦🆔] [${groupName}]\n━━━━━━━━━━━━━[${memberCount}]\n𝙰𝚎𝚜𝚝𝚑𝚎𝚛`, event.threadID);
                    } else {
                        // If any other participant is added to the group
                        api.sendMessage(`Welcome ${name} to the group!`, event.threadID);
                    }
                } catch (error) {
                    console.error("Error:", error);
                }
            });
        }
    }
};
