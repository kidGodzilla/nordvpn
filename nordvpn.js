'use strict';

const { countries } = require('./nordvpn-config');
const cli = require('./cli');
const { get } = require("./request");
const logger = require("./logger");
const fs = require('fs');
const util = require('util');

const writeFile = util.promisify(fs.writeFile);


async function selectCountry() {
  return await cli.autocomplete(countries.map(x => x.name));
}

function getCountryId(countryName) {
  const countryInfo = countries.find(x => x.name === countryName);
  if (countryInfo) {
    return countryInfo.id;
  }
}

function randomItem(a) {
  return a[Math.floor(Math.random() * a.length)]
}

async function getBestServer(countryId) {
  //let url = `https://api.nordvpn.com/v1/servers/recommendations?filters\[country_id\]=${countryId}&limit=1`;
  let url = `https://api.nordvpn.com/v1/servers/recommendations`;

  const servers = await get(url, true);

  if (servers && Array.isArray(servers)) {
    return randomItem(servers);
  }
}

async function getOpenVpnConfig(server) {
  const protocols = [];

  server.technologies.forEach(protocol => {
    if (protocol.identifier.indexOf('tcp') > -1) {
      protocols.push('tcp');
    }
    else if (protocol.identifier.indexOf('udp') > -1) {
      protocols.push('udp');
    }
  });

  const protocol = await cli.autocomplete(protocols);

  return get(`https://downloads.nordcdn.com/configs/files/ovpn_${protocol}/servers/${server.hostname}.${protocol}.ovpn`, false);
}

function applyAuth(ovpnConfig, authPath) {
  return ovpnConfig.replace("auth-user-pass", `auth-user-pass ${authPath}`);
}

async function setupOpenVpn(configPath, authPath) {
  // const country = await selectCountry();
  // const countryId = getCountryId(country);
  const server = await getBestServer(); // countryId
  let ovpnConfig = await getOpenVpnConfig(server);
  ovpnConfig = applyAuth(ovpnConfig, authPath);
  await writeFile(configPath, ovpnConfig);

  logger.info("**************** Selected Server *****************");
  logger.info(`Name:     ${server.name}`);
  logger.info(`hostname: ${server.hostname}`);
  logger.info(`Load:     ${server.load}`);
  logger.info("**************************************************");
}

module.exports = {
  setupOpenVpn
};
