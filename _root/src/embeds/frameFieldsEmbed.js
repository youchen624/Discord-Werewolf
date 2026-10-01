function getEmbed(interaction, data) {
    const embed = {
        "title": data?.title,
        "description": data?.description,
        "image": { url: data?.image },
        "color": data?.color ?? 2326507,
        /*
        data.fields = [
            {
                "name": "名字",
                "value": `內容`,
                "inline": false,
            }
        ];
        */
        "fields": data?.fields,
        "footer": {
            "text": "歪喵團隊製作",
            "icon_url": interaction.client.user.displayAvatarURL({ format: 'png', size: 512 }),
        },
        "timestamp": new Date(),
    };
    return embed;
};
module.exports = getEmbed