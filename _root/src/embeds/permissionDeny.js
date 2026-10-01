async function getEmbeds(interaction, data) {
    const embeds = {
        "title": "你沒有權限",
        // "description": `/`,
        "color": 15412003, // #eb2b23
        "author": {
            "icon_url": data?.target.displayAvatarURL({ format: 'png', size: 512 }),
            "name": data?.target.username,
        },
        "footer": {
            "text": "歪喵團隊製作",
            "icon_url": interaction.client.user.displayAvatarURL({ format: 'png', size: 512 }),
        },
        "timestamp": new Date(),
    };
    return [embeds];
};
module.exports = getEmbeds