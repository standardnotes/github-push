(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

angular.module('app', []);class HomeCtrl {
  constructor($rootScope, $scope, $timeout) {

    $scope.formData = { loading: true, pushStatus: "Push Changes" };

    let componentManager = new window.ComponentManager(true, function () {
      $scope.formData.loading = false;
      $scope.onReady();
    });

    let defaultHeight = 50;

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
          $scope.repos = repos;
          $scope.formData.loadingRepos = false;
          $scope.loadRepoDataForCurrentNote();
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
      var message = $scope.formData.commitMessage || `Updated note '${$scope.note.content.title}'`;

      var fileExtension = $scope.formData.fileExtension;
      if (!$scope.defaultFileExtension) {
        // set this as default
        console.log("Setting as default file ext", fileExtension);
        componentManager.setComponentDataValueForKey("defaultFileExtension", fileExtension);
        $scope.defaultFileExtension = fileExtension;
      }

      if (fileExtension !== $scope.noteFileExtension) {
        // set this ext for this note
        console.log("Setting as note file ext", fileExtension);
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
        console.log("Write file", err, result);
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
  }
}

// required for FireFox
HomeCtrl.$$ngIsClass = true;

angular.module('app').controller('HomeCtrl', HomeCtrl);


},{}]},{},[1]);
