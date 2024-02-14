module.exports = function (RED) {
  "use strict";
  const Redis = require("ioredis");
  const async = require("async");
  let connections = {};

  function getConn(config, id) {
    const options = config.options || {};
    const client = new Redis(options);
    connections[id] = client;
    return client;
  }

  function disconnect(id) {
    const client = connections[id];
    if (client) {
      client.disconnect();
      delete connections[id];
    }
  }

  function OrderConfig(n) {
    RED.nodes.createNode(this, n);
    this.name = n.name;
    this.cluster = n.cluster;
    if (this.optionsType === "") {
      this.options = n.options;
    } else {
      this.options = RED.util.evaluateNodeProperty(
        n.options,
        n.optionsType,
        this
      );
    }
  }
  RED.nodes.registerType("order-config", OrderConfig);

  function OrderIn(n) {
    RED.nodes.createNode(this, n);
    this.server = RED.nodes.getNode(n.server);
    this.command = n.command;
    this.name = n.name;
    this.topic = n.topic;
    this.obj = n.obj;
    this.timeout = n.timeout;
    let node = this;
    let client = getConn(this.server, n.id);
    let running = true;

    node.on("close", async (undeploy, done) => {
      node.status({});
      disconnect(node.id);
      client = null;
      running = false;
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
    } else {
      async.whilst(
        (cb) => {
          cb(null, running);
        },
        (cb) => {
          client[node.command](node.topic, Number(node.timeout))
            .then((data) => {
              if (data !== null && data.length == 2) {
                var payload = null;
                try {
                  if (node.obj) {
                    payload = JSON.parse(data[1]);
                  } else {
                    payload = data[1];
                  }
                } catch (err) {
                  payload = data[1];
                } finally {
                  node.send({
                    topic: node.topic,
                    payload: payload,
                  });
                }
              }
              cb(null);
            })
            .catch((e) => {
              RED.log.info(e.message);
              running = false;
            });
        },
        () => {}
      );
    }
    node.status({
      fill: "green",
      shape: "dot",
      text: "connected",
    });
  }
  RED.nodes.registerType("order in", OrderIn);

  function OrderOut(n) {
    RED.nodes.createNode(this, n);
    this.server = RED.nodes.getNode(n.server);
    this.command = n.command;
    this.name = n.name;
    this.topic = n.topic;
    this.obj = n.obj;
    // tams parameter
    this.EventId = n.EventId;
    this.Source = n.Source;
    this.Dest = n.Dest;
    this.RecvChannel = n.RecvChannel;
    this.RecvId = n.RecvId;
    this.OrderType = n.OrderType;
    this.WorkZoneCode = n.WorkZoneCode;
    this.Policy = n.Policy;
    this.SourcePolicy = n.SourcePolicy;
    this.DestPolicy = n.DestPolicy;
    this.ResourceNum = n.ResourceNum;
    this.Priority1 = n.Priority1;
    this.Priority2 = n.Priority2;
    this.WayPoint = n.WayPoint;
    this.Sender = n.Sender;
    this.Item = n.Item;
    var node = this;

    let client = getConn(this.server, node.server.name);

    node.on("close", function (done) {
      node.status({});
      disconnect(node.server.name);
      client = null;
      done();
    });

    node.on("input", function (msg, send, done) {
      var topic;
      send =
        send ||
        function () {
          node.send.apply(node, arguments);
        };
      done =
        done ||
        function (err) {
          if (err) node.error(err, msg);
        };
      if (msg.topic !== undefined && msg.topic !== "") {
        topic = msg.topic;
      } else {
        topic = node.topic;
      }
      if (topic === "") {
        done(
          new Error(
            "Missing topic, please send topic on msg or set Topic on node."
          )
        );
      } else {
        try {
          msg.payload = {
            EventId: `${this.EventId}`,
            Source: `${this.Source}`,
            Dest: `${this.Dest}`,
            RecvChannel: `${this.RecvChannel}`,
            RecvId: `${this.RecvId}`,
            Payload: [
              {
                OrderType: `${this.OrderType}`,
                WorkZoneCode: `${this.WorkZoneCode}`,
                Policy: `${this.Policy}`,
                SourcePolicy: `${this.SourcePolicy}`,
                DestPolicy: `${this.DestPolicy}`,
                ResourceNum: `${this.ResourceNum}`,
                Priority1: `${this.Priority1}`,
                Priority2: `${this.Priority2}`,
                WayPoint: `${this.WayPoint}`,
                Sender: `${this.Sender}`,
                Item: `${this.Item}`,
              },
            ],
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
  RED.nodes.registerType("order out", OrderOut);
};
