var contactListApp = angular.module('contactList', []);

contactListApp.controller('contactListController', function($scope, $http){
	$scope.contacts = null;
	
	$scope.getContacts = function(){
		$http.get("/users/contactList").then(function(response){
	        $scope.contacts = response.data;
	    }, function(response){
	        alert("Error getting contacts.");
	    });
	};
	
	$scope.selected_contact = {_id:"", name:"", tel:"", email:""};

	$scope.showContact = function(contact){
		$scope.selected_contact = contact;
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
			
			$http.post("/users/addContact", newContact).then(function(response){
			        if(response.data.msg===''){
			            $scope.getContacts();
			            $scope.contact_input = {name:"", tel:"", email:""};
			        }
			        else{
			            alert("Error adding contact.");
			        }
			      }, function(response){
			        alert("Error adding contact.");
			      });
		}
	};
	
	
	$scope.updateContact = function(contact){
		var id = contact._id;
		var url = "/users/updateContact/" + id;
		
		$http.put(url, contact).then(function(response){
			if (response.data.msg === ''){
				$scope.getContacts();
				$scope.contact_input = {name:"", tel:"", email:""};
				
				if ($scope.selected_contact.name ==  contact.name)
					$scope.showContact(contact);
				
			} else{
				alert(response.data.msg);
			}
		}, function(response){
			alert("Error updating contact");
		});
	};
	
	$scope.deleteContact = function(id){
		// Pop up a confirmation dialog
	    var confirmation = confirm('Are you sure you want to delete this contact?');

	    // Check and make sure the contact confirmed
	    if (confirmation === true) {
	   	 	var url = "/users/deleteContact/"+id;
			
	  	  	$http.delete(url).then(function(response){
	        	if(response.data.msg===''){
					if($scope.selected_contact._id == id)
					{
						$scope.selected_contact = {_id:"", name:"", tel:"", email:""};
					}
	          		$scope.getContacts();
	        	}
	        	else{
	          	  alert(response.data.msg);
	        	}
	  		}, function(response){
	    		alert("Error deleting contacts.");
	  		});
		}
		else {
			// If they said no to the confirm, do nothing
	    	return false;
		}
	};
	
	// for sorting order
	$scope.order = 1;
	
	$scope.sortList = function(){
		$scope.contacts.sort(function(a, b){
	        if($scope.order == 1){
				if (a.name > b.name)
					return 1;
					else return -1;            
	        }else{
				if (a.name < b.name)
					return 1;
					else return -1;
	        }
	    });
	    
	    $scope.order *= -1;
	};
	
});

