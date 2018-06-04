const Discord = require('discord.js');
exports.run = (client, message, args) => {
    var embed = new Discord.RichEmbed() 
        .setTitle(`__Sent Help List for ${message.author.username}__`)
        .setDescription('``Fouded 40 commands in Ayerety.``')
        .setAuthor('Ayerety', client.user.avatarURL)
        .setFooter(`Requested By ${message.author.username}#${message.author.discriminator}`)
        .setColor("#ffffff")
        .addField(':pushpin: About Bot', `
**Prefix: &
Owner: RealSparky#3858
Team: Coders Of Discord**`)
            .addField(':gear: Commands For Bot Owners', `
bash > **Searches files in memory.**
restart > **Restarting bot.**
stats > **Displaying bot statistics.**
play > **Changing game staus**
stream > **Changing stream status.**
watch > **Changin watch status.**`)
        .addField(':hourglass: Commands For Help', `
help > **Sending help list.**
botinfo > **Sending info about Ayrety.**
avatar > **Shows your/others avatar.**
serverinfo > **Shows info about server.**
weather > **Predicting the weather.**
invite > **Creates an invitation to the server.**
membercount > **Counting members on the server.**
hastebin > **Transfer your text to Hastebin.**
emoji > **Shows all emojis on the server.**`)
        .addField(':bow_and_arrow: Commands For Fun', `
cat > **Sending photos with a cat.**
dog > **Sending photos with a dog.**
candy > **Giving someone candy with mention.**
meme > **Sending meme in chat.**
joke > **Sending Dads Joke in chat.**
ping > **Playing a game.**
8ball > **Predicts the future.**
coinflip > **Playing with coin.**
pat > **Pating someone with mention.**
gif > **Sending to your DM's a gif image.**
ascii > **Creating art with your word or sentence.**`)
        .addField(':wrench: Commands For Moderate', `
ban > **Baning violators.**
unban > **Unbaning violators.**
warn > **Creating warning fot violators.**
kick > **Kicking violators.**
report > **Reporting violators.**
clean > **Cleaning spam messages.**`)
        .addField(':headphones: Commands For Music', `
mplay > **Sends a selection of songs.**
mstop > **Stoping the song and leaving song channel.**
mskip > **Skipping the song.**
mpause > **Pausing the song.**
mresume > **Contining the song.**
mvolume > **Changing volume in the song.**
mqueue > **Showing a queue of songs.**
mnp > **Displays info about playing music.**`)
        .addField(':iphone: References', `
**Invite Me:
https://discordapp.com/api/oauth2/authorize?client_id=443720012096733184&permissions=2146958583&scope=bot**
**Support:
https://discord.gg/w2ucYmm** `);

    message.author.send({ embed });
  message.channel.send(`**Check your DM's ${message.author}!**`);
}        
