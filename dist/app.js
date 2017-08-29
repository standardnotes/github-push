(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

(function e(t, n, r) {
  function s(o, u) {
    if (!n[o]) {
      if (!t[o]) {
        var a = typeof require == "function" && require;if (!u && a) return a(o, !0);if (i) return i(o, !0);var f = new Error("Cannot find module '" + o + "'");throw f.code = "MODULE_NOT_FOUND", f;
      }var l = n[o] = { exports: {} };t[o][0].call(l.exports, function (e) {
        var n = t[o][1][e];return s(n ? n : e);
      }, l, l.exports, e, t, n, r);
    }return n[o].exports;
  }var i = typeof require == "function" && require;for (var o = 0; o < r.length; o++) {
    s(r[o]);
  }return s;
})({ 1: [function (require, module, exports) {
    var ComponentManager = function () {
      function ComponentManager(permissions, onReady) {
        _classCallCheck(this, ComponentManager);

        this.sentMessages = [];
        this.messageQueue = [];
        this.permissions = permissions;
        this.loggingEnabled = false;
        this.onReadyCallback = onReady;

        window.addEventListener("message", function (event) {
          if (this.loggingEnabled) {
            console.log("Components API Message received:", event.data);
          }
          this.handleMessage(event.data);
        }.bind(this), false);
      }

      _createClass(ComponentManager, [{
        key: "handleMessage",
        value: function handleMessage(payload) {
          if (payload.action === "component-registered") {
            this.sessionKey = payload.sessionKey;
            this.componentData = payload.componentData;
            this.onReady();

            if (this.loggingEnabled) {
              console.log("Component successfully registered with payload:", payload);
            }
          } else if (payload.action === "themes") {
            this.activateThemes(payload.data.themes);
          } else if (payload.original) {
            // get callback from queue
            var originalMessage = this.sentMessages.filter(function (message) {
              return message.messageId === payload.original.messageId;
            })[0];

            if (originalMessage.callback) {
              originalMessage.callback(payload.data);
            }
          }
        }
      }, {
        key: "onReady",
        value: function onReady() {
          var _iteratorNormalCompletion = true;
          var _didIteratorError = false;
          var _iteratorError = undefined;

          try {
            for (var _iterator = this.messageQueue[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
              var message = _step.value;

              this.postMessage(message.action, message.data, message.callback);
            }
          } catch (err) {
            _didIteratorError = true;
            _iteratorError = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion && _iterator.return) {
                _iterator.return();
              }
            } finally {
              if (_didIteratorError) {
                throw _iteratorError;
              }
            }
          }

          this.messageQueue = [];

          if (this.onReadyCallback) {
            this.onReadyCallback();
          }
        }
      }, {
        key: "setComponentDataValueForKey",
        value: function setComponentDataValueForKey(key, value) {
          this.componentData[key] = value;
          this.postMessage("set-component-data", { componentData: this.componentData }, function (data) {});
        }
      }, {
        key: "clearComponentData",
        value: function clearComponentData() {
          this.componentData = {};
          this.postMessage("set-component-data", { componentData: this.componentData }, function (data) {});
        }
      }, {
        key: "componentDataValueForKey",
        value: function componentDataValueForKey(key) {
          return this.componentData[key];
        }
      }, {
        key: "postMessage",
        value: function postMessage(action, data, callback) {
          if (!this.sessionKey) {
            this.messageQueue.push({
              action: action,
              data: data,
              callback: callback
            });
            return;
          }

          var message = {
            action: action,
            data: data,
            messageId: this.generateUUID(),
            sessionKey: this.sessionKey,
            permissions: this.permissions,
            api: "component"
          };

          var sentMessage = JSON.parse(JSON.stringify(message));
          sentMessage.callback = callback;
          this.sentMessages.push(sentMessage);

          if (this.loggingEnabled) {
            console.log("Posting message:", message);
          }

          window.parent.postMessage(message, '*');
        }
      }, {
        key: "setSize",
        value: function setSize(type, width, height) {
          this.postMessage("set-size", { type: type, width: width, height: height }, function (data) {});
        }
      }, {
        key: "streamItems",
        value: function streamItems(callback) {
          this.postMessage("stream-items", { content_types: ["Tag"] }, function (data) {
            var tags = data.items;
            callback(tags);
          }.bind(this));
        }
      }, {
        key: "streamContextItem",
        value: function streamContextItem(callback) {
          this.postMessage("stream-context-item", null, function (data) {
            var item = data.item;
            callback(item);
          }.bind(this));
        }
      }, {
        key: "selectItem",
        value: function selectItem(item) {
          this.postMessage("select-item", { item: this.jsonObjectForItem(item) });
        }
      }, {
        key: "createItem",
        value: function createItem(item) {
          this.postMessage("create-item", { item: this.jsonObjectForItem(item) }, function (data) {
            var item = data.item;
            this.associateItem(item);
          }.bind(this));
        }
      }, {
        key: "associateItem",
        value: function associateItem(item) {
          this.postMessage("associate-item", { item: this.jsonObjectForItem(item) });
        }
      }, {
        key: "deassociateItem",
        value: function deassociateItem(item) {
          this.postMessage("deassociate-item", { item: this.jsonObjectForItem(item) });
        }
      }, {
        key: "clearSelection",
        value: function clearSelection() {
          this.postMessage("clear-selection", { content_type: "Tag" });
        }
      }, {
        key: "deleteItem",
        value: function deleteItem(item) {
          this.deleteItems([item]);
        }
      }, {
        key: "deleteItems",
        value: function deleteItems(items) {
          var params = {
            items: items.map(function (item) {
              return this.jsonObjectForItem(item);
            }.bind(this))
          };
          this.postMessage("delete-items", params);
        }
      }, {
        key: "saveItem",
        value: function saveItem(item) {
          this.saveItems([item]);
        }
      }, {
        key: "saveItems",
        value: function saveItems(items) {
          items = items.map(function (item) {
            return this.jsonObjectForItem(item);
          }.bind(this));

          this.postMessage("save-items", { items: items }, function (data) {});
        }
      }, {
        key: "jsonObjectForItem",
        value: function jsonObjectForItem(item) {
          var copy = Object.assign({}, item);
          copy.children = null;
          copy.parent = null;
          return copy;
        }

        /* Themes */

      }, {
        key: "activateThemes",
        value: function activateThemes(urls) {
          this.deactivateAllCustomThemes();

          if (this.loggingEnabled) {
            console.log("Activating themes:", urls);
          }

          if (!urls) {
            return;
          }

          var _iteratorNormalCompletion2 = true;
          var _didIteratorError2 = false;
          var _iteratorError2 = undefined;

          try {
            for (var _iterator2 = urls[Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
              var url = _step2.value;

              if (!url) {
                continue;
              }

              var link = document.createElement("link");
              link.href = url;
              link.type = "text/css";
              link.rel = "stylesheet";
              link.media = "screen,print";
              link.className = "custom-theme";
              document.getElementsByTagName("head")[0].appendChild(link);
            }
          } catch (err) {
            _didIteratorError2 = true;
            _iteratorError2 = err;
          } finally {
            try {
              if (!_iteratorNormalCompletion2 && _iterator2.return) {
                _iterator2.return();
              }
            } finally {
              if (_didIteratorError2) {
                throw _iteratorError2;
              }
            }
          }
        }
      }, {
        key: "deactivateAllCustomThemes",
        value: function deactivateAllCustomThemes() {
          var elements = document.getElementsByClassName("custom-theme");

          [].forEach.call(elements, function (element) {
            if (element) {
              element.disabled = true;
              element.parentNode.removeChild(element);
            }
          });
        }

        /* Utilities */

      }, {
        key: "generateUUID",
        value: function generateUUID() {
          var crypto = window.crypto || window.msCrypto;
          if (crypto) {
            var buf = new Uint32Array(4);
            crypto.getRandomValues(buf);
            var idx = -1;
            return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
              idx++;
              var r = buf[idx >> 3] >> idx % 8 * 4 & 15;
              var v = c == 'x' ? r : r & 0x3 | 0x8;
              return v.toString(16);
            });
          } else {
            var d = new Date().getTime();
            if (window.performance && typeof window.performance.now === "function") {
              d += performance.now(); //use high-precision timer if available
            }
            var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
              var r = (d + Math.random() * 16) % 16 | 0;
              d = Math.floor(d / 16);
              return (c == 'x' ? r : r & 0x3 | 0x8).toString(16);
            });
            return uuid;
          }
        }
      }]);

      return ComponentManager;
    }();

    window.ComponentManager = ComponentManager;
  }, {}] }, {}, [1]);
;'use strict';

angular.module('app', []);
var HomeCtrl = function HomeCtrl($rootScope, $scope, $timeout) {
  _classCallCheck(this, HomeCtrl);

  $scope.formData = { loading: true, pushStatus: "Push Changes" };

  var permissions = [{
    name: "stream-context-item"
  }];

  var componentManager = new window.ComponentManager(permissions, function () {
    $scope.formData.loading = false;
    $scope.onReady();
  });

  var defaultHeight = 50;

  componentManager.streamContextItem(function (item) {
    $timeout(function () {
      $scope.note = item;
      if ($scope.repos) {
        $scope.loadRepoDataForCurrentNote();
      }
    });
  });

  $scope.onReady = function () {
    $scope.token = componentManager.componentDataValueForKey("token");
    if ($scope.token) {
      $scope.onTokenSet();
    }
  };

  $scope.submitToken = function () {
    $scope.token = $scope.formData.token;
    componentManager.setComponentDataValueForKey("token", $scope.token);
    $scope.onTokenSet();
  };

  $scope.onTokenSet = function () {

    $scope.gh = new GitHub({
      token: $scope.token
    });

    var me = $scope.gh.getUser();
    $scope.formData.loadingRepos = true;

    me.listRepos(function (err, repos) {
      $timeout(function () {
        $scope.formData.loadingRepos = false;
        if (err) {
          alert("An error occurred with the GitHub Push extension. Make sure your GitHub token is valid and try again.");
          return;
        }
        $scope.repos = repos;
        if ($scope.note) {
          $scope.loadRepoDataForCurrentNote();
        }
      });
    });
  };

  $scope.loadRepoDataForCurrentNote = function () {
    var noteData = componentManager.componentDataValueForKey("notes") || {};
    var savedNote = noteData[$scope.note.uuid];
    if (savedNote) {
      // per note preference
      $scope.noteFileExtension = savedNote.fileExtension;
      $scope.selectRepoWithName(savedNote.repoName);
    } else {
      // default pref
      var defaultRepo = componentManager.componentDataValueForKey("defaultRepo");
      if (defaultRepo) {
        $scope.formData.hasDefaultRepo = true;
        $scope.selectRepoWithName(defaultRepo);
      }
    }

    $scope.defaultFileExtension = componentManager.componentDataValueForKey("defaultFileExtension");
    $scope.formData.fileExtension = $scope.noteFileExtension || $scope.defaultFileExtension || "txt";
  };

  $scope.selectRepoWithName = function (name) {
    $scope.formData.selectedRepo = $scope.repos.filter(function (repo) {
      return repo.name === name;
    })[0];
    $scope.didSelectRepo();
  };

  $scope.didSelectRepo = function () {
    var repo = $scope.formData.selectedRepo;
    $scope.selectedRepoObject = $scope.gh.getRepo(repo.owner.login, repo.name);

    // save this as default repo for this note
    $scope.setDataForNote("repoName", repo.name);

    // save this as default repo globally
    if (!$scope.formData.hasDefaultRepo) {
      componentManager.setComponentDataValueForKey("defaultRepo", repo.name);
    }
  };

  $scope.setDataForNote = function (key, value) {
    var notesData = componentManager.componentDataValueForKey("notes") || {};
    var noteData = notesData[$scope.note.uuid] || {};
    noteData[key] = value;
    notesData[$scope.note.uuid] = noteData;
    componentManager.setComponentDataValueForKey("notes", notesData);
  };

  $scope.pushChanges = function ($event) {
    $event.target.blur();
    var message = $scope.formData.commitMessage || "Updated note '" + $scope.note.content.title + "'";

    var fileExtension = $scope.formData.fileExtension;
    if (!$scope.defaultFileExtension) {
      // set this as default
      componentManager.setComponentDataValueForKey("defaultFileExtension", fileExtension);
      $scope.defaultFileExtension = fileExtension;
    }

    if (fileExtension !== $scope.noteFileExtension) {
      // set this ext for this note
      $scope.setDataForNote("fileExtension", fileExtension);
      $scope.noteFileExtension = fileExtension;
    }

    $scope.formData.pushStatus = "Pushing...";
    $scope.selectedRepoObject.writeFile("master", $scope.note.content.title + "." + fileExtension, $scope.note.content.text, message, { encode: true }, function (err, result) {
      $timeout(function () {
        if (!err) {
          $scope.formData.commitMessage = "";
          $scope.formData.pushStatus = "Success!";
          $timeout(function () {
            $scope.formData.pushStatus = "Push Changes";
          }, 1500);
        } else {
          alert("Something went wrong trying to push your changes.", +err);
        }
      });
    });
  };

  $scope.logout = function () {
    componentManager.clearComponentData();
    $scope.defaultFileExtension = null;
    $scope.noteFileExtension = null;
    $scope.selectedRepo = null;
    $scope.repos = null;
    $scope.token = null;
  };

  componentManager.setSize("container", "100%", defaultHeight);
};

// required for FireFox


HomeCtrl.$$ngIsClass = true;

angular.module('app').controller('HomeCtrl', HomeCtrl);


},{}]},{},[1]);
