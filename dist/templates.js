angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('directives/tag_cell.html',
    "<li>\r" +
    "\n" +
    "<div class='self' draggable='true' drop='onDrop' ng-class='{&#39;selected&#39; : tag.selected}' ng-click='selectTag()' tag-id='tag.uuid'>\r" +
    "\n" +
    "{{tag.displayTitle}}\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "</li>\r" +
    "\n" +
    "<li ng-if='tag.children'>\r" +
    "\n" +
    "<ul>\r" +
    "\n" +
    "<div change-parent='changeParent()' class='tag-cell' ng-repeat='child in tag.children' on-select='onSelect()' tag='child'></div>\r" +
    "\n" +
    "</ul>\r" +
    "\n" +
    "</li>\r" +
    "\n"
  );


  $templateCache.put('directives/tag_tree.html',
    "<div ng-if='tag'>\r" +
    "\n" +
    "<div class='self' draggable='true' drop='onDrop' is-draggable='!tag.master' ng-class='{&#39;selected&#39; : tag.selected}' ng-click='selectTag()' tag-id='tag.uuid'>\r" +
    "\n" +
    "<div class='info'>\r" +
    "\n" +
    "<div class='circle' ng-class='circleClassForTag(tag)'></div>\r" +
    "\n" +
    "<div class='title'>\r" +
    "\n" +
    "{{tag.displayTitle}}\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div ng-repeat='child in tag.children'>\r" +
    "\n" +
    "<div change-parent='changeParent()' class='tag-tree' on-select='onSelect()' tag='child'></div>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );


  $templateCache.put('home.html',
    "<div class='center-container body-text-color' ng-if='!formData.loading'>\r" +
    "\n" +
    "<div class='meta'>\r" +
    "\n" +
    "<div class='title'>GitHub Push</div>\r" +
    "\n" +
    "<a class='logout' ng-click='logout()' ng-if='token'>Logout</a>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class='section token-form' ng-if='!token'>\r" +
    "\n" +
    "<input ng-keyup='$event.keyCode == 13 &amp;&amp; submitToken();' ng-model='formData.token' placeholder='Enter GitHub token'>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class='section' ng-if='!token'>\r" +
    "\n" +
    "<a href='https://github.com/settings/tokens/new' target='_blank'>Generate Token</a>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class='section' ng-if='token'>\r" +
    "\n" +
    "<div class='title'>{{formData.loadingRepos ? 'Loading Repositories' : 'Repository'}}</div>\r" +
    "\n" +
    "<select ng-change='didSelectRepo()' ng-if='!formData.loadingRepos' ng-model='formData.selectedRepo'>\r" +
    "\n" +
    "<option ng-repeat='repo in repos' ng-selected='repo == formData.selectedRepo' ng-value='repo'>{{repo.name}}</option>\r" +
    "\n" +
    "</select>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "<div class='buttons' ng-if='formData.selectedRepo'>\r" +
    "\n" +
    "<input class='file-path body-text-color' ng-model='formData.fileDirectory' placeholder='Directory'>\r" +
    "\n" +
    "<input class='file-ext body-text-color' ng-model='formData.fileExtension' placeholder='File extension'>\r" +
    "\n" +
    "<input class='commit-message body-text-color' ng-keyup='$event.keyCode == 13 &amp;&amp; pushChanges($event);' ng-model='formData.commitMessage' placeholder='Commit message (optional)'>\r" +
    "\n" +
    "<button class='element-background-color element-text-color' ng-click='pushChanges($event)'>{{formData.pushStatus}}</button>\r" +
    "\n" +
    "</div>\r" +
    "\n" +
    "</div>\r" +
    "\n"
  );

}]);
