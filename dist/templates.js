angular.module('app').run(['$templateCache', function($templateCache) {
  'use strict';

  $templateCache.put('directives/tag_cell.html',
    "<li>\n" +
    "<div class='self' draggable='true' drop='onDrop' ng-class='{&#39;selected&#39; : tag.selected}' ng-click='selectTag()' tag-id='tag.uuid'>\n" +
    "{{tag.displayTitle}}\n" +
    "</div>\n" +
    "</li>\n" +
    "<li ng-if='tag.children'>\n" +
    "<ul>\n" +
    "<div change-parent='changeParent()' class='tag-cell' ng-repeat='child in tag.children' on-select='onSelect()' tag='child'></div>\n" +
    "</ul>\n" +
    "</li>\n"
  );


  $templateCache.put('directives/tag_tree.html',
    "<div ng-if='tag'>\n" +
    "<div class='self' draggable='true' drop='onDrop' is-draggable='!tag.master' ng-class='{&#39;selected&#39; : tag.selected}' ng-click='selectTag()' tag-id='tag.uuid'>\n" +
    "<div class='info'>\n" +
    "<div class='circle' ng-class='circleClassForTag(tag)'></div>\n" +
    "<div class='title'>\n" +
    "{{tag.displayTitle}}\n" +
    "</div>\n" +
    "</div>\n" +
    "</div>\n" +
    "<div ng-repeat='child in tag.children'>\n" +
    "<div change-parent='changeParent()' class='tag-tree' on-select='onSelect()' tag='child'></div>\n" +
    "</div>\n" +
    "</div>\n"
  );


  $templateCache.put('home.html',
    "<div class='center-container body-text-color' ng-if='!formData.loading'>\n" +
    "<div class='meta'>\n" +
    "<div class='title'>GitHub Push</div>\n" +
    "<a class='logout' ng-click='logout()' ng-if='token'>Logout</a>\n" +
    "</div>\n" +
    "<div class='section token-form' ng-if='!token'>\n" +
    "<input ng-keyup='$event.keyCode == 13 &amp;&amp; submitToken();' ng-model='formData.token' placeholder='Enter GitHub token'>\n" +
    "</div>\n" +
    "<div class='section' ng-if='!token'>\n" +
    "<a href='https://github.com/settings/tokens/new' target='_blank'>Generate Token</a>\n" +
    "</div>\n" +
    "<div class='section' ng-if='token'>\n" +
    "<div class='title'>{{formData.loadingRepos ? 'Loading Repositories' : 'Repository'}}</div>\n" +
    "<select ng-change='didSelectRepo()' ng-if='!formData.loadingRepos' ng-model='formData.selectedRepo'>\n" +
    "<option ng-repeat='repo in repos' ng-selected='repo == formData.selectedRepo' ng-value='repo'>{{repo.name}}</option>\n" +
    "</select>\n" +
    "</div>\n" +
    "<div class='buttons' ng-if='formData.selectedRepo'>\n" +
    "<input class='file-ext body-text-color' ng-model='formData.fileExtension' placeholder='File extension'>\n" +
    "<input class='commit-message body-text-color' ng-keyup='$event.keyCode == 13 &amp;&amp; pushChanges($event);' ng-model='formData.commitMessage' placeholder='Commit message (optional)'>\n" +
    "<button class='element-background-color element-text-color' ng-click='pushChanges($event)'>{{formData.pushStatus}}</button>\n" +
    "</div>\n" +
    "</div>\n"
  );

}]);
