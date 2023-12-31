const Log = require("../../models/log.model");
const { getCurrentContextData } = require("../../utils/contextData");

const saveLogInfo = async (req, message, type, level) => {
  try {
    let context = null;

    if (req) {
      const { ip, country, city, browser, platform, os, device, deviceType } =
        getCurrentContextData(req);

      context = `IP: ${ip}, Country: ${country}, City: ${city}, DeviceType : ${deviceType}, Browser: ${browser}, Platform :${platform}, OS: ${os}, Device: ${device}`;

      const log = new Log({
        email: req ? req.body.email : null,
        context,
        message,
        type,
        level,
      });
      await log.save();
    }
  } catch (err) {
    console.log(err);
  }
};

module.exports = { saveLogInfo };
