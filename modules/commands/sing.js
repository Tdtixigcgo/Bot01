module.exports.config = {
    name: "sing",
    version: "1.0.0",
    hasPermssion: 0,
    credits: "MạnhG",
    description: "Phát nhạc thông qua link YouTube hoặc từ khoá tìm kiếm",
    commandCategory: "Phương tiện",
    usages: "[searchVideos]",
    cooldowns: 10,
    envConfig: {
        "ManhG_KEY": "mzkVip_9B4510479C899"
    }
};
var random = '12345ABCDE',
    number = 10,
    rdus = "singManhG_";
for (var i = 0; i < number; i++) {
    rdus += random.charAt(Math.floor(Math.random() * random.length));
}
module.exports.run = async function({ event, api, args, body }) {
    const axios = require("axios");
    const fs = require("fs-extra");
    var ManhG_KEY = global.configModule[this.config.name].ManhG_KEY;
    try {
        const { createReadStream, createWriteStream, unlinkSync, statSync } = require("fs-extra");
        let key_api = (await axios.get(`http://mzkapi.me/adminkey?key=${ManhG_KEY}`)).data;
        if (key_api.status != true) return api.sendMessage(`${key_api.msg}`, event.threadID, event.messageID);
        if (args.length == 0 || !args) return api.sendMessage('» Search cannot be left blank!', event.threadID, event.messageID);
        const keywordSearch = encodeURIComponent(args.join(" "));
        if (args.join(" ").indexOf("https://") == 0) {
            const linkurl = args.join(" ").trim();
            try {
                let link, desc, resErr, dataErr;
                let res = await axios.get(`http://mzkapi.me/sing?link=${linkurl}&apikey=${ManhG_KEY}`);
                let data = res.data;
                if (data.link == undefined) {
                    resErr = await axios.get(`http://mzkapi.me/video?link=${linkurl}&apikey=${ManhG_KEY}`);
                    dataErr = resErr.data;
                    desc = dataErr.title;
                    link = dataErr.link.audio[0];
                } else {
                    desc = data.title;
                    link = data.link;
                }
                var path1 = __dirname + `/cache/${rdus}.mp3`;
                const getms = (await axios.get(link.toString().trim(), { responseType: "arraybuffer" })).data;
                fs.writeFileSync(path1, Buffer.from(getms, "utf-8"));
                if (fs.statSync(__dirname + `/cache/${rdus}.mp3`).size > 104000000) return api.sendMessage('File cannot be sent because it is larger than 100MB.', event.threadID, () => unlinkSync(__dirname + `/cache/${rdus}.mp3`), event.messageID);
                else return api.sendMessage({ body: desc, attachment: fs.createReadStream(__dirname + `/cache/${rdus}.mp3`) }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/${rdus}.mp3`), event.messageID)
            } catch (e) {
                console.log(e);
                return api.sendMessage('Your request could not be processed!', event.threadID, event.messageID);
            }
        } else {
            try {
                var results = [],
                    link = [],
                    msg = "",
                    num = 0;
                var value;
                results = (await axios.get(`http://mzkapi.me/youtube?q=${keywordSearch}&apikey=${ManhG_KEY}`)).data.results;

                for (let key in results) {
                    if (results[key].video != undefined) {
                        value = (results[key].video);
                        if (value.duration.length < 5 && value.duration != "Live") {
                            num = num += 1;
                            link.push(value.id);
                            let time = value.duration;
                            msg += (`${num}.《${time}》 ${value.title}\n\n`);
                        }
                    }
                }
                var body = `»🔎 There are ${link.length} results matching your search keyword:\n\n${msg}» Please reply (feedback) choose one of the above searches.`;
                return api.sendMessage({
                        body: body
                    }, event.threadID, (error, info) => {
                        client.handleReply.push({
                            name: this.config.name,
                            messageID: info.messageID,
                            author: event.senderID,
                            idYT: link
                        })
                    },
                    event.messageID);
            } catch (error) {
                return api.sendMessage("The request could not be processed due to an error: " + error.message, event.threadID, event.messageID);
            }
        }
    } catch (ex) {
        console.log(ex);
        return;
    }
}

module.exports.handleReply = async function({ event, api, handleReply }) {
    const axios = require('axios')
    const fs = require("fs-extra");
    const request = require("request");
    var ManhG_KEY = global.configModule[this.config.name].ManhG_KEY;
    const { createReadStream, createWriteStream, unlinkSync, statSync } = require("fs-extra");
    var rqx = event.body;

    function number(x) {
        if (isNaN(x)) {
            return 'Not a Number!';
        }
        return (x < 1 || x > 20);
    }
    if (number(rqx)) return api.sendMessage('Choose from 1 -> 20, baby. love uwu ❤️', event.threadID, event.messageID);
    api.unsendMessage(handleReply.messageID);
    api.sendMessage(`Audio processing, please wait...`, event.threadID, (err, info) => setTimeout(() => { api.unsendMessage(info.messageID) }, 20000));
    try {
        let link, desc;
        let res = await axios.get(`http://mzkapi.me/sing?link=http://youtu.be/${handleReply.idYT[event.body - 1]}&apikey=${ManhG_KEY}`);
        let data = res.data;
        if (data.link == undefined) {
            let resErr = await axios.get(`http://mzkapi.me/video?link=http://youtu.be/${handleReply.idYT[event.body - 1]}&apikey=${ManhG_KEY}`);
            let dataErr = resErr.data;
            desc = dataErr.title;
            link = dataErr.link.audio[0];
        } else {
            desc = data.title;
            link = data.link;
        }
        var path1 = __dirname + `/cache/${rdus}.mp3`;
        const getms = (await axios.get(link.toString().trim(), { responseType: "arraybuffer" })).data;
        fs.writeFileSync(path1, Buffer.from(getms, "utf-8"));
        if (fs.statSync(__dirname + `/cache/${rdus}.mp3`).size > 104000000) return api.sendMessage('File cannot be sent because it is larger than 100MB.', event.threadID, () => unlinkSync(__dirname + `/cache/${rdus}.mp3`), event.messageID);
        else return api.sendMessage({ body: desc, attachment: fs.createReadStream(__dirname + `/cache/${rdus}.mp3`) }, event.threadID, () => fs.unlinkSync(__dirname + `/cache/${rdus}.mp3`), event.messageID)
    } catch (e) {
        console.log(e);
        return api.sendMessage('Your request could not be processed!', event.threadID, event.messageID);
    }
                    }
