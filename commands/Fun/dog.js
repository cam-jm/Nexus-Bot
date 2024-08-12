const querystring = require('querystring');
const r2 = require('r2');
const Discord = require('discord.js')
const API_URL = 'https://api.thedogapi.com/';
const API_KEY = '00969cdb-1de8-4e2c-974e-4b3e7904e9b7'; // get a free key from - https://thedogapi.com/signup

module.exports = {
    name: 'dog',
    description: 'Get a picture of a dog',
    aliases: ['doggo'],
    args: 0,
	cooldown: 5,
	guildOnly: false,
	essential: false,
    async execute(message, args, client) {
        try {
            msg = message.channel.send(`${client.emojis.cache.get("742972016679845929")}`)
                .then(msg => {
                    msg.delete({
                        timeout: 2000
                    })
                })
            // pass the name of the user who sent the message for stats later, expect an array of images to be returned.
            var images = await loadImage(message.author.username);

            // get the Image, and first Breed from the returned object.
            var image = images[0];
            var breed = image.breeds[0];

            log(`message processed: ${breed},`)
            //message.channel.send("***" + breed.name + "*** \r *" + breed.temperament + "*", { files: [image.url] });
            // if you didn't want to see the text, just send the file
            const animalEmbed = new Discord.MessageEmbed()
                .setTitle('Good doggo')
                .setDescription('Admire this randomly selected picture of a dog.')
                .addFields(
                    { name: 'Breed', value: `\`\`\`${breed.name}\`\`\``},
                    {name: 'Temperament', value: `\`\`\`${breed.temperament}\`\`\``},
                )
                .setFooter('Powered by TheDogAPI.')
                .setImage(image.url)
                message.channel.send(animalEmbed);
        } catch (err) {
            log(err,'error')
        }
    },
};

async function loadImage(sub_id) {
    // you need an API key to get access to all the iamges, or see the requests you've made in the stats for your account
    var headers = {
        'X-API-KEY': API_KEY,
    }
    var query_params = {
        'has_breeds': true, // we only want images with at least one breed data object - name, temperament etc
        'mime_types': 'jpg,png', // we only want static images as Discord doesn't like gifs
        'size': 'small',   // get the small images as the size is prefect for Discord's 390x256 limit
        'sub_id': sub_id, // pass the message senders username so you can see how many images each user has asked for in the stats
        'limit': 1       // only need one
    }
    // convert this obejc to query string 
    let queryString = querystring.stringify(query_params);

    try {
        // construct the API Get request url
        let _url = API_URL + `v1/images/search?${queryString}`;
        // make the request passing the url, and headers object which contains the API_KEY
        var response = await r2.get(_url, { headers }).json
    } catch (e) {
        console.log(e)
    }
    return response;

}