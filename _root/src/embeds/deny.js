async function getEmbeds(interaction, data) {
    /*
    data= {
        title,
        description
    }
    */
    const user = interaction.member.user;
    const embeds = {
        "title": data?.title,
        "description": data?.description,
        "color": 15412003, // #eb2b23
        "author": {
            "icon_url": user?.displayAvatarURL({ format: 'png', size: 512 }),
            "name": user?.username,
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