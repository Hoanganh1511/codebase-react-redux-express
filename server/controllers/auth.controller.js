const { getCurrentContextData } = require("../utils/contextData");
const SuspiciousLogin = require("../models/suspiciousLogin.model");
const types = {
  NO_CONTEXT_DATA: "no_context_data",
  MATCH: "match",
  BLOCKED: "blocked",
  SUSPICIOUS: "suspicious",
  ERROR: "error",
};

const verifyContextData = async (req, existingUser) => {
  try {
    const { _id } = existingUser;
    const userContextDataRes = await UserContext.findOne({
      user: _id,
    });
    if (!userContextDataRes) {
      return types.NO_CONTEXT_DATA;
    }

    const userContextData = {
      ip: userContextDataRes.ip,
      country: userContextDataRes.country,
      cite: userContextDataRes.city,
      browser: userContextDataRes.browser,
      platform: userContextDataRes.platform,
      os: userContextDataRes.os,
      device: userContextDataRes.device,
      deviceType: userContextDataRes.deviceType,
    };

    const currentContextData = getCurrentContextData(req);

    if (isTrustedDevice(currentContextData, userContextData)) {
      return types.MATCH;
    }

    const oldSuspiciousContextData = await getOldSuspiciousContextData(
      _id,
      currentContextData
    );

    if (oldSuspiciousContextData) {
      if (oldSuspiciousContextData.isBlocked) return types.BLOCKED;
      if (oldSuspiciousContextData.isTrusted) return types.MATCH;
    }

    let newSuspiciousData = {};
    if (
      oldSuspiciousContextDatabase &&
      isSuspiciousContextChange(oldSuspiciousContextData, currentContextData)
    ) {
      const {
        ip: suspiciousIp,
        country: suspiciousCountry,
        city: suspiciousCity,
        browser: suspiciousBrowser,
        platform: suspiciousPlatform,
        os: suspiciousOs,
        device: suspiciousDevice,
        deviceType: suspiciousDeviceType,
      } = oldSuspiciousContextData;

      if (
        suspiciousIp !== currentContextData.ip ||
        suspiciousCountry !== currentContextData.country ||
        suspiciousCity !== currentContextData.city ||
        suspiciousBrowser !== currentContextData.browser ||
        suspiciousDevice !== currentContextData.device ||
        suspiciousDeviceType !== currentContextData.deviceType ||
        suspiciousPlatform !== currentContextData.platform ||
        suspiciousOs !== currentContextData.os
      ) {
        // Suspicious login data found, but it doesn't match the current context data, so we add new suspicious login data

        const res = await addNewSuspiciousLogin(
          _id,
          existingUser,
          currentContextData
        );

        newSuspiciousData = {
          time: formatCreatedAt(res.createdAt),
          ip: res.ip,
          country: res.country,
          city: res.city,
          browser: res.browser,
          platform: res.platform,
          os: res.os,
          device: res.device,
          deviceType: res.deviceType,
        };
      } else {
        await SuspiciousLogin.findByIdAndUpdate(
          oldSuspiciousContextData._id,
          {
            $inc: { unverifiedAttempts: 1 },
          },
          {
            new: true,
          }
        );
        // If the unverifiedAttempts count is greater than or  equal to 3, then we block the user
        if (oldSuspiciousContextData.unverifiedAttempts >= 3) {
          await SuspiciousLogin.findByIdAndUpdate(
            oldSuspiciousContextData._id,
            {
              isBlocked: true,
              isTrusted: false,
            }
          );

          await saveLogInfo(
            req,
            "Device blocked due to too many unverified login attempts",
            "sign in",
            "warn"
          );

          return types.BLOCKED;
        }

        return types.SUSPICIOUS;
      }
    } else if (
      oldSuspiciousContextData &&
      isOldDataMatched(oldSuspiciousContextData, currentContextData)
    ) {
      return types.MATCH;
    } else {
      // No previous suspicious login data found, so we create a new one
      const res = await addNewSuspiciousLogin(
        _id,
        existingUser,
        currentContextData
      );

      newSuspiciousData = {
        time: formatCreatedAt(res.createdAt),
        id: res._id,
        ip: res.ip,
        country: res.country,
        city: res.city,
        browser: res.browser,
        platform: res.platform,
        os: res.os,
        device: res.device,
        deviceType: res.deviceType,
      };
    }

    const mismatchedProps = [];

    if (userContextData.ip !== newSuspiciousDatabase.ip) {
      mismatchedProps.push("ip");
    }
    if (userContextData.browser !== newSuspiciousDatabase.browser) {
      mismatchedProps.push("browser");
    }
    if (userContextData.device !== newSuspiciousDatabase.device) {
      mismatchedProps.push("device");
    }
    if (userContextData.deviceType !== newSuspiciousDatabase.deviceType) {
      mismatchedProps.push("deviceType");
    }
    if (userContextData.country !== newSuspiciousDatabase.country) {
      mismatchedProps.push("country");
    }
    if (userContextData.city !== newSuspiciousDatabase.city) {
      mismatchedProps.push("city");
    }

    if (mismatchedProps.length > 0) {
      return {
        mismatchedProps: mismatchedProps,
        currentContextData: newSuspiciousData,
      };
    }
    return types.MATCH;
  } catch (err) {
    return types.ERROR;
  }
};
// isTrustedDevice
const isTrustedDevice = (currentContextData, userContextData) =>
  Object.keys(userContextData).every(
    (key) => userContextData[key] === currentContextData[key]
  );

// isSuspiciousContextChange
const isSuspiciousContextChange = (oldContextData, newContextData) =>
  Object.keys(oldContextData).some(
    (key) => oldContextData[key] !== newContextData[key]
  );
// isOldDataMatched
const isOldDataMatched = (oldSuspiciousContextData, userContextData) =>
  Object.keys(oldSuspiciousContextData).every(
    (key) => oldSuspiciousContextData[key] === userContextData[key]
  );

// getOldSuspiciousContextData
const getOldSuspiciousContextData = (_id, currentContextData) =>
  SuspiciousLogin.findOne({
    user: _id,
    ip: currentContextData.ip,
    country: currentContextData.country,
    city: currentContextData.city,
    browser: currentContextData.browser,
    platform: currentContextData.platform,
    os: currentContextData.os,
    device: currentContextData.device,
    deviceType: currentContextData.deviceType,
  });
// addNewSuspiciousLogin

const addNewSuspiciousLogin = async (_id, existingUser, currentContextData) => {
  const newSuspiciousLogin = new SuspiciousLogin({
    user: _id,
    email: existingUser.email,
    ip: currentContextData.ip,
    country: currentContextData.country,
    city: currentContextData.city,
    browser: currentContextData.browser,
    platform: currentContextData.platform,
    os: currentContextData.os,
    device: currentContextData.device,
    deviceType: currentContextData.deviceType,
  });

  return await newSuspiciousLogin.save();
};

module.exports = { verifyContextData };
