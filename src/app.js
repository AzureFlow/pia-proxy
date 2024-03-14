import * as pia from "./pia.js";
import fetch from "node-fetch";


const PIA_USERNAME = process.argv[2];
const PIA_PASSWORD = process.argv[3];

const servers = await pia.getServers();
const server = servers.filter(x => x.iso === "DE")[0].ping;
console.log("server:", server);
const proxyAgent = await pia.getProxy(server, PIA_USERNAME, PIA_PASSWORD);


console.log("IP Info:", await (await fetch("https://ifconfig.co/json", {
	agent: proxyAgent,
})).json());