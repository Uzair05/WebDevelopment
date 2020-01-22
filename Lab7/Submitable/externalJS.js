var contactListApp = angular.module('contactList', []);

contactListApp.controller('contactListController', function($scope, $http){


//$scope.sortList(contact)

  // for sorting order
  $scope.order = 1;
  $scope.sortList = function() {
    $scope.order += 1;
    $scope.SortMe($scope.contacts)
  }

  $scope.SortMe = function(contact){
    if($scope.order%2 == 1){
      for(var i=0;i<contact.length;i++){
        for(var m=0;m<(contact.length-1);m++){
          if (contact[m].name < contact[m+1].name){
            var xor = contact[m];
            contact[m] = contact[m+1];
            contact[m+1] = xor;
          }
        }
      }
    }else{
      for(var i=0;i<contact.length;i++){
        for(var m=0;m<(contact.length-1);m++){
          if (contact[m].name > contact[m+1].name){
            var xor = contact[m];
            contact[m] = contact[m+1];
            contact[m+1] = xor;
          }
        }
      }
    }
  }


  $scope.deleteContact = function(id){
    // Pop up a confirmation dialog
    var confirmation = confirm('Are you sure you want to delete this contact?');
    // Check and make sure the contact confirmed
    if (confirmation === true) {
      var url = "users/deleteContact/" + id;
      $http.delete(url).then(function(response){
        $scope.getContacts();
        $scope.new_contact = {_id:"", name:"", tel:"", email:""};
        $scope.showContact(contact);
      }, function(response){
        alert("Error deleting contacts.");
      });
    } else {
      // If they said no to the confirm, do nothing
      return false;
    }
  };


  $scope.updateContact = function(contact){
    var id = contact._id;
    var url = "/users/updateContact/" + id;
    var newContact = {
      "tel":contact.tel,
      "email":contact.email
    }
    $http.put(url, newContact).then(function(response){
      if (response.data.msg === ''){
        $scope.getContacts();
        $scope.new_contact = {_id:"", name:"", tel:"", email:""};
        $scope.showContact(contact);
      } else{
        alert(response.data.msg);
      }
    }, function(response){
      alert("Error updating contact");
    });
  };

  $scope.addOrUpdateContact = function(contact){
  // Super basic validation - increase errorCount variable if any fields are blank
  var errorCount = 0;
  if(contact.name == "" || contact.tel == "" || contact.email == ""){
    alert('Please fill in all fields');
    return false;
  }
  var existContactIndex = -1;
  if ($scope.contacts != null){
    for (var i = 0; i < $scope.contacts.length; i++){
      if($scope.contacts[i].name == contact.name){
        existContactIndex = i;
        break;
      }
    }
  }
  if(existContactIndex >= 0){
    var existingContact = {
      '_id': $scope.contacts[existContactIndex]._id,
      'name': contact.name,
      'email': contact.email,
      'tel': contact.tel
    };
    $scope.updateContact(existingContact);
  } else{
    var newContact = {
      'name': contact.name,
      'email': contact.email,
      'tel': contact.tel
    }
    $http.post("/users/addContact",newContact).then(function(response){
      if(response.data.msg===''){
        $scope.getContacts();
        $scope.new_contact = {_id:"", name:"", tel:"", email:""};
      }
      else{
        alert("Error adding contact.");
      }
    }, function(response){
      alert("Error adding contact.");
    });
  }
  };
  $scope.selected_contact = {_id:"", name:"", tel:"", email:""};
  $scope.showContact = function(contact){
    $scope.selected_contact = contact;
  };


  $scope.contacts = null;
  $scope.getContacts = function(){
    $http.get("/users/contactList").then(function(response){
      $scope.contacts = response.data;
    }, function(response){
      alert("Error getting contacts.");
    });
  };
});
