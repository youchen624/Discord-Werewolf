function getEmbed(interaction, data) {
    /*
    data = {
        title,
        description,
        image, // below http:// :(string)
        sideImage,  // side http:// :(string)
        color, // :(integer)
    }
    */
    // const user = interaction.member.user;
    const embed = {
        "title": data?.title,
        "description": data?.description,
        "image": { url: data?.image },
        "color": data?.color ?? 2326507,
        // "author": {
        //     "icon_url": user?.displayAvatarURL({ format: 'png', size: 512 }),
        //     "name": user?.username,
        // },
        "thumbnail": {
            "url": data?.sideImage,
        },
        "footer": {
            "text": "歪喵團隊製作",
            "icon_url": interaction.client.user.displayAvatarURL({ format: 'png', size: 512 }),
        },
        "timestamp": new Date(),
    };
    return embed;
};
module.exports = getEmbed