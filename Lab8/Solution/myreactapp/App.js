import React from 'react';
import ReactDOM from 'react-dom'; 
import './App.css';
import $ from 'jquery';

class ContactInfo extends React.Component{
  render() {
    const contact = this.props.displayContact;
    return (
      <div id="wrapper">
      <div id="contactInfo">
        <h2>Contact Info</h2>
        <table>
          <thead>
            <tr>
              <td>Name:</td>
              <td><input id='contactInfoName'  readonly value={contact.name}></input></td>
            </tr>
            <tr>
              <td>Telephone:</td>
              <td><input id='contactInfoTel'  readonly value={contact.tel}></input></td>
            </tr>
            <tr>
              <td>Email:</td>
              <td><input id='contactInfoEmail'  readonly value={contact.email}></input></td>
            </tr>
          </thead>
        </table>
      </div>
      </div>
    );
  }
}

class ContactRow extends React.Component {
  constructor(props) {
    super(props);
    this.handleDisplayInfo = this.handleDisplayInfo.bind(this);
    this.handleDelete = this.handleDelete.bind(this);
    
  }

  handleDisplayInfo(e) {
    e.preventDefault(e);
    this.props.handleDisplayInfo(this.props.contact);
  }
  
  handleDelete(e){
    this.props.handleDelete(e);
  }
  
 render() {
    const contact = this.props.contact;

    return (
      <tr>
        <td><a href="" onClick={this.handleDisplayInfo} rel={contact.Name}>{contact.name}</a></td>        
        <td><a href="" onClick={this.handleDelete} rel={contact._id}>delete</a></td>
      </tr>
    );
  }
}


class ContactList extends React.Component {
  constructor(props) {
    super(props);
    this.handleDisplayInfo = this.handleDisplayInfo.bind(this);
	this.handleDelete = this.handleDelete.bind(this);
	this.handleSortList = this.handleSortList.bind(this);
  }

  handleDisplayInfo(contact){
    this.props.handleDisplayInfo(contact);
  }

  handleDelete(e){
    this.props.handleDelete(e);
  }

  handleSortList() {
    this.props.handleSortList();
  }
  
  render() {
    let rows = [];
    this.props.contacts.map((contact) => {
        rows.push(
          <ContactRow
            contact={contact}
            handleDisplayInfo={this.handleDisplayInfo}
			handleDelete={this.handleDelete}
          />
        );
    });

    return (      
      <div id="contactList">
      <h2> Contact List </h2>        
      <table>
        <thead>
          <tr>
            <th>Name <span > <a id='sort' onClick={this. handleSortList}>sort</a> </span></th>
            <th>Delete?</th>
          </tr>
        </thead>
        <tbody>{rows}</tbody>
      </table>
      </div>
    );
  }
}

class AddOrUpdateContactForm extends React.Component {
  constructor(props) {
	  super(props);

    this.handleNameChange = this.handleNameChange.bind(this);
	this.handleTelChange = this.handleTelChange.bind(this);
	this.handleEmailChange = this.handleEmailChange.bind(this);
    this.handleAddOrUpdate = this.handleAddOrUpdate.bind(this);
  }

  handleNameChange(e) {
    this.props.onNameChange(e.target.value);
  }
  
  handleTelChange(e) {
    this.props.onTelChange(e.target.value);
  }
  
  handleEmailChange(e) {
    this.props.onEmailChange(e.target.value);
  }
  
  handleAddOrUpdate(e) {
    this.props.handleAddOrUpdateSubmit(e);	
  }

  render() {
    return (
      <div id="addContact">
        <h2> Add/Update Contact </h2>            
		
        <fieldset>

          <input className="input_text"
            type="text"
            placeholder = "Name"
            value={this.props.newContactName}
            onChange={this.handleNameChange}
          />
          <br/>
          
          <input
            type="text" className="input_text"
            placeholder = "Telephone Number"
            value={this.props.newContactTel}
            onChange={this.handleTelChange}
          />
          <br/>
          
          <input className="input_text"
            type="text"
            placeholder = "Email"
            value={this.props.newContactEmail}
            onChange={this.handleEmailChange}
          />
          <br/>
			
          <button className="myButton" onClick={this.handleAddOrUpdate}>Add/Update Contact</button>
         
        </fieldset>
      </div>     
    );
  }
}

class ContactPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      contacts: [],
      displayContact:{'name':'','tel':'','email':''},
	  newContactName: '',
      newContactTel: '',
      newContactEmail: '',
	  order: 1		
	};
   this.handleDisplayInfo = this.handleDisplayInfo.bind(this);
   
   this.handleNameChange = this.handleNameChange.bind(this);
   this.handleTelChange = this.handleTelChange.bind(this);
   this.handleEmailChange = this.handleEmailChange.bind(this);
   this.handleAddOrUpdateSubmit = this.handleAddOrUpdateSubmit.bind(this);
   this.handleDelete = this.handleDelete.bind(this);
   this.handleSortList = this.handleSortList.bind(this);
  }

  handleDisplayInfo(contact){
    this.setState({
      displayContact:{'name':contact.name,'tel':contact.tel,'email':contact.email}
    });
  }

  componentDidMount() {
    this.loadContacts();
  }  

  loadContacts() {
    $.ajax({
        url: "http://localhost:3001/users/contactList",
        dataType: 'json',      
        success: function(data) {
          this.setState({
            contacts: data
          });
        }.bind(this),
        error: function (xhr, ajaxOptions, thrownError) {
            alert(xhr.status);
            alert(thrownError);
        }.bind(this)
    });
  }
  
  handleNameChange(name) {
    this.setState({
      newContactName: name
    })
  }
  
  handleTelChange(tel) {
    this.setState({
      newContactTel: tel
    })
  }
  
  handleEmailChange(email) {
    this.setState({
      newContactEmail: email
    })
  }
  
  handleAddOrUpdateSubmit(e) {
       e.preventDefault();  
   
      if (this.state.newContactName === '' || this.state.newContactTel === ''|| this.state.newContactEmail === '') { 
           alert('Please fill in all fields');
      }
     else{
        var existingIndex = -1; 
	       
        for(var i=0; i < this.state.contacts.length; i++){
          if(this.state.newContactName === this.state.contacts[i].name){
            existingIndex = i;
            break;
          }
        }

        if(existingIndex >= 0){
          var existingContact = {
            "_id" : this.state.contacts[existingIndex]._id,
            "name" : this.state.newContactName, 
            "tel" : this.state.newContactTel,
            "email" : this.state.newContactEmail            
          }
          this.handleUpdate(existingIndex, existingContact);
        }else{
          $.post("http://localhost:3001/users/addContact", 
          { 
            "name" : this.state.newContactName, 
            "tel" : this.state.newContactTel,
            "email" : this.state.newContactEmail    
          },
          function(data, status){ 
            if (data.msg ===''){
              this.loadContacts();		
              this.setState({
                newContactName: '',
                newContactTel: '',
                newContactEmail: ''
              }); 
            } else 
              alert(data.msg);
          }.bind(this)
          );
        }   
      }  
   }
  
  handleUpdate(existingIndex, existingContact){
      $.ajax({
        url: "http://localhost:3001/users/updateContact/"+ existingContact._id,
        dataType: 'json',
        type: 'PUT',
        data: existingContact,
        success: function(data) {
          var temp_contacts = this.state.contacts;
          temp_contacts[existingIndex] = existingContact;
          this.setState({
            contacts: temp_contacts,
            newContactName: '',
            newContactTel: '',
            newContactEmail: ''
          });
		  
  	      if(existingContact.name === this.state.displayContact.name){
  	        this.setState({
  	          displayContact: {'name':existingContact.name,'tel':existingContact.tel,'email':existingContact.email}
  	        });
  	      }	   
        }.bind(this),
          error: function (xhr, ajaxOptions, thrownError) {
              alert(xhr.status);
              alert(thrownError);
          }.bind(this)
      });
  }
  
  handleDelete(e){
    e.preventDefault(e);
    
    var confirmation = window.confirm('Are you sure you want to delete this contact?');
    if(confirmation === true){
      var id = e.target.rel;
	  
      $.ajax({
        type: 'DELETE',
        url: "http://localhost:3001/users/deleteContact/"+id,
        dataType: 'json',
        success: function(data) {          
		    var contact_list = this.state.contacts;
		    var deletedContact;
			
		    for(var i = 0; i < contact_list.length; i++){
		      if(contact_list[i]._id === id){
		        deletedContact = contact_list[i];
		        contact_list.splice(i,1);
		        break;
		      }
		    }
		    
		    this.setState({
		      contacts: contact_list
		    });
			
		    if(deletedContact.name === this.state.displayContact.name){
		      this.setState({
		          displayContact: {'name':'','tel':'','email':''}
		        });   
		    }
        }.bind(this),
	  	error: function (xhr, ajaxOptions, thrownError) {
		      alert(xhr.status);
		      alert(thrownError);
		  }.bind(this)
      });
    }
  }
	
  handleSortList() {
    var newContacts = this.state.contacts;
    var order = this.state.order;
	
    newContacts.sort(function(a, b){
      if(order == 1){
        if (a.name > b.name)
          return 1;
        else return -1;            
      }else{
        if (a.name < b.name)
          return 1;
        else return -1;
      }
    });
  
    this.setState({
      order: -1 * this.state.order,
      contacts: newContacts
    });
  }
  
  render() {
    return (
      <div id="wrapper">
        <h1> Lab 8</h1>
        <p>Welcome to Lab 8.</p>
        <ContactInfo 
          displayContact={this.state.displayContact}
        />
        <ContactList 
          contacts={this.state.contacts}
          handleDisplayInfo={this.handleDisplayInfo}
		  handleDelete={this.handleDelete}
		  handleSortList={this.handleSortList}
        />
        <AddOrUpdateContactForm 
          newContactName={this.state.newContactName}
          newContactTel={this.state.newContactTel}
          newContactEmail={this.state.newContactEmail}
          onNameChange={this.handleNameChange}
          onTelChange={this.handleTelChange}
          onEmailChange={this.handleEmailChange}
          handleAddOrUpdateSubmit={this.handleAddOrUpdateSubmit}
          displayContact={this.state.displayContact}
       />		
      </div>
    );
  }
}

export default ContactPage;
