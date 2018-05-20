const Discord = require('discord.js');
const client = new Discord.Client();
const superagent = require('superagent')
var servers = {};
client.on('ready', () => {
    client.user.setPresence({ game: { name: '&help || cookies', type: 0 } });
    console.log(`Sonex is ready to explore a new world!`);
});
    
var prefix = '&';
client.on("message", async message => {
    var args = message.content.substring(prefix.length).split(" ");
    if (!message.content.startsWith(prefix)) return;
    switch (args[0].toLowerCase()) {
        case "ping":
        var newemb = new Discord.RichEmbed()
.setColor(0x00AE86)
.addField('Pong! ```Latency: ```', new Date().getTime() - message.createdTimestamp + " ms ")
message.channel.send({embed: newemb})
        break;
        case "bing":
                    var newemb = new Discord.RichEmbed()
.setColor(0x00AE86)
.addField('Bong! ```Latency: ```', new Date().getTime() - message.createdTimestamp + " ms ")
message.channel.send({embed: newemb})
            break;
        case "cookie":
            message.channel.sendMessage("COOOKKIIIESSSSS!");
            break;
        case "gplay":
            var gamestr = args.join(" ").replace("play ", "");
            if (message.author.id === "378998523028307973" || message.author.id === "353271087758573578") {
                client.user.setPresence({ game: { name: gamestr, type: 0 } });
                message.reply("The game was set to " + gamestr);
            }
            else {
                message.reply("Access denied.");
            }
            break;
        case "8ball":
            var responses = [
                'Agreed!',
                'Of Course!',
                'Disagree.',
                'No',
                'Maybe',
                'Really?',
                'Cannot predict now.',
                'Yes!'
            ];
            var fetched = responses[Math.floor(Math.random() * responses.length)];
            var embed = new Discord.RichEmbed()
                .setColor(0x00AE86)
                .setFooter(fetched);
            message.channel.send({ embed });
            break;
        case "avatar":
            var user = message.mentions.users.first() || message.author;
            var embed = new Discord.RichEmbed()
                .setAuthor('Sonex', client.user.avatarURL)
                .setTitle('The Sonex steals avatars :D')
                .setDescription('[Avatar Link](' + user.avatarURL + ')')
                .setImage(user.displayAvatarURL)
                .setColor('#ffffff');
            message.channel.send({ embed });
            break;
        case "help":
            switch (args[1]) {
                case "avatar":
                    message.channel.send("Displays user's pfp.");
                    break;
                case "info":
                    message.channel.send('Prints information about a user. \nUsage: info [@mention]');
                    break;
                default:
                    var embed = new Discord.RichEmbed()
                        .setTitle('Help Console')
                        .addField("**Avatar**", "Displays user's pfp.", true)
                        .addField("**Help**", "Prints the help.", true)
                        .addField("**Info**", "Prints information about a user. \nUsage: info [@mention]", true)
                        .addField("**Commands for help**", "avatar, help, info, serverinfo, clean, weather", true)
                        .addField("**Сommands for entertainment**", "ping, bing, 8ball, cat, dog", true)
                        .addField("**Command for moderate**", "ban, kick, report")
                        .setAuthor('Sonex', client.user.avatarURL)
                        .setColor(0x00AE86);
                    message.channel.send({ embed });
                    break;
                           }
            break;
        case "info":
            var user = message.mentions.users.first() || message.author;
            var embed = new Discord.RichEmbed()
                .setThumbnail(user.avatarURL)
                .setColor(0x00AE86)
                .addField('ID', user.id, true)
                .addField('Username', user.username, true)
                .addField('Discriminator', user.discriminator, true)
                .addField('Status', user.presence.status, true)
                .addField('Bot?', user.bot, true)
                .addField('Created At', user.createdAt, true);
            message.channel.send({ embed });
            break;
        case "clean":
            if (isNaN(args[1])) return message.channel.send('**Please supply a valid amount of messages to purge**');
            if (args[1] > 100) return message.channel.send('**Please supply a number less than 100**');
            message.channel.bulkDelete(args[1]);
            message.channel.sendMessage(`**Cleaned ${args[1]} messages** :white_check_mark:`);
            break;
        case "serverinfo":
            var online = message.guild.members.filter(member => member.user.presence.status !== 'offline');
            var day = message.guild.createdAt.getDate();
            var month = 1 + message.guild.createdAt.getMonth();
            var year = message.guild.createdAt.getFullYear();
            var sicon = message.guild.iconURL;
            var embed = new Discord.RichEmbed()
                .setAuthor(message.guild.name, sicon)
                .setFooter('Server Created • ' + month + "." + day + "." + year)
                .setColor(0x00AE86)
                .setThumbnail(sicon)
                .addField('ID', message.guild.id, true)
                .addField('Name', message.guild.name, true)
                .addField('Owner', message.guild.owner.user.tag, true)
                .addField('Region', message.guild.region, true)
                .addField('Channels', message.guild.channels.size, true)
                .addField('Members', message.guild.memberCount, true)
                .addField('Humans', message.guild.memberCount - message.guild.members.filter(m => m.user.bot).size, true)
                .addField('Bots', message.guild.members.filter(m => m.user.bot).size, true)
                .addField('Online', online.size, true)
                .addField('Roles', message.guild.roles.size, true);
            message.channel.send({ embed });
            break;
        case "join":
    if (message.member.voiceChannel) {
      message.member.voiceChannel.join()
        .then(connection => { // Connection is an instance of VoiceConnection
          message.channel.sendMessage('**I have successfully connected to the channel!**');
        })
        .catch(console.log);
    } else {
      message.channel.sendMessage('**You need to join a voice channel first!**');
    }
        break;
        case "weather":
          var weather = require('weather-js');
          weather.find({search: args.join(" "), degreeType: 'C'}, function(err, result) {
      if (err) message.channel.send(err);
      if (result === undefined || result.length === 0) {
          message.channel.send('**Please enter a right location!**');
          return;
      }
      var current = result[0].current;
      var location = result[0].location;
      const embed = new Discord.RichEmbed()
          .setDescription(`**${current.skytext}**`)
          .setAuthor(`Weather for ${current.observationpoint}`)
          .setThumbnail(current.imageUrl)
          .setColor(0x00AE86)
          .addField('Timezone',`UTC${location.timezone}`, true)
          .addField('Degree Type',location.degreetype, true)
          .addField('Temperature',`${current.temperature} Degrees`, true)
          .addField('Feels Like', `${current.feelslike} Degrees`, true)
          .addField('Winds',current.winddisplay, true)
          .addField('Humidity', `${current.humidity}%`, true);
          message.channel.send({embed});
  });

        break;
        case "report":
    var rUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!rUser) return message.channel.send("**Couldn't find user.**");
    var rreason = args.join(" ").slice(22);

    var reportEmbed = new Discord.RichEmbed()
    .setDescription("Reports")
    .setColor(0x00AE86)
    .addField("Reported User", `${rUser} with ID: ${rUser.id}`)
    .addField("Reported By", `${message.author} with ID: ${message.author.id}`)
    .addField("Channel", message.channel)
    .addField("Time", message.createdAt)
    .addField("Reason", rreason);

    var reportschannel = message.guild.channels.find(`name`, "reports");
    if(!reportschannel) return message.channel.send("**Can't find reports channel.**");


    message.delete().catch(O_o=>{});
    reportschannel.send(reportEmbed);


    break;
    case "kick":
    var kUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!kUser) return message.channel.send("**Can't find user!**");
    var kReason = args.join(" ").slice(22);
    if(!message.member.hasPermission("MANAGE_MESSAGES")) return message.channel.send("**No can do pal!**");
    if(kUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("**That person can't be kicked!**");

    var kickEmbed = new Discord.RichEmbed()
    .setDescription("~Kick~")
    .setColor(0x00AE86)
    .addField("Kicked User", `${kUser} with ID ${kUser.id}`)
    .addField("Kicked By", `<@${message.author.id}> with ID ${message.author.id}`)
    .addField("Kicked In", message.channel)
    .addField("Tiime", message.createdAt)
    .addField("Reason", kReason);

    var kickChannel = message.guild.channels.find(`name`, "reports");
    if(!kickChannel) return message.channel.send("**Can't find reports channel.**");

    message.guild.member(kUser).kick(kReason);
    kickChannel.send(kickEmbed);


        break;
        case "ban":
    var bUser = message.guild.member(message.mentions.users.first() || message.guild.members.get(args[0]));
    if(!bUser) return message.channel.send("**Can't find user!**");
    var bReason = args.join(" ").slice(22);
    if(!message.member.hasPermission("MANAGE_MEMBERS")) return message.channel.send("No can do pal!");
    if(bUser.hasPermission("MANAGE_MESSAGES")) return message.channel.send("**That person can't be banned!**");

    var banEmbed = new Discord.RichEmbed()
    .setDescription("~Ban~")
    .setColor(0x00AE86)
    .addField("Banned User", `${bUser} with ID ${bUser.id}`)
    .addField("Banned By", `<@${message.author.id}> with ID ${message.author.id}`)
    .addField("Banned In", message.channel)
    .addField("Time", message.createdAt)
    .addField("Reason", bReason);

    var incidentchannel = message.guild.channels.find(`name`, "reports");
    if(!incidentchannel) return message.channel.send("**Can't find reports channel.**");

    message.guild.member(bUser).ban(bReason);
    incidentchannel.send(banEmbed)
        break;
      case "dog":
    var { body } = await superagent
    .get('https://dog.ceo/api/breeds/image/random');
    var embed = new Discord.RichEmbed()
    .setColor(0x00AE86)
    .setTitle("Woof :dog2:")
    .setImage(body.message)
    message.channel.send({embed});

   break;
      case "cat":
 var{body} = await superagent
  .get(`http://aws.random.cat/meow`);

  var embed = new Discord.RichEmbed()
  .setColor(0x00AE86)
  .setTitle("Cat 🐱")
  .setImage(body.file);

  message.channel.send({embed});
  break;
  default:
  break;
        message.channel.sendMessage('**Invalid command**');
    }
});
client.login("NDQzNzIwMDEyMDk2NzMzMTg0.Ddsk5A.LxWkjKT123OpaeKpdip7UYJXW9o");
