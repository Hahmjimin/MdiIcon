module.exports = function (RED) {
  const Redis = require("ioredis");

  // 연결된 Redis 클라이언트를 저장하기 위한 객체
  let connections = {};

  // Redis 연결 생성 및 반환하는 함수
  function getConn(config, id) {
    const options = config.options || {}; // 필요에 따라 옵션 설정
    const client = new Redis(options);
    connections[id] = client;
    return client;
  }

  // Redis 연결 해제하는 함수
  function disconnect(id) {
    const client = connections[id];
    if (client) {
      client.disconnect();
      delete connections[id];
    }
  }

  function OrderConfig(config) {
    RED.nodes.createNode(this, config);
    this.name = config.name;
    if (this.optionsType === "") {
      this.options = config.options;
    } else {
      this.options = RED.util.evaluateNodeProperty(
        config.options,
        config.optionsType,
        this
      );
    }
  }
  RED.nodes.registerType("order-config", OrderConfig);

  function OrderIn(config) {
    RED.nodes.createNode(this, config);
    this.server = RED.nodes.getNode(config.server);
    this.command = config.command;
    this.name = config.name;
    this.topic = config.topic;
    this.obj = config.obj;
    this.timeout = config.timeout;

    let node = this;
    let client = getConn(node.server, config.id);

    node.on("close", function (done) {
      node.status({});
      disconnect(config.id);
      client = null;
      done();
    });

    if (node.command === "subscribe") {
      client.on("message", function (channel, message) {
        var payload = null;
        try {
          if (node.obj) {
            payload = JSON.parse(message);
          } else {
            payload = message;
          }
        } catch (err) {
          payload = message;
        } finally {
          node.send({
            topic: channel,
            payload: payload,
          });
        }
      });
      client[node.command](node.topic, (err, count) => {
        node.status({
          fill: "green",
          shape: "dot",
          text: "connected",
        });
      });
    }
  }
  RED.nodes.registerType("order-in", OrderIn);

  function OrderOut(config) {
    RED.nodes.createNode(this, config);
    this.server = RED.nodes.getNode(config.server);
    this.command = config.command;
    this.name = config.name;
    this.topic = config.topic;
    this.obj = config.obj;
    this.evenid = "30001";
    this.source = "";
    this.dest = "";
    this.recvchannel = "";
    this.recvid = "40001";
    this.ordertype = "";
    this.workzonecode = "";
    this.policy = "";
    this.sourcepolicy = "";
    this.destpolicy = "";
    this.resourcenum = "";
    this.priority1 = "";
    this.priority2 = "";
    this.waypoint = "";
    this.sender = "IoT G/W";
    this.item = "";

    var node = this;
    let client = getConn(node.server, config.id);

    node.on("close", function (done) {
      node.status({});
      disconnect(config.id);
      client = null;
      done();
    });
    node.on("input", function (msg, send, done) {
      console.log("Input received:", msg);
      var topic;
      send = send || function () {
        node.send.apply(node, arguments);
      };
      done = done || function (err) {
        if (err) node.error(err, msg);
      };
      if (msg.topic !== undefined && msg.topic !== "") {
        topic = msg.topic;
      } else {
        topic = node.topic;
      }
      if (topic === "") {
        done(new Error("Missing topic, please send topic on msg or set Topic on node."));
      } else {
        try {
          msg.payload = {
            EventId: node.evenid,
            Source: parseInt(node.source) || "",
            Dest: parseInt(node.dest) || "",
            RecvChannel: parseInt(node.recvchannel) || "",
            RecvId: node.recvid,
            OrderType: node.ordertype || "",
            WorkZoneCode: node || "",
            Policy: node.policy || "",
            SourcePolicy: node.sourcepolicy || "",
            DestPolicy: node.destpolicy || "",
            ResourceNum: parseInt(node.resourcenum) || "",
            Priority1: parseInt(node.priority1) || "",
            Priority2: parseInt(node.priority2) || "",
            WayPoint: parseInt(node.waypoint) || "",
            Sender: node.sender,
            Item: node.item || "",
          };
          if (node.obj) {
            client[node.command](topic, JSON.stringify(msg.payload));
          } else {
            client[node.command](topic, msg.payload);
          }
          done();
        } catch (err) {
          done(err);
        }
      }
    });    
  }
  RED.nodes.registerType("order-out", OrderOut);
};