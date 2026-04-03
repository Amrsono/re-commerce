"use strict";
const client = require("@prisma/client");
const adapterPg = require("@prisma/adapter-pg");
module.exports = { ...client, PrismaPg: adapterPg.PrismaPg };