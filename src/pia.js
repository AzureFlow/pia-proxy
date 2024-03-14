import fetch from "node-fetch";
import {HttpsProxyAgent} from "https-proxy-agent";


/**
 * @param {string} server
 * @param {string} username
 * @param {string} password
 * @returns {Promise<Agent>}
 */
export async function getProxy(server, username, password) {
	const token = await getAuth(username, password);

	const tokenUser = token.substring(0, token.length / 2);
	const tokenPass = token.substring(token.length / 2);

	return new HttpsProxyAgent(`https://${tokenUser}:${tokenPass}@${server}`, {
		rejectUnauthorized: false,
	});
}

/**
 * @typedef {object} ServerItem
 * @property {string} name Region name
 * @property {string} iso Two letter country code.
 * @property {string} dns Internal DNS thing.
 * @property {string} ping IP address.
 * @property {number} port Proxy port.
 * @property {number} mace
 */

/**
 *
 * @returns {Promise<ServerItem[]>}
 */
export async function getServers() {
	const serversResp = await fetch("https://serverlist.piaservers.net/proxy");
	return serversResp.json();
}

/**
 *
 * @param {string} username
 * @param {string} password
 * @returns {Promise<string>}
 */
export async function getAuth(username, password) {
	const authResp = await fetch("https://www.privateinternetaccess.com/api/client/v2/token", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			username,
			password,
		}),
	});

	if(!authResp.ok) {
		throw new Error("Auth error:" + await authResp.text());
	}

	const {token} = await authResp.json();

	return token;
}

