module.exports.config = {
 name: "antiout",
 eventType: ["log:unsubscribe"],
 version: "0.0.1",
 credits: "DungUwU",
 description: "Listen events"
};

module.exports.run = async({ event, api, Threads, Users }) => {
   const moment = require("moment-timezone");
  var timeNow = moment.tz("Asia/Ho_Chi_Minh").format("HH:mm:ss")
 let data = (await Threads.getData(event.threadID)).data || {};
 if (data.antiout == false) return;
 if (event.logMessageData.leftParticipantFbId == api.getCurrentUserID()) return;
 const name = global.data.userName.get(event.logMessageData.leftParticipantFbId) || await Users.getNameUser(event.logMessageData.leftParticipantFbId);
 const type = (event.author == event.logMessageData.leftParticipantFbId) ? "tự rời" : "bị quản trị viên đá";
 if (type == "tự rời") {
  api.addUserToGroup(event.logMessageData.leftParticipantFbId, event.threadID, (error, info) => {
   if (error) {
    api.sendMessage(`==== [ 𝗔𝗡𝗧𝗜𝗢𝗨𝗧 ] ====\n⚠️ Đã phát hiện ${name} rời nhóm không lý do.\n❌ Trạng thái: Không thành công!\n━━━━━━━━━━━━━━━━━━\n⏱ Thời gian hiện tại: ${timeNow} \nHãy báo cáo với quản trị viên nhóm trước khi rời đi.`, event.threadID)
   } else api.sendMessage(`==== [ 𝗔𝗡𝗧𝗜𝗢𝗨𝗧 ] ====\n⚠️ Đã phát hiện ${name} rời nhóm không lý do.\n✅ Trạng thái: Thành công!\n━━━━━━━━━━━━━━━━━━\n⏱ Thời gian hiện tại: ${timeNow} \nHãy báo cáo với quản trị viên nhóm trước khi rời đi.`, event.threadID);
  })
 }
}
