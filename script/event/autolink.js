module.exports = {
    async handleEvent(api, event) {
        if (event.logMessageData?.addedParticipants) {
            event.logMessageData.addedParticipants.forEach(async (participant) => {
                try {
                    const info = await api.getUserInfo(participant.userFbId);
                    const { name } = info[participant.userFbId];
 
                    if (participant.userFbId === api.getCurrentUserID()) {
                        const threadInfo = await api.getThreadInfo(event.threadID);
                        const groupName = threadInfo.threadName;
                        const memberCount = threadInfo.participantIDs.length;
 
                        // Random direct image links
                        const imageLinks = [
                            "https://i.postimg.cc/mk0fdc2d/4fa454b230dcadd57d8e66cfbe41152e.jpg",
                            "https://i.postimg.cc/Vs3kZvTQ/a72e50bd8bb773a9840ca7d848bdf6c6.jpg",
                  
                            // Add more image links as needed
                        ];
                        const randomImage = imageLinks[Math.floor(Math.random() * imageLinks.length)];
 
                        api.sendMessage(`✅ Hello! This bot is now Online in ${groupName}\nMembers: ${memberCount}\n—————————————\nℹ️• Feel free to use it anytime!\nℹ️• 24/7 Active!\nℹ️• Owner: https://www.facebook.com/profile.php?id=61550188503841 \nℹ️• Co-owner: https://www.facebook.com/profile.php?id=61550188503841 \n—————————————`, event.threadID);
                        api.sendMessage(randomImage, event.threadID); // Send random image link
                    } else {
                        api.sendMessage(`Welcome ${name} to the group!`, event.threadID);
                    }
                } catch (error) {
                    console.error("Error:", error);
                }
            });
        }
    }
};
